# MicroSaaS Shop - Development Startup Script
# This script starts the entire development stack on Windows

Write-Host "🚀 Starting MicroSaaS Shop Development Environment" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if Docker is running
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed or not running" -ForegroundColor Red
    Write-Host "Please install Docker Desktop and start it" -ForegroundColor Red
    exit 1
}

# Check if pnpm is installed
try {
    pnpm --version | Out-Null
    Write-Host "✅ pnpm is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ pnpm is not installed" -ForegroundColor Red
    Write-Host "Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Start infrastructure
Write-Host "`n🐳 Starting infrastructure services..." -ForegroundColor Yellow
Set-Location "infra/compose"
docker-compose up -d
Write-Host "✅ Infrastructure services started" -ForegroundColor Green

# Wait for services to be ready
Write-Host "`n⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Setup database
Write-Host "`n🗄️ Setting up database..." -ForegroundColor Yellow
Set-Location "../../apps/api"
pnpm prisma:migrate
pnpm seed
Write-Host "✅ Database setup complete" -ForegroundColor Green

# Start API
Write-Host "`n🔧 Starting API server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; pnpm dev" -WindowStyle Normal
Start-Sleep -Seconds 3

# Start Web App
Write-Host "`n🌐 Starting web application..." -ForegroundColor Yellow
Set-Location "../web"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; pnpm dev" -WindowStyle Normal
Start-Sleep -Seconds 3

# Start Worker (optional)
Write-Host "`n⚡ Starting Cloudflare Worker..." -ForegroundColor Yellow
Set-Location "../worker"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; pnpm dev" -WindowStyle Normal

# Return to root
Set-Location "../.."

Write-Host "`n🎉 Development environment started successfully!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host "📱 Web App: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🚪 API Gateway: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📊 Grafana: http://localhost:3002" -ForegroundColor Cyan
Write-Host "🔍 OpenSearch: http://localhost:9200" -ForegroundColor Cyan
Write-Host "🎛️ Unleash: http://localhost:4242" -ForegroundColor Cyan
Write-Host "`n💡 Press Ctrl+C to stop all services" -ForegroundColor Yellow

# Keep script running
Write-Host "`n🔄 Monitoring services... (Press Ctrl+C to stop)" -ForegroundColor Yellow
try {
    while ($true) {
        Start-Sleep -Seconds 30
        
        # Check if services are still running
        $apiStatus = try { Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 5 | Select-Object -ExpandProperty StatusCode } catch { $null }
        $webStatus = try { Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 | Select-Object -ExpandProperty StatusCode } catch { $null }
        
        if ($apiStatus -eq 200 -and $webStatus -eq 200) {
            Write-Host "✅ All services running normally" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Some services may not be responding" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "`n🛑 Stopping development environment..." -ForegroundColor Yellow
    Set-Location "infra/compose"
    docker-compose down
    Write-Host "✅ Development environment stopped" -ForegroundColor Green
}
