#!/bin/bash

echo "🚀 Starting RAG Chatbot Backend"
echo "================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python 3.8+"
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "🔧 First time setup..."
    python3 quick_start.py
else
    echo "✅ Configuration found"
    echo "📦 Installing/updating dependencies..."
    pip3 install -r requirements.txt > /dev/null 2>&1
    echo "🚀 Starting server..."
    python3 main.py
fi