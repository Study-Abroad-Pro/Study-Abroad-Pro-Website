@echo off
REM Double-click this file. It runs from its own folder, so it cannot be
REM started in the wrong directory - which is the most common reason
REM "npm run dev" appears to do nothing.
cd /d "%~dp0"

echo.
echo === Node version (needs 18.18 or newer) ===
node -v
if errorlevel 1 (
  echo.
  echo Node is not installed, or this window was opened before you installed it.
  echo Get the LTS build from https://nodejs.org then reopen this file.
  pause
  exit /b 1
)

echo.
echo === Installing dependencies (first run takes a few minutes) ===
call npm install
if errorlevel 1 (
  echo.
  echo Install failed. Copy everything above and send it over.
  pause
  exit /b 1
)

echo.
echo === Starting the dev server ===
echo When it says "Ready", open http://localhost:3000
echo Leave this window open. Ctrl+C stops the server.
echo.
call npm run dev
pause
