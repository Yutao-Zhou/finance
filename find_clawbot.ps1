Set-Location "C:\Users\Yutao Zhou\.openclaw\workspace"
Write-Host "Looking for clawbot-memory repository..."
$clawbotDir = Get-ChildItem -Recurse -Directory -Name "clawbot-memory" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($clawbotDir) {
    Write-Host "Found: $($clawbotDir.FullName)"
    $template = Get-ChildItem -Recurse -Path $clawbotDir.FullName -Include "MORNING_BRIEF_TEMPLATE.md" -File | Select-Object -First 1
    $notes = Get-ChildItem -Recurse -Path $clawbotDir.FullName -Include "MORNING_BRIEF_RUNTIME_NOTES.md" -File | Select-Object -First 1
    
    if ($template) {
        Write-Host "=== MORNING_BRIEF_TEMPLATE.md ==="
        Get-Content $template.FullName
    }
    if ($notes) {
        Write-Host "`n=== MORNING_BRIEF_RUNTIME_NOTES.md ==="
        Get-Content $notes.FullName
    }
} else {
    Write-Host "clawbot-memory not found"
}

Write-Host "`nLooking for finance repository..."
$financeDir = Get-ChildItem -Recurse -Directory -Name "finance" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($financeDir) {
    Write-Host "Found: $($financeDir.FullName)"
    $dev = Get-ChildItem -Recurse -Path $financeDir.FullName -Include "DEVELOPMENT.md" -File | Select-Object -First 1
    if ($dev) {
        Write-Host "`n=== DEVELOPMENT.md ==="
        Get-Content $dev.FullName
    }
} else {
    Write-Host "finance not found"
}
