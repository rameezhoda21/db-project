# ============================================================================
# Oracle Database Setup Script for Library Management System
# ============================================================================
# This script runs all SQL files in the correct order to set up your database
# Usage: .\setup-database.ps1
# ============================================================================

param(
    [string]$User = "C##RAMEEZHODA",
    [string]$Password = "123",
    [string]$ConnectString = "localhost:1521/XEPDB1"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Library Database Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define the SQL files in execution order
$sqlFiles = @(
    "00_drop_all.sql",
    "01_create_tables.sql",
    "02_views_oracle.sql",
    "03_triggers_oracle.sql",
    "04_sample_data_oracle.sql"
)

$databasePath = Split-Path -Parent $PSScriptRoot
$databasePath = Join-Path $databasePath "database"

Write-Host "Database Path: $databasePath" -ForegroundColor Yellow
Write-Host "Connect String: $ConnectString" -ForegroundColor Yellow
Write-Host "User: $User" -ForegroundColor Yellow
Write-Host ""

# Check if SQL files exist
$missingFiles = @()
foreach ($file in $sqlFiles) {
    $fullPath = Join-Path $databasePath $file
    if (-not (Test-Path $fullPath)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "ERROR: Missing SQL files:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor Red
    }
    exit 1
}

Write-Host "All SQL files found. Starting execution..." -ForegroundColor Green
Write-Host ""

# Execute each SQL file
$successCount = 0
$failCount = 0

foreach ($file in $sqlFiles) {
    $fullPath = Join-Path $databasePath $file
    Write-Host "Executing: $file" -ForegroundColor Cyan
    
    try {
        # Create SQL*Plus command
        $sqlplusCmd = "@`"$fullPath`""
        
        # Run SQL*Plus
        $output = $sqlplusCmd | sqlplus -S "$User/$Password@$ConnectString"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Success" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "  ✗ Failed (Exit Code: $LASTEXITCODE)" -ForegroundColor Red
            Write-Host "  Output: $output" -ForegroundColor Yellow
            $failCount++
        }
    } catch {
        Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Execution Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Success: $successCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "✓ Database setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Verify connection details in backend/.env" -ForegroundColor White
    Write-Host "  2. Run: cd backend" -ForegroundColor White
    Write-Host "  3. Run: npm install" -ForegroundColor White
    Write-Host "  4. Run: npm run dev" -ForegroundColor White
} else {
    Write-Host "⚠ Some SQL files failed to execute. Please check the errors above." -ForegroundColor Yellow
    Write-Host "You can also run the SQL files manually in SQL Developer." -ForegroundColor Yellow
}
