import os

from cryptography.fernet import Fernet
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "groupchat-dev-secret-change-in-production")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/groupchat.db")
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "")

# Generate encryption key if not provided (dev only)
if not ENCRYPTION_KEY:
    ENCRYPTION_KEY = Fernet.generate_key().decode()

PROVIDER_DEFAULTS = {
    "anthropic": {
        "default_model": "claude-sonnet-4-20250514",
        "base_url": "https://api.anthropic.com",
    },
    "openai": {"default_model": "gpt-4o", "base_url": "https://api.openai.com"},
    "groq": {
        "default_model": "llama-3.3-70b-versatile",
        "base_url": "https://api.groq.com/openai",
    },
    "openrouter": {
        "default_model": "anthropic/claude-sonnet-4",
        "base_url": "https://openrouter.ai/api",
    },
    "google": {
        "default_model": "gemini-2.0-flash",
        "base_url": "https://generativelanguage.googleapis.com",
    },
    "mistral": {
        "default_model": "mistral-large-latest",
        "base_url": "https://api.mistral.ai",
    },
    "deepseek": {
        "default_model": "deepseek-chat",
        "base_url": "https://api.deepseek.com",
    },
    "together": {
        "default_model": "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        "base_url": "https://api.together.xyz",
    },
    "fireworks": {
        "default_model": "accounts/fireworks/models/llama-v3p3-70b-instruct",
        "base_url": "https://api.fireworks.ai",
    },
    "ollama": {"default_model": "", "base_url": "http://localhost:11434"},
    "lmstudio": {"default_model": "", "base_url": "http://localhost:1234"},
    "custom": {"default_model": "", "base_url": ""},
}
