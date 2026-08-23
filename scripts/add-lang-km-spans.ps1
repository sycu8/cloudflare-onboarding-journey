$root = Join-Path $PSScriptRoot '..\src'
$updated = 0

function To-KmExpression([string]$expr) {
  $e = $expr.Trim()
  if ($e -match '\bKm\b') { return $e }
  $e = [regex]::Replace($e, '([\w.?[\]''"]+)\.(\w+)En(\s*\?\?\s*\1\.\2Vi)', '$1.$2Km$3 ?? $1.$2En$3')
  $e = [regex]::Replace($e, '([\w.]+)\.(\w+)En\?\.(\[[^\]]+\])\s*\?\?\s*', '$1.$2Km?.$3 ?? $1.$2En?.$3 ?? ')
  if ($e -match '^(\w+)\.en$') { return "$($Matches[1]).km ?? $($Matches[1]).en" }
  if ($e -match '^(\w+)\.titleEn$') { return "$($Matches[1]).titleKm ?? $($Matches[1]).titleEn" }
  if ($e -match "getContentTopicTitle\(([^,]+),\s*'en'\)") {
    $id = $Matches[1]
    return "getContentTopicTitle($id, 'km') ?? getContentTopicTitle($id, 'en')"
  }
  return $e
}

function Add-KmSpans([string]$src) {
  $spanRe = '(?s)(<span (?:class|className)="[^"]*\blang-en\b[^"]*">)(.*?)(</span>)(?!\s*\n?\s*<span (?:class|className)="[^"]*\blang-km\b)'
  return [regex]::Replace($src, $spanRe, {
    param($m)
    $open = $m.Groups[1].Value
    $inner = $m.Groups[2].Value
    $close = $m.Groups[3].Value
    $offset = $m.Index
    $lineStart = $src.LastIndexOf("`n", [Math]::Max(0, $offset - 1)) + 1
    $indent = if ($offset -gt $lineStart) { ($src.Substring($lineStart, $offset - $lineStart) -replace '(\s*).*', '$1') } else { '      ' }
    $trimmed = $inner.Trim()
    if ($trimmed.StartsWith('{') -and $trimmed.EndsWith('}')) {
      $expr = $trimmed.Substring(1, $trimmed.Length - 2)
      $kmInner = '{' + (To-KmExpression $expr) + '}'
    } else {
      $kmInner = $trimmed
    }
    $openKm = $open -replace '\blang-en\b', 'lang-km'
    return "$open$inner$close`n$indent$openKm$kmInner$close"
  })
}

function Add-KmToLevelLabels([string]$src) {
  return [regex]::Replace($src, "(\w+:\s*\{\s*vi:\s*'[^']*',\s*en:\s*'([^']*)'\s*\})", {
    param($m)
    if ($m.Value -match 'km:') { return $m.Value }
    $enVal = $m.Groups[2].Value
    $kmMap = @{
      'Foundation' = 'មូលដ្ឋាន'
      'Beginner' = 'អ្នកចាប់ផ្តើម'
      'Intermediate' = 'កម្រិតមធ្យម'
      'From zero' = 'ចាប់ផ្តើមពីសូន្យ'
      'Basic' = 'មូលដ្ឋាន'
      'Technical' = 'បច្ចេកទេស'
      'Mixed' = 'ចម្រុះ'
    }
    $km = if ($kmMap.ContainsKey($enVal)) { $kmMap[$enVal] } else { $enVal }
    return $m.Value -replace '\}\s*$', ", km: '$km' }"
  })
}

Get-ChildItem -Path $root -Recurse -Include *.astro,*.tsx | ForEach-Object {
  $src = [IO.File]::ReadAllText($_.FullName)
  if ($src -notmatch 'lang-en') { return }
  $orig = $src
  $src = Add-KmToLevelLabels $src
  $src = Add-KmSpans $src
  if ($src -ne $orig) {
    [IO.File]::WriteAllText($_.FullName, $src)
    $script:updated++
    Write-Host "updated $($_.FullName.Replace($root, ''))"
  }
}
Write-Host "Done. $updated files updated."
