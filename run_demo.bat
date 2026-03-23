@echo off
setlocal

echo ======================================
echo  Starting Secure AI Demo Environment
echo ======================================

:: Check for Python
python --version >nul 2>&1
if errorlevel 1 (
    echo Python could not be found. Please install Python.
    exit /b 1
)

:: Create a virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

:: Activate the virtual environment
call venv\Scripts\activate.bat

:: Install requirements
echo Installing dependencies...
pip install -r requirements.txt -q

:: Check for .env file
if not exist ".env" (
    echo WARNING: .env file not found. Copying from .env.example...
    copy .env.example .env
    echo PLEASE EDIT .env AND ADD YOUR GEMINI_API_KEY BEFORE CONTINUING.
    exit /b 1
)

echo Cleaning up prior sessions...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5444') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8444') do taskkill /f /pid %%a >nul 2>&1

echo Starting the Attacker Server on port 5444...
start "Attacker Server" python attacker_server.py

echo Starting the Enterprise Chatbot Server on port 8444...
start "Enterprise Chatbot" python main.py

echo ======================================
echo  Environment is LIVE!
echo  Enterprise UI: http://localhost:8444
echo  Attacker Server: Listening on port 5444
echo  Close the new command prompt windows to stop the servers.
echo ======================================

endlocal
