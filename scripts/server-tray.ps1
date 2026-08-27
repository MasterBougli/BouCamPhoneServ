param(
  [Parameter(Mandatory = $true)]
  [int]$ServerPid,
  [string]$DashboardUrl = "http://localhost:8080/",
  [string]$MosaicUrl = "http://localhost:8080/mosaic",
  [string]$ConfigUrl = "http://localhost:8080/config"
)

$ErrorActionPreference = "SilentlyContinue"
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Ouvre une page du serveur dans le navigateur par défaut.
function Open-ServerPage {
  param([string]$Url)
  Start-Process $Url
}

# Indique si le processus Node associé au serveur existe toujours.
function Test-ServerProcess {
  return $null -ne (Get-Process -Id $ServerPid -ErrorAction SilentlyContinue)
}

$menu = New-Object System.Windows.Forms.ContextMenuStrip
$dashboardItem = $menu.Items.Add("Ouvrir le tableau de bord")
$mosaicItem = $menu.Items.Add("Ouvrir la mosaïque")
$configItem = $menu.Items.Add("Configuration")
[void]$menu.Items.Add((New-Object System.Windows.Forms.ToolStripSeparator))
$stopItem = $menu.Items.Add("Arrêter le serveur")

$notifyIcon = New-Object System.Windows.Forms.NotifyIcon
$notifyIcon.Icon = [System.Drawing.SystemIcons]::Application
$notifyIcon.Text = "BouCamPhoneServ - serveur actif"
$notifyIcon.ContextMenuStrip = $menu
$notifyIcon.Visible = $true

$dashboardItem.Add_Click({ Open-ServerPage $DashboardUrl })
$mosaicItem.Add_Click({ Open-ServerPage $MosaicUrl })
$configItem.Add_Click({ Open-ServerPage $ConfigUrl })
$notifyIcon.Add_DoubleClick({ Open-ServerPage $DashboardUrl })

$stopItem.Add_Click({
  $choice = [System.Windows.Forms.MessageBox]::Show(
    "Arrêter BouCamPhoneServ et couper toutes les caméras ?",
    "BouCamPhoneServ",
    [System.Windows.Forms.MessageBoxButtons]::YesNo,
    [System.Windows.Forms.MessageBoxIcon]::Question
  )
  if ($choice -eq [System.Windows.Forms.DialogResult]::Yes) {
    $notifyIcon.Visible = $false
    $notifyIcon.Dispose()
    Stop-Process -Id $ServerPid -ErrorAction SilentlyContinue
    [System.Windows.Forms.Application]::Exit()
  }
})

$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 2000
$timer.Add_Tick({
  if (-not (Test-ServerProcess)) {
    $timer.Stop()
    $notifyIcon.Visible = $false
    $notifyIcon.Dispose()
    [System.Windows.Forms.Application]::Exit()
  }
})
$timer.Start()

$notifyIcon.ShowBalloonTip(
  2500,
  "BouCamPhoneServ",
  "Le serveur est actif. Double-clique pour ouvrir le tableau de bord.",
  [System.Windows.Forms.ToolTipIcon]::Info
)

[System.Windows.Forms.Application]::Run()
