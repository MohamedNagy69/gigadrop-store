@echo off
title GIGADROP - STOP SERVER
color 0C

echo ========================================================
echo             GIGADROP STORE - STOP SERVER
echo ========================================================
echo.

set "FOUND=0"

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    set "FOUND=1"
    echo [*] Found server running on Port 3000 [PID: %%a]
    echo [*] Terminating server process tree...
    taskkill /F /T /PID %%a >nul 2>&1
)

taskkill /F /FI "WINDOWTITLE eq GIGADROP_SERVER*" >nul 2>&1

echo.
if "%FOUND%"=="1" (
    echo ========================================================
    echo   [SUCCESS] GIGADROP Server stopped successfully!
    echo ========================================================
) else (
    echo [INFO] Website is not currently running.
    echo [INFO] Port 3000 is free.
)

echo.
echo Closing in 3 seconds...
ping 127.0.0.1 -n 4 >nul
exit
