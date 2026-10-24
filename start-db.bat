@echo off
echo ====================================================
echo Starting GIGADROP MySQL Server (Port 3306)...
echo ====================================================

set "MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe"
set "DATA_DIR=%LOCALAPPDATA%\gigadrop-mysql"

if not exist "%MYSQL_BIN%" (
    echo [ERROR] MySQL binary not found at %MYSQL_BIN%
    pause
    exit /b 1
)

if not exist "%DATA_DIR%" (
    echo Initializing MySQL Data Directory at %DATA_DIR%...
    "%MYSQL_BIN%" --initialize-insecure --datadir="%DATA_DIR%" --console
)

echo Starting MySQL Server daemon...
"%MYSQL_BIN%" --datadir="%DATA_DIR%" --port=3306 --bind-address=127.0.0.1 --console
