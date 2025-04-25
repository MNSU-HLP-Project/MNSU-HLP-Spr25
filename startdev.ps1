# Get your local IP address
$ip = (Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.InterfaceAlias -like "Wi-Fi"} |
    Select-Object -First 1).IPAddress

if (-not $ip) {
    Write-Host "Could not determine local IP address."
    exit 1
}

Write-Host "Your local IP is: $ip"

# Step 1: Reminder to update Django settings.py
Write-Host "Ensure this is in your backend/settings.py:"
Write-Host "ALLOWED_HOSTS = ['localhost', '127.0.0.1', '$ip']"

# Step 2: Start Django server in a background process
Write-Host "Starting Django development server on 0.0.0.0:8000..."
$djangoProc = Start-Process powershell -ArgumentList " .\venv\Scripts\Activate; cd backend; python manage.py runserver ${ip}:8000" -PassThru
# Step 4: Dynamically update frontend/.env
$envPath = ".\frontend\.env"
$envVar = "VITE_API_BASE_URL=http://${ip}:8000"

if (-not (Test-Path $envPath)) {
    Set-Content -Path $envPath -Value $envVar
    Write-Host "Created frontend/.env with:"
    Write-Host $envVar
} else {
    $envContent = Get-Content $envPath
    if ($envContent -match "VITE_API_BASE_URL=") {
        $envContent = $envContent -replace "VITE_API_BASE_URL=.*", $envVar
        Set-Content -Path $envPath -Value $envContent
        Write-Host "Updated VITE_API_BASE_URL in frontend/.env to:"
        Write-Host $envVar
    } else {
        Add-Content -Path $envPath -Value $envVar
        Write-Host "Appended VITE_API_BASE_URL to frontend/.env:"
        Write-Host $envVar
    }
}

# Step 5: Start Vite dev server in a background process
Write-Host " Starting Vite development server..."
$viteProc = Start-Process powershell -ArgumentList "cd .\frontend; npm run dev" -PassThru

# Step 6: Final info
Write-Host " Access your app at:"
Write-Host "React Frontend: http://${ip}:5173"
Write-Host "Django Backend: http://${ip}:8000"
Write-Host " Open these on your phone while on the same Wi-Fi network."

# Wait for user to press Enter to terminate both processes
Write-Host "`nPress Enter to stop both servers..."

# Wait for the user to press Enter to exit the script
Read-Host

# Step 7: Kill both processes
Write-Host "Stopping both servers..."
$djangoProc.Kill()
$viteProc.Kill()

