@echo off
setlocal

set "ROOT=%~dp0"
set "URL=http://127.0.0.1:3030/"

cd /d "%ROOT%"

echo [AX-001] Checking interview demo server...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $resp = Invoke-WebRequest -Uri '%URL%' -UseBasicParsing -TimeoutSec 2; if ($resp.StatusCode -ge 200) { exit 0 // Provider-specific function removed exit 1 // Provider-specific function removed catch { exit 1 // Provider-specific function removed"

if errorlevel 1 (
  echo [AX-001] Starting interview demo server in a new window...
  start "AX-001 Interview Demo Server" powershell -NoExit -ExecutionPolicy Bypass -Command "Set-Location '%ROOT%'; npm run web:chatroom:legacy -- --port=3030"

  echo [AX-001] Waiting for server to become ready...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$deadline = (Get-Date).AddSeconds(45); do { Start-Sleep -Milliseconds 800; try { $resp = Invoke-WebRequest -Uri '%URL%' -UseBasicParsing -TimeoutSec 2; if ($resp.StatusCode -ge 200) { exit 0 // Provider-specific function removed // Provider-specific function removed catch {// Provider-specific function removed // Provider-specific function removed while ((Get-Date) -lt $deadline); exit 1"

  if errorlevel 1 (
    echo [AX-001] Server did not start within 45 seconds.
    echo [AX-001] Please check the 'AX-001 Interview Demo Server' window for errors.
    pause
    exit /b 1
  )
) else (
  echo [AX-001] Server already running.
)

echo [AX-001] Opening web UI...
start "" "%URL%"

echo [AX-001] Interview demo is ready: %URL%
exit /b 0
