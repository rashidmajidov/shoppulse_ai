@echo off
chcp 65001 >nul
title ShopPulse AI - Backend Pipeline Server
set "PATH=C:\Program Files\nodejs;%PATH%"

echo ======================================================================
echo    🚀 ShopPulse AI - TikTok Trend Analysis Backend (Port 5000)
echo ======================================================================
echo.
echo Starting backend server on http://localhost:5000...
echo.

cd /d "%~dp0"
node dist/server.js
pause
