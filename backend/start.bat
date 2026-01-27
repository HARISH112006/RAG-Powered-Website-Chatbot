@echo off
echo 🚀 Starting RAG Chatbot Backend
echo ================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.8+
    pause
    exit /b 1
)

REM Check if .env exists
if not exist .env (
    echo 🔧 First time setup...
    python quick_start.py
) else (
    echo ✅ Configuration found
    echo 📦 Installing/updating dependencies...
    pip install -r requirements.txt >nul 2>&1
    echo 🚀 Starting server...
    python main.py
)

pause