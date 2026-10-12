@echo off
TITLE BunBun's Quest Launcher
COLOR 0F

echo ========================================================
echo   🐰 Waking up BunBun's Sanctuary...
echo ========================================================

:: Start FastAPI Backend in a new background window
echo [1/2] Starting FastAPI Backend Core on port 8000...
start cmd /k "cd /d %~dp0backend && python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && uvicorn main:app --reload --port 8000"

:: Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak > nul

:: Start React Frontend in a new background window
echo [2/2] Starting React Frontend Dashboard on port 5173...
start cmd /k "cd /d %~dp0frontend && npm run dev"

:: Open Frontend in standalone app mode using Chrome/Edge
echo Opening Bun Bun's Quest in app mode...
timeout /t 3 /nobreak > nul
start chrome --app=http://localhost:5173

echo ========================================================
echo   ✨ BunBun is ready! Enjoy your cozy study quest.
echo ========================================================
pause