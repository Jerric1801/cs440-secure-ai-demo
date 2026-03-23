#!/usr/bin/env bash

# Secure AI Zero-Click Exploit Demo Setup & Runner

echo "======================================"
echo " Starting Secure AI Demo Environment  "
echo "======================================"

# Check for Python
if ! command -v python3 &> /dev/null
then
    echo "Python3 could not be found. Please install Python3."
    exit 1
fi

# Create a virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate the virtual environment
source venv/bin/activate

# Install requirements
echo "Installing dependencies..."
pip install -r requirements.txt -q

# Check for .env file
if [ ! -f ".env" ]; then
    echo "WARNING: .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "PLEASE EDIT .env AND ADD YOUR GEMINI_API_KEY BEFORE CONTINUING."
    exit 1
fi

echo "Cleaning up prior sessions..."
# Kill any processes bound to the necessary ports
lsof -t -i :5444 | xargs kill -9 2>/dev/null || true
lsof -t -i :8444 | xargs kill -9 2>/dev/null || true

echo "Starting the Attacker Server on port 5444..."
python3 attacker_server.py &
ATTACKER_PID=$!

echo "Starting the Enterprise Chatbot Server on port 8444..."
python3 main.py &
ENTERPRISE_PID=$!

function cleanup {
    echo "Closing servers..."
    kill $ATTACKER_PID 2>/dev/null
    kill $ENTERPRISE_PID 2>/dev/null
    exit
}

trap cleanup EXIT INT

echo "======================================"
echo " Environment is LIVE!"
echo " Enterprise UI: http://localhost:8444"
echo " Attacker Server: Listening on port 5444"
echo " Press Ctrl+C to stop both servers."
echo "======================================"

wait
