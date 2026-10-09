@echo off
chcp 65001 >nul
title ShopPulse AI - Full Stack Server
cls

echo ======================================================================
echo    ShopPulse AI - Trend-to-Ad Generator (Full Stack)
echo ======================================================================
echo.
echo  [1/3] Backend API basladir  (http://localhost:5000)
echo  [2/3] Frontend UI basladir  (http://localhost:8000)
echo  [3/3] Demo data yuklenir...
echo.
echo  Serverleri dayandirmaq ucun bu pencereyi baglayin (CTRL+C)
echo ======================================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [XETA] Node.js tapilmadi. https://nodejs.org adresineden yukleyin.
    pause
    exit /b 1
)

:: Start backend in new window
echo [*] Backend API basladir...
start "ShopPulse Backend" cmd /c "cd /d "%~dp0backend" && node dist/server.js"

:: Wait for backend to boot
echo [*] Backend yuklenmeyi gozleyir (5 saniye)...
timeout /t 5 /nobreak >nul

:: Seed demo data (silently)
echo [*] Demo trend datasi yuklenir...
curl -s -X POST http://localhost:5000/api/trends/seed >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Demo trendler ugurla yuklendi!
) else (
    echo [!] Demo seed atlanildi (backend heni hazir olmaya biler)
)

:: Start frontend
echo [*] Frontend UI basladir (http://localhost:8000)...
echo.
echo ======================================================================
echo  Brauzerinizde bu unvani acin: http://localhost:8000
echo ======================================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    python -m http.server 8000
) else (
    where py >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        py -m http.server 8000
    ) else (
        echo [XETA] Python tapilmadi.
        echo index.html faylini birbaxa acin.
        start index.html
        pause
    )
)
