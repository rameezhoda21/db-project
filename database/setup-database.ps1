param(
    [string]$User = "hasan",
    [string]$Password = "123",
    [string]$ConnectString = "localhost:1521/ORCL"
)

Write-Host "`n========================================"
Write-Host "  Library Database Setup Script"
Write-Host "========================================`n"

$sqlFiles = @(
    "00_drop_all.sql",
    "00_sequences.sql",
    "01_create_tables.sql",
    "02_views_oracle.sql",
    "03_triggers.sql",
    "04_login_credentials.sql"
)

Write-Host "Database Path: $PSScriptRoot"
Write-Host "Connect String: $ConnectString"
Write-Host "User: $User`n"

$successCount = 0
$failCount = 0

foreach ($file in $sqlFiles)
{
    $fullPath = Join-Path $PSScriptRoot $file
    
    if (-not (Test-Path $fullPath))
    {
        Write-Host "ERROR: Missing file $file" -ForegroundColor Red
        $failCount++
        continue
    }
    
    Write-Host "Executing: $file" -ForegroundColor Cyan
    
    # Create temp script file
    $tempScript = Join-Path $env:TEMP "setup_temp.sql"
    "@`"$fullPath`"`nexit" | Out-File -FilePath $tempScript -Encoding ASCII -Force
    
    # Run sqlplus
    $process = Start-Process -FilePath "sqlplus" -ArgumentList "-S", "$User/$Password@$ConnectString", "@$tempScript" -Wait -NoNewWindow -PassThru
    
    if ($process.ExitCode -eq 0)
    {
        Write-Host "  Success" -ForegroundColor Green
        $successCount++
    }
    else
    {
        Write-Host "  Failed (Exit Code: $($process.ExitCode))" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
}

Write-Host "`n========================================"
Write-Host "  Summary"
Write-Host "========================================"
Write-Host "Success: $successCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })

if ($failCount -eq 0)
{
    Write-Host "`nDatabase setup completed successfully!" -ForegroundColor Green
    Write-Host "`nNext steps:"
    Write-Host "  1. cd ..\backend"
    Write-Host "  2. npm run dev"
}
else
{
    Write-Host "`nSome SQL files failed. Check errors above." -ForegroundColor Yellow
}
