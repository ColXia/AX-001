@echo off
setlocal

set "ROOT=%~dp0"

powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%ROOT%tools\launch-interview-demo-app.ps1" -AppMode room -RuntimeMode next -Port 3030

exit /b %errorlevel%
