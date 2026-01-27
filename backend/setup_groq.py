#!/usr/bin/env python3
"""
Simple Groq API setup for RAG Chatbot
"""

def setup_groq():
    print("🔑 Groq API Setup (FREE)")
    print("=" * 30)
    print("1. Go to: https://console.groq.com/keys")
    print("2. Sign up for a free account")
    print("3. Create a new API key")
    print("4. Copy the API key (starts with 'gsk_')")
    print()
    
    api_key = input("Enter your Groq API key: ").strip()
    
    if not api_key:
        print("❌ No API key provided")
        return False
    
    if not api_key.startswith("gsk_"):
        print("⚠️  Warning: Groq API keys usually start with 'gsk_'")
        confirm = input("Continue anyway? (y/N): ").strip().lower()
        if confirm != 'y':
            return False
    
    env_content = f"""LLM_PROVIDER=groq
GROQ_API_KEY={api_key}

APP_NAME=RAG Chatbot Backend
VERSION=1.0.0
DEBUG=True

MAX_FILE_SIZE_MB=50
ALLOWED_ORIGINS=["*"]

CHUNK_SIZE=1000
CHUNK_OVERLAP=200
TOP_K_RESULTS=5

VECTOR_STORE_PATH=./vector_db

LOG_LEVEL=INFO
ANALYTICS_FILE=./analytics.json
"""
    
    with open(".env", "w") as f:
        f.write(env_content)
    
    print("✅ Groq API key configured successfully!")
    print()
    print("🚀 Ready to start! Run: python main.py")
    return True

if __name__ == "__main__":
    setup_groq()