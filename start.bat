@echo off
title GIGADROP - START SERVER
color 0A

cd /d "%~dp0"

echo ========================================================
echo             GIGADROP STORE - START SERVER
echo ========================================================
echo.

:: 1. Verify Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Node.js is not found in PATH!
    echo Please download and install Node.js from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: 2. Check dependencies
if not exist "node_modules" (
    echo [*] Installing dependencies for the first time [npm install]...
    call npm install
)

:: 3. Free Port 3000 if occupied
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo [*] Port 3000 is currently busy by PID %%a. Freeing port...
    taskkill /F /T /PID %%a >nul 2>&1
)

:: 4. Launch Next.js dev server in dedicated window
echo [*] Starting Next.js server...
start "GIGADROP_SERVER" cmd /k "cd /d "%~dp0" && title GIGADROP_SERVER && color 0B && echo ======================================================== && echo   GIGADROP SERVER IS RUNNING: http://localhost:3000 && echo   To stop the server: Run stop.bat or press Ctrl+C && echo ======================================================== && echo. && npm run dev"

:: 5. Wait a few seconds then launch browser
echo [*] Launching browser to http://localhost:3000 ...
ping 127.0.0.1 -n 5 >nul
start "" http://localhost:3000

echo.
echo ========================================================
echo   [SUCCESS] Website launched at http://localhost:3000
echo   To stop the website anytime, double-click: stop.bat
echo ========================================================
echo.
ping 127.0.0.1 -n 3 >nul
exit
