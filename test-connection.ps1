# Test Oracle Database Connection
# Quick script to verify your Oracle setup is working

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Oracle Database Connection Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "❌ backend/.env not found!" -ForegroundColor Red
    Write-Host "   Create it from backend/.env.example and add your credentials" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ backend/.env exists" -ForegroundColor Green

# Check if node_modules exists
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "⚠️  backend/node_modules not found" -ForegroundColor Yellow
    Write-Host "   Running: npm install" -ForegroundColor Cyan
    Set-Location backend
    npm install
    Set-Location ..
} else {
    Write-Host "✅ backend/node_modules exists" -ForegroundColor Green
}

# Read .env to check configuration
Write-Host ""
Write-Host "Current Configuration:" -ForegroundColor Yellow
$envContent = Get-Content "backend\.env" | Where-Object { $_ -match "^DB_" -and $_ -notmatch "^#" }
foreach ($line in $envContent) {
    if ($line -match "PASSWORD") {
        $maskedLine = $line -replace "=.*", "=********"
        Write-Host "  $maskedLine" -ForegroundColor White
    } else {
        Write-Host "  $line" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "Checking Oracle service status..." -ForegroundColor Cyan

# Check Oracle service (common names)
$oracleServices = Get-Service | Where-Object { 
    $_.Name -like "*Oracle*" -or $_.DisplayName -like "*Oracle*" 
} | Select-Object -First 3

if ($oracleServices) {
    Write-Host "Oracle Services found:" -ForegroundColor Green
    foreach ($svc in $oracleServices) {
        $status = if ($svc.Status -eq "Running") { "✅" } else { "⚠️ " }
        Write-Host "  $status $($svc.DisplayName) - $($svc.Status)" -ForegroundColor $(if ($svc.Status -eq "Running") { "Green" } else { "Yellow" })
    }
} else {
    Write-Host "⚠️  No Oracle services found (may be normal if using remote DB)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure you've run the SQL files in SQL Developer" -ForegroundColor White
Write-Host "2. Start the backend: cd backend; npm run dev" -ForegroundColor White
Write-Host "3. Test connection: curl http://localhost:5000/api/testdb" -ForegroundColor White
Write-Host ""
Write-Host "See QUICKSTART.md for detailed instructions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
