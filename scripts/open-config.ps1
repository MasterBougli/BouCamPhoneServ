param(
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
  [string]$ConfigUrl = "http://localhost:8080/config",
  [string]$BootstrapUrl = "http://localhost:8080/api/bootstrap"
)

$ErrorActionPreference = "Stop"

function Test-ServerRunning {
  try {
    Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 -Uri $BootstrapUrl | Out-Null
    return $true
  } catch {
    return $false
  }
}

function Wait-ForServer {
  param(
    [int]$TimeoutSeconds = 20
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    if (Test-ServerRunning) {
      return $true
    }
    Start-Sleep -Seconds 1
  }

  return (Test-ServerRunning)
}

if (-not (Test-ServerRunning)) {
  Start-Process -WindowStyle Hidden -WorkingDirectory $Root -FilePath "cmd.exe" -ArgumentList "/c", "npm start"
  Wait-ForServer | Out-Null
}

Start-Process $ConfigUrl
