import hashlib
import secrets
from cryptography.fernet import Fernet
from app.config import ENCRYPTION_KEY

fernet = Fernet(ENCRYPTION_KEY.encode() if isinstance(ENCRYPTION_KEY, str) else ENCRYPTION_KEY)

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    h = hashlib.sha256(f"{salt}:{password}".encode()).hexdigest()
    return f"{salt}:{h}"

def verify_password(password: str, stored: str) -> bool:
    salt, h = stored.split(":")
    return hashlib.sha256(f"{salt}:{password}".encode()).hexdigest() == h

def encrypt_key(key: str) -> str:
    return fernet.encrypt(key.encode()).decode()

def decrypt_key(encrypted: str) -> str:
    return fernet.decrypt(encrypted.encode()).decode()

def generate_session_token() -> str:
    return secrets.token_hex(32)
