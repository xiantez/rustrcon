@echo off
:: RustRCON - Quick Start Script (Windows)
:: Installs dependencies and launches the dashboard

title RustRCON Dashboard

echo.
echo   🎮  RustRCON Dashboard
echo   ────────────────────────
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo   ❌  Node.js is not installed.
    echo      Install it from https://nodejs.org ^(v14+^)
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo   ✅  Node.js %NODE_VER% detected

:: Install dependencies
cd /d "%~dp0backend"
if not exist "node_modules" (
    echo   📦  Installing dependencies...
    npm install --silent
) else (
    echo   ✅  Dependencies already installed
)

:: Set port
if "%PORT%"=="" set PORT=3001

echo.
echo   🚀  Starting server on port %PORT%...
echo   🌐  Open http://localhost:%PORT% in your browser
echo   ⏹   Press Ctrl+C to stop
echo.

node index.js
pause
