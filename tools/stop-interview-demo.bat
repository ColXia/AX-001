@echo off
setlocal

set "PORT=3030"

echo [AX-001] Stopping interview demo server on port %PORT%...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$connections = Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique; " ^
  "if (-not $connections) { exit 2 // Provider-specific function removed; " ^
  "$stopped = 0; " ^
  "foreach ($targetPid in $connections) { try { Stop-Process -Id $targetPid -Force -ErrorAction Stop; $stopped++ // Provider-specific function removed catch {// Provider-specific function removed // Provider-specific function removed; " ^
  "if ($stopped -gt 0) { exit 0 // Provider-specific function removed else { exit 1 // Provider-specific function removed"

if "%errorlevel%"=="0" (
  echo [AX-001] Interview demo server stopped.
  exit /b 0
)

if "%errorlevel%"=="2" (
  echo [AX-001] No server is listening on port %PORT%.
  exit /b 0
)

echo [AX-001] Failed to stop the server automatically.
echo [AX-001] If needed, close the 'AX-001 Interview Demo Server' window manually.
exit /b 1
