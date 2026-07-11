$ErrorActionPreference = "Stop"

$workerDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$keyFile = Join-Path $workerDir ".deepseek-api-key"

if (-not (Test-Path -LiteralPath $keyFile)) {
    throw "Key file not found: $keyFile"
}

$apiKey = (Get-Content -Raw -LiteralPath $keyFile).Trim()

if (-not $apiKey -or $apiKey -match "DeepSeek API Key") {
    throw "Open .deepseek-api-key and replace the placeholder with your real DeepSeek API Key."
}

if ($apiKey -notmatch "^sk-") {
    Write-Warning "The key does not start with sk-. Confirm that it is a DeepSeek API Key."
}

Push-Location $workerDir
try {
    Write-Host "Uploading DEEPSEEK_API_KEY to Cloudflare Worker Secret..."
    $apiKey | npx wrangler@latest secret put DEEPSEEK_API_KEY
    if ($LASTEXITCODE -ne 0) {
        throw "Secret upload failed. Wrangler exit code: $LASTEXITCODE"
    }

    Write-Host "Deploying tryrevive-ai-deepseek..."
    npx wrangler@latest deploy
    if ($LASTEXITCODE -ne 0) {
        throw "Worker deployment failed. Wrangler exit code: $LASTEXITCODE"
    }

    Write-Host "Done. Worker URL:"
    Write-Host "https://tryrevive-ai-deepseek.tryrevive-deepseek.workers.dev"
} finally {
    $apiKey = $null
    Pop-Location
}
