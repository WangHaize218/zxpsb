$ErrorActionPreference = "Stop"

$listener = [System.Net.HttpListener]::new()
$prefix = "http://127.0.0.1:4174/"
$root = Join-Path $PSScriptRoot "dist"

$contentTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png" = "image/png"
  ".jpg" = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".svg" = "image/svg+xml"
  ".ico" = "image/x-icon"
  ".txt" = "text/plain; charset=utf-8"
}

$listener.Prefixes.Add($prefix)
$listener.Start()

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $requestPath = [System.Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart("/"))

    if ([string]::IsNullOrWhiteSpace($requestPath)) {
      $requestPath = "index.html"
    }

    $candidate = Join-Path $root $requestPath

    if ((Test-Path $candidate) -and -not (Get-Item $candidate).PSIsContainer) {
      $filePath = $candidate
    } else {
      $filePath = Join-Path $root "index.html"
    }

    $extension = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
    $contentType = $contentTypes[$extension]
    if (-not $contentType) {
      $contentType = "application/octet-stream"
    }

    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $context.Response.StatusCode = 200
    $context.Response.ContentType = $contentType
    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $context.Response.OutputStream.Close()
  }
}
finally {
  $listener.Stop()
  $listener.Close()
}
