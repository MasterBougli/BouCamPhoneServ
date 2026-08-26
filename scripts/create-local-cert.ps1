param(
  [string]$OutputDir = (Join-Path $PSScriptRoot "..\certs"),
  [string]$Password = "camfromphone",
  [int]$DaysValid = 825
)

$ErrorActionPreference = "Stop"

function Get-LocalIPv4Addresses {
  $seen = New-Object System.Collections.Generic.HashSet[string]
  $addresses = New-Object System.Collections.Generic.List[string]

  try {
    foreach ($networkInterface in [System.Net.NetworkInformation.NetworkInterface]::GetAllNetworkInterfaces()) {
      if ($networkInterface.OperationalStatus -ne [System.Net.NetworkInformation.OperationalStatus]::Up) {
        continue
      }

      $properties = $networkInterface.GetIPProperties()
      foreach ($unicast in $properties.UnicastAddresses) {
        if ($unicast.Address.AddressFamily -ne [System.Net.Sockets.AddressFamily]::InterNetwork) {
          continue
        }

        $ip = $unicast.Address.IPAddressToString
        if ($ip -eq "127.0.0.1" -or $ip -like "169.254.*") {
          continue
        }

        if ($seen.Add($ip)) {
          $addresses.Add($ip)
        }
      }
    }
  } catch {
    Write-Warning "Unable to read local IPv4 addresses automatically. The certificate will still work for localhost and loopback."
  }

  return $addresses
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$subject = "CN=boucamphoneserv.local"
$rsa = [System.Security.Cryptography.RSA]::Create(2048)
$request = [System.Security.Cryptography.X509Certificates.CertificateRequest]::new(
  $subject,
  $rsa,
  [System.Security.Cryptography.HashAlgorithmName]::SHA256,
  [System.Security.Cryptography.RSASignaturePadding]::Pkcs1
)

$request.CertificateExtensions.Add(
  [System.Security.Cryptography.X509Certificates.X509BasicConstraintsExtension]::new($false, $false, 0, $true)
)
$request.CertificateExtensions.Add(
  [System.Security.Cryptography.X509Certificates.X509KeyUsageExtension]::new(
    [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::DigitalSignature -bor
    [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::KeyEncipherment,
    $true
  )
)
$request.CertificateExtensions.Add(
  [System.Security.Cryptography.X509Certificates.X509SubjectKeyIdentifierExtension]::new($request.PublicKey, $false)
)

$sanBuilder = [System.Security.Cryptography.X509Certificates.SubjectAlternativeNameBuilder]::new()
$sanBuilder.AddDnsName("localhost")
$sanBuilder.AddIpAddress([System.Net.IPAddress]::Loopback)
$sanBuilder.AddIpAddress([System.Net.IPAddress]::IPv6Loopback)

foreach ($ip in Get-LocalIPv4Addresses) {
  try {
    $sanBuilder.AddIpAddress([System.Net.IPAddress]::Parse($ip))
  } catch {
    Write-Warning "Skipping invalid local IP address: $ip"
  }
}

$request.CertificateExtensions.Add($sanBuilder.Build())

$notBefore = (Get-Date).AddMinutes(-5)
$notAfter = (Get-Date).AddDays($DaysValid)
$cert = $request.CreateSelfSigned($notBefore, $notAfter)

$securePassword = New-Object System.Security.SecureString
foreach ($character in $Password.ToCharArray()) {
  $securePassword.AppendChar($character)
}
$securePassword.MakeReadOnly()

$pfxBytes = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Pfx, $securePassword)
$pfxPath = Join-Path $OutputDir "local.pfx"
$cerPath = Join-Path $OutputDir "local.cer"

[System.IO.File]::WriteAllBytes($pfxPath, $pfxBytes)
[System.IO.File]::WriteAllBytes($cerPath, $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert))

Write-Host "Generated certificate files:"
Write-Host "  $pfxPath"
Write-Host "  $cerPath"
Write-Host ""
Write-Host "Use the CER file to trust the local server on phones."
