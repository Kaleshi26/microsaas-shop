# MicroSaaS Shop - Smoke Test Script
# This script runs basic tests to verify the application is working

Write-Host "🧪 Running MicroSaaS Shop Smoke Tests" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

$baseUrl = "http://localhost:3001"
$webUrl = "http://localhost:3000"
$testResults = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [int]$ExpectedStatus = 200
    )
    
    Write-Host "`n🔍 Testing $Name..." -ForegroundColor Yellow
    Write-Host "   URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 10
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "   ✅ PASS - Status: $($response.StatusCode)" -ForegroundColor Green
            $script:testResults += @{ Name = $Name; Status = "PASS"; Details = "Status: $($response.StatusCode)" }
            return $true
        } else {
            Write-Host "   ❌ FAIL - Expected: $ExpectedStatus, Got: $($response.StatusCode)" -ForegroundColor Red
            $script:testResults += @{ Name = $Name; Status = "FAIL"; Details = "Expected: $ExpectedStatus, Got: $($response.StatusCode)" }
            return $false
        }
    } catch {
        Write-Host "   ❌ FAIL - Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:testResults += @{ Name = $Name; Status = "FAIL"; Details = "Error: $($_.Exception.Message)" }
        return $false
    }
}

function Test-API-Response {
    param(
        [string]$Name,
        [string]$Url,
        [string]$ExpectedProperty
    )
    
    Write-Host "`n🔍 Testing $Name..." -ForegroundColor Yellow
    Write-Host "   URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 10
        $json = $response.Content | ConvertFrom-Json
        
        if ($json.$ExpectedProperty) {
            Write-Host "   ✅ PASS - Found $ExpectedProperty" -ForegroundColor Green
            $script:testResults += @{ Name = $Name; Status = "PASS"; Details = "Found $ExpectedProperty" }
            return $true
        } else {
            Write-Host "   ❌ FAIL - Missing $ExpectedProperty" -ForegroundColor Red
            $script:testResults += @{ Name = $Name; Status = "FAIL"; Details = "Missing $ExpectedProperty" }
            return $false
        }
    } catch {
        Write-Host "   ❌ FAIL - Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:testResults += @{ Name = $Name; Status = "FAIL"; Details = "Error: $($_.Exception.Message)" }
        return $false
    }
}

# Test 1: API Health Check
Test-Endpoint -Name "API Health Check" -Url "$baseUrl/health"

# Test 2: API Products Endpoint
Test-Endpoint -Name "API Products" -Url "$baseUrl/products"

# Test 3: API Search Endpoint
Test-Endpoint -Name "API Search" -Url "$baseUrl/search?q=hoodie"

# Test 4: API Metrics Endpoint
Test-Endpoint -Name "API Metrics" -Url "$baseUrl/metrics"

# Test 5: Web Application
Test-Endpoint -Name "Web Application" -Url $webUrl

# Test 6: Products API Response Structure
Test-API-Response -Name "Products API Structure" -Url "$baseUrl/products" -ExpectedProperty "length"

# Test 7: Search API Response Structure
Test-API-Response -Name "Search API Structure" -Url "$baseUrl/search?q=hoodie" -ExpectedProperty "length"

# Test 8: Health API Response Structure
Test-API-Response -Name "Health API Structure" -Url "$baseUrl/health" -ExpectedProperty "status"

# Test 9: API Gateway (if running)
try {
    Test-Endpoint -Name "API Gateway" -Url "http://localhost:8000/api/products"
} catch {
    Write-Host "`n⚠️ API Gateway not running (optional)" -ForegroundColor Yellow
}

# Test 10: Grafana (if running)
try {
    Test-Endpoint -Name "Grafana Dashboard" -Url "http://localhost:3002"
} catch {
    Write-Host "`n⚠️ Grafana not running (optional)" -ForegroundColor Yellow
}

# Summary
Write-Host "`n📊 Test Results Summary" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green

$passedTests = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$totalTests = $testResults.Count
$failedTests = $totalTests - $passedTests

Write-Host "`n✅ Passed: $passedTests" -ForegroundColor Green
Write-Host "❌ Failed: $failedTests" -ForegroundColor Red
Write-Host "📈 Success Rate: $([math]::Round(($passedTests / $totalTests) * 100, 1))%" -ForegroundColor Cyan

if ($failedTests -eq 0) {
    Write-Host "`n🎉 All tests passed! The application is working correctly." -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Some tests failed. Please check the application status." -ForegroundColor Yellow
}

Write-Host "`n📋 Detailed Results:" -ForegroundColor Cyan
$testResults | ForEach-Object {
    $status = if ($_.Status -eq "PASS") { "✅" } else { "❌" }
    Write-Host "   $status $($_.Name) - $($_.Details)" -ForegroundColor $(if ($_.Status -eq "PASS") { "Green" } else { "Red" })
}

Write-Host "`n💡 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "   2. Browse products and test the search functionality" -ForegroundColor White
Write-Host "   3. Try the checkout flow (demo mode)" -ForegroundColor White
Write-Host "   4. Check the profile page after signing in" -ForegroundColor White
Write-Host "   5. View metrics at http://localhost:3001/metrics" -ForegroundColor White
