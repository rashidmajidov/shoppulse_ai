@echo off
chcp 65001 >nul
title ShopPulse AI - TikTok Trend Pipeline Runner
set "PATH=C:\Program Files\nodejs;%PATH%"

echo ======================================================================
echo    ⚡ ShopPulse AI - Automated TikTok Trend Analysis Pipeline
echo    Apify -> OpenAI Whisper -> GPT-4o -> Supabase/PostgreSQL
echo ======================================================================
echo.

cd /d "%~dp0"
node dist/pipeline/runStandalone.js %*
pause
