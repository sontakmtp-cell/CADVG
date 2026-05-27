@echo off
setlocal

set "ROOT=%~dp0"
set "BACKEND=%ROOT%elevator-cad-app\backend"
set "FRONTEND=%ROOT%elevator-cad-app\frontend"
set "BACKEND_PY=%BACKEND%\.venv\Scripts\python.exe"

if not exist "%BACKEND_PY%" (
  echo Backend Python venv not found:
  echo %BACKEND_PY%
  pause
  exit /b 1
)

if not exist "%FRONTEND%\node_modules" (
  echo Frontend node_modules not found. Run npm install in:
  echo %FRONTEND%
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%stop-app-processes.ps1"

start "Elevator CAD Backend" cmd /k "cd /d ""%BACKEND%"" && ""%BACKEND_PY%"" -m uvicorn main:app --host 127.0.0.1 --port 8000"
start "Elevator CAD Frontend" cmd /k "cd /d ""%FRONTEND%"" && npm run dev -- --port 5174 --strictPort"

timeout /t 4 /nobreak >nul
start "" "http://127.0.0.1:5174"

endlocal
