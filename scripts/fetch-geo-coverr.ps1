$ErrorActionPreference = "Continue"
$ua = @{
  "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}
$outDir = (Resolve-Path (Join-Path $PSScriptRoot "..\image")).Path

$jobs = @(
  @{ key = "hk"; file = "geo-hongkong.mp4"; theme = "Hong Kong skyline/environment"; pages = @("hong-kong"); must = "hong-kong|victoria|kowloon|tsim-sha" },
  @{ key = "sg"; file = "geo-singapore.mp4"; theme = "Singapore skyline/environment"; pages = @("singapore", "marina-bay"); must = "singapore|marina-bay|gardens-by" },
  @{ key = "tw"; file = "geo-taiwan.mp4"; theme = "Taiwan skyline/environment"; pages = @("taiwan", "taipei"); must = "taiwan|taipei" },
  @{ key = "kr"; file = "geo-korea.mp4"; theme = "Korea skyline/environment"; pages = @("seoul", "korea", "south-korea"); must = "seoul|korea|busan|han-river|gangnam" },
  @{ key = "au"; file = "geo-australia.mp4"; theme = "Australia skyline/environment"; pages = @("sydney", "australia", "melbourne"); must = "sydney|melbourne|australia|opera|harbour-bridge|uluru" },
  @{ key = "ca"; file = "geo-canada.mp4"; theme = "Canada skyline/environment"; pages = @("toronto", "vancouver", "canada"); must = "toronto|vancouver|canada|cn-tower|montreal" },
  @{ key = "za"; file = "geo-south-africa.mp4"; theme = "South Africa environment"; pages = @("cape-town", "south-africa", "johannesburg"); must = "cape-town|south-africa|table-mountain|johannesburg" },
  @{ key = "fr"; file = "geo-france.mp4"; theme = "France skyline/environment"; pages = @("paris", "france"); must = "paris|france|eiffel|seine|louvre|arc-de" },
  @{ key = "it"; file = "geo-italy.mp4"; theme = "Italy skyline/environment"; pages = @("rome", "italy", "milan", "venice"); must = "rome|italy|milan|venice|colosseum|vatican|florence|italian" },
  @{ key = "ae"; file = "geo-uae.mp4"; theme = "UAE skyline/environment"; pages = @("dubai", "abu-dhabi", "uae"); must = "dubai|abu-dhabi|uae|burj|emirates|sheikh" }
)

$picked = New-Object System.Collections.Generic.List[object]

foreach ($j in $jobs) {
  Write-Host ""
  Write-Host ("=== " + $j.key + " ===")
  $matches = @()
  foreach ($p in $j.pages) {
    $pageUrl = "https://coverr.co/stock-video-footage/" + $p
    Write-Host (" fetch " + $pageUrl)
    try {
      $html = (Invoke-WebRequest -Uri $pageUrl -Headers $ua -UseBasicParsing).Content
    } catch {
      Write-Host (" ERR " + $p)
      Start-Sleep -Seconds 1
      continue
    }
    $all = [regex]::Matches($html, "https://cdn\.coverr\.co/videos/(coverr-[^/`"'\s]+)/1080p\.mp4") |
      ForEach-Object { $_.Groups[1].Value } |
      Select-Object -Unique
    $hit = @($all | Where-Object {
        ($_ -match $j.must) -and ($_ -notmatch "temp-|user-ai-|paywall|coffee|spider|stirring")
      })
    Write-Host ("  " + $p + " total=" + @($all).Count + " matched=" + $hit.Count)
    foreach ($h in $hit) {
      Write-Host ("   - " + $h)
      $matches += [pscustomobject]@{
        region = $j.key
        theme  = $j.theme
        query  = $p
        page   = $pageUrl
        title  = $h
        url    = ("https://cdn.coverr.co/videos/" + $h + "/1080p.mp4")
        url720 = ("https://cdn.coverr.co/videos/" + $h + "/720p.mp4")
      }
    }
    Start-Sleep -Seconds 1
  }

  $uniq = @($matches | Sort-Object title -Unique)
  if ($uniq.Count -eq 0) {
    Write-Host " NONE matched by place-name"
    continue
  }

  $i = 0
  foreach ($m in ($uniq | Select-Object -First 2)) {
    $i++
    $file = if ($i -eq 1) { $j.file } else { $j.file -replace "\.mp4$", "-2.mp4" }
    $picked.Add([pscustomobject]@{
        region = $m.region
        file   = $file
        theme  = $m.theme
        title  = $m.title
        page   = $m.page
        url    = $m.url
        url720 = $m.url720
        query  = $m.query
      }) | Out-Null
  }
}

$pickedPath = Join-Path $PSScriptRoot "coverr-geo-matched.json"
$picked | ConvertTo-Json -Depth 5 | Set-Content -Path $pickedPath -Encoding UTF8
Write-Host ""
Write-Host ("MATCHED " + $picked.Count)
$picked | Format-Table region, file, title -AutoSize

# Download
$results = New-Object System.Collections.Generic.List[object]
foreach ($item in $picked) {
  $dest = Join-Path $outDir $item.file
  Write-Host (">>> " + $item.file)
  $ok = $false
  foreach ($u in @($item.url, $item.url720)) {
    try {
      Invoke-WebRequest -Uri $u -Headers $ua -OutFile $dest -UseBasicParsing
      $size = (Get-Item $dest).Length
      if ($size -lt 50000) {
        Remove-Item $dest -Force -ErrorAction SilentlyContinue
        continue
      }
      Write-Host ("  OK " + [math]::Round($size / 1MB, 2) + " MB from " + $u)
      $results.Add([ordered]@{
          file            = $item.file
          theme           = $item.theme
          title           = $item.title
          region          = $item.region
          provider        = "coverr"
          license         = "Coverr Free License"
          license_url     = "https://coverr.co/license"
          license_note    = "Free commercial and non-commercial use; no attribution required. Coverr historically CC0-rooted; current free commercial license. Edit/remix allowed. Do not redistribute as standalone stock."
          source_page     = $item.page
          video_url       = $u
          bytes           = $size
        }) | Out-Null
      $ok = $true
      break
    } catch {
      Write-Host ("  fail " + $u)
    }
  }
  if (-not $ok) { Write-Host "  FAIL all urls" }
  Start-Sleep -Seconds 1
}

$geoManifest = Join-Path $outDir "geo-videos-manifest.json"
$results | ConvertTo-Json -Depth 5 | Set-Content -Path $geoManifest -Encoding UTF8
Write-Host ""
Write-Host ("Downloaded " + $results.Count + " -> " + $geoManifest)
Get-ChildItem (Join-Path $outDir "geo-*.mp4") | Select-Object Name, @{ n = "MB"; e = { [math]::Round($_.Length / 1MB, 2) } } | Format-Table -AutoSize
