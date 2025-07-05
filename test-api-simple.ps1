Write-Host "Testing URL Shortener API..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

try {
    # Test if server is running
    Write-Host "Checking if server is running..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri $baseUrl -Method GET -TimeoutSec 5 -ErrorAction Stop
        Write-Host "Server is running!" -ForegroundColor Green
    }
    catch {
        Write-Host "Server is not running. Please start it with 'npm run start:dev'" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    
    # Test 1: Create a short URL
    Write-Host "Test 1: Creating a short URL..." -ForegroundColor Yellow
    
    $body = @{
        originalUrl = "https://www.google.com"
    } | ConvertTo-Json
    
    $createResponse = Invoke-WebRequest -Uri "$baseUrl/api/url" -Method POST -Body $body -ContentType "application/json"
    
    if ($createResponse.StatusCode -eq 201) {
        $shortUrl = $createResponse.Content | ConvertFrom-Json
        Write-Host "Short URL created successfully:" -ForegroundColor Green
        Write-Host "   Original URL: $($shortUrl.originalUrl)" -ForegroundColor White
        Write-Host "   Short Code: $($shortUrl.shortCode)" -ForegroundColor White
        Write-Host "   Full Short URL: $baseUrl/$($shortUrl.shortCode)" -ForegroundColor White
        Write-Host "   Created At: $($shortUrl.createdAt)" -ForegroundColor White
        Write-Host ""
        
        # Test 2: Test redirection
        Write-Host "Test 2: Testing redirection..." -ForegroundColor Yellow
        
        try {
            $redirectResponse = Invoke-WebRequest -Uri "$baseUrl/$($shortUrl.shortCode)" -Method GET -MaximumRedirection 0 -ErrorAction SilentlyContinue
        }
        catch {
            # PowerShell treats redirects as errors, so we catch them
            if ($_.Exception.Response.StatusCode -eq 302) {
                $redirectLocation = $_.Exception.Response.Headers.Location
                Write-Host "Redirection working correctly:" -ForegroundColor Green
                Write-Host "Status: 302 (Found)" -ForegroundColor White
                Write-Host "Redirects to: $redirectLocation" -ForegroundColor White
                Write-Host "Expected: $($shortUrl.originalUrl)" -ForegroundColor White
                
                if ($redirectLocation -eq $shortUrl.originalUrl) {
                    Write-Host "Match: YES" -ForegroundColor Green
                } else {
                    Write-Host "Match: NO" -ForegroundColor Red
                }
            } else {
                Write-Host "Redirection test failed: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        
        Write-Host ""
        
        # Test 3: Test invalid short code
        Write-Host "Test 3: Testing invalid short code..." -ForegroundColor Yellow
        
        try {
            $invalidResponse = Invoke-WebRequest -Uri "$baseUrl/invalidcode123" -Method GET -ErrorAction Stop
            Write-Host "Expected 404 for invalid short code, got $($invalidResponse.StatusCode)" -ForegroundColor Red
        }
        catch {
            if ($_.Exception.Response.StatusCode -eq 404) {
                Write-Host "Invalid short code correctly returns 404" -ForegroundColor Green
            } else {
                Write-Host "Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        
    } else {
        Write-Host "Failed to create short URL. Status: $($createResponse.StatusCode)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "All tests completed!" -ForegroundColor Cyan
    
} catch {
    Write-Host "Test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure the server is running with: npm run start:dev" -ForegroundColor Yellow
}
