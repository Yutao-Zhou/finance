Set-Location "C:\Users\Yutao Zhou\.openclaw\workspace"

Write-Host "=== All directories in workspace ==="
Get-ChildItem -Directory | ForEach-Object { Write-Host $_.Name }

Write-Host "`n=== Searching for clawbot-memory ==="
$clawbot = Get-ChildItem -Recurse -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq "clawbot-memory" }
if ($clawbot) {
    Write-Host "Found: $($clawbot.FullName)"
    Get-ChildItem -Path $clawbot.FullName -Recurse -Include "*.md" -File | ForEach-Object { Write-Host $_.FullName }
} else {
    Write-Host "clawbot-memory NOT found in workspace"
}
