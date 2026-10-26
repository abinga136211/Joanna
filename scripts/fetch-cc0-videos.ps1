$ErrorActionPreference = "Stop"
$outDir = (Resolve-Path (Join-Path $PSScriptRoot "..\image")).Path
$ua = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" }

$items = @(
  @{
    file = "hk-skyline.mp4"
    theme = "Hong Kong skyline / MSO"
    title = "Hong Kong skyline panorama at daytime"
    page = "https://mixkit.co/free-stock-video/hong-kong-skyline-panorama-at-daytime-30997/"
    url = "https://assets.mixkit.co/videos/30997/30997-720.mp4"
  },
  @{
    file = "cargo-shipping.mp4"
    theme = "Cross-border trade / shipping"
    title = "Cargo ship arriving to container terminal"
    page = "https://mixkit.co/free-stock-video/cargo-ship-arriving-to-container-terminal-30979/"
    url = "https://assets.mixkit.co/videos/30979/30979-720.mp4"
  },
  @{
    file = "hk-container-port.mp4"
    theme = "Hong Kong port / logistics"
    title = "From day to night in the Hong Kong container port"
    page = "https://mixkit.co/free-stock-video/from-day-to-night-in-the-hong-kong-container-port-30955/"
    url = "https://assets.mixkit.co/videos/30955/30955-720.mp4"
  },
  @{
    file = "business-handshake.mp4"
    theme = "Business partnership"
    title = "Silhouette of business handshake in skyscraper"
    page = "https://mixkit.co/free-stock-video/silhouette-of-business-handshake-in-skyscraper-15795/"
    url = "https://assets.mixkit.co/videos/15795/15795-720.mp4"
  },
  @{
    file = "office-meeting.mp4"
    theme = "Local team / meeting"
    title = "Business people at work meeting"
    page = "https://mixkit.co/free-stock-video/business-people-at-work-meeting-4809/"
    url = "https://assets.mixkit.co/videos/4809/4809-720.mp4"
  },
  @{
    file = "card-payment.mp4"
    theme = "Card payment"
    title = "Using a bank terminal during a card payment"
    page = "https://mixkit.co/free-stock-video/using-a-bank-terminal-during-a-card-payment-6367/"
    url = "https://assets.mixkit.co/videos/6367/6367-720.mp4"
  },
  @{
    file = "mobile-banking.mp4"
    theme = "Mobile banking / VA"
    title = "Entering bank data on a smartphone"
    page = "https://mixkit.co/free-stock-video/entering-bank-data-on-a-smartphone-35902/"
    url = "https://assets.mixkit.co/videos/35902/35902-720.mp4"
  },
  @{
    file = "financial-district.mp4"
    theme = "Financial district night"
    title = "Hong Kong cityscape at night"
    page = "https://mixkit.co/free-stock-video/hong-kong-cityscape-at-night-20215/"
    url = "https://assets.mixkit.co/videos/20215/20215-720.mp4"
  }
)

$results = New-Object System.Collections.Generic.List[object]

foreach ($item in $items) {
  Write-Host ""
  Write-Host (">>> " + $item.file)
  $html = (Invoke-WebRequest -Uri $item.page -Headers $ua -UseBasicParsing).Content
  if ($html -match "Restricted License") {
    Write-Host "  SKIP: Restricted License"
    continue
  }

  $dest = Join-Path $outDir $item.file
  Write-Host ("  GET " + $item.url)
  try {
    Invoke-WebRequest -Uri $item.url -Headers $ua -OutFile $dest -UseBasicParsing
  } catch {
    Write-Host ("  FAIL " + $_.Exception.Message)
    continue
  }

  $size = (Get-Item $dest).Length
  if ($size -lt 50000) {
    Write-Host ("  FAIL too small: " + $size)
    Remove-Item $dest -Force
    continue
  }

  Write-Host ("  OK " + [math]::Round($size / 1MB, 2) + " MB")
  $results.Add([ordered]@{
      file         = $item.file
      theme        = $item.theme
      title        = $item.title
      provider     = "mixkit"
      license      = "Mixkit Stock Video Free License"
      license_url  = "https://mixkit.co/license/#videoFree"
      license_note = "Free commercial use, no attribution required. Practically CC0-level for website use; not identical CC0 legalese. Do not redistribute as standalone stock."
      source_page  = $item.page
      video_url    = $item.url
      bytes        = $size
    }) | Out-Null
  Start-Sleep -Seconds 1
}

$manifest = Join-Path $outDir "videos-manifest.json"
$results | ConvertTo-Json -Depth 5 | Set-Content -Path $manifest -Encoding UTF8
Write-Host ""
Write-Host ("Saved " + $results.Count + " videos -> " + $manifest)
Get-ChildItem (Join-Path $outDir "*.mp4") | Select-Object Name, @{ n = "MB"; e = { [math]::Round($_.Length / 1MB, 2) } } | Format-Table -AutoSize
