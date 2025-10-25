@echo off
echo ========================================
echo   CAPTCHA Game - Vercel Deployment
echo ========================================
echo.

echo 1. Building production version...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.
echo ========================================
echo   DEPLOYMENT READY!
echo ========================================
echo.
echo Next steps:
echo 1. Install Vercel CLI: npm i -g vercel
echo 2. Run: vercel --prod
echo 3. Your game will be live!
echo.
echo Or upload to GitHub and connect to Vercel dashboard
echo.
pause