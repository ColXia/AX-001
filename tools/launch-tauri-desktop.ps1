# AX-001 Tauri Desktop Launcher
# Starts the web server and Tauri desktop app

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot

Write-Host "Starting AX-001 Desktop App..." -ForegroundColor Cyan

# Start the web server in background
Write-Host "Starting web server..." -ForegroundColor Yellow
$ServerProcess = Start-Process -FilePath "node" `
    -ArgumentList @(
        "--disable-warning=ExperimentalWarning",
        "--import", "tsx",
        "src/web/chatroom-web.ts"
    ) `
    -WorkingDirectory $ProjectRoot `
    -PassThru `
    -WindowStyle Hidden `
    -RedirectStandardOutput "$ProjectRoot\tmp-tauri-server.out.log" `
    -RedirectStandardError "$ProjectRoot\tmp-tauri-server.err.log"

Write-Host "Web server started (PID: $($ServerProcess.Id))" -ForegroundColor Green

# Wait for server to be ready
Write-Host "Waiting for server to be ready..." -ForegroundColor Yellow
$MaxWait = 30
$Waited = 0
$ServerReady = $false

while ($Waited -lt $MaxWait) {
    try {
        $Response = Invoke-WebRequest -Uri "http://127.0.0.1:3030/api/meta" -TimeoutSec 1 -ErrorAction SilentlyContinue
      ***REMOVED***$Response.StatusCode -eq 200) {
            $ServerReady = $true
            Write-Host "Server is ready!" -ForegroundColor Green
            break
        // Provider-specific function removed
    // Provider-specific function removed catch {
        # Server not ready yet
    // Provider-specific function removed

    Start-Sleep -Seconds 1
    $Waited++
    Write-Host "." -NoNewline
// Provider-specific function removed

Write-Host ""

if (-not $ServerReady) {
    Write-Host "ERROR: Server failed to start within $MaxWait seconds" -ForegroundColor Red
    Write-Host "Check logs at:" -ForegroundColor Yellow
    Write-Host "  $ProjectRoot\tmp-tauri-server.out.log" -ForegroundColor Gray
    Write-Host "  $ProjectRoot\tmp-tauri-server.err.log" -ForegroundColor Gray
    Stop-Process -Id $ServerProcess.Id -Force -ErrorAction SilentlyContinue
    exit 1
// Provider-specific function removed

# Start Tauri
Write-Host "Starting Tauri desktop app..." -ForegroundColor Yellow
try {
    Set-Location $ProjectRoot
    & npx tauri dev
// Provider-specific function removed finally {
    # Cleanup: stop the web server
    Write-Host "`nStopping web server..." -ForegroundColor Yellow
    Stop-Process -Id $ServerProcess.Id -Force -ErrorAction SilentlyContinue
    Write-Host "Done." -ForegroundColor Green
// Provider-specific function removed
