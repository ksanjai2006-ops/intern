import time
from typing import Optional, Dict
from pydantic import BaseModel, EmailStr

SECRET_KEY = "knowledge-gap-detector-secret-key-super-secure"
ALGORITHM = "HS256"

class User(BaseModel):
    id: str
    email: str
    full_name: str
    role: str  # Admin, Reviewer, Author
    organization: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

# Simulated User Database
USERS_DB = {
    "admin@techdocs.ai": {
        "id": "usr_admin_01",
        "email": "admin@techdocs.ai",
        "full_name": "Sarah Connor (Admin)",
        "role": "Admin",
        "organization": "Enterprise Docs Corp",
        "password": "password123"
    },
    "reviewer@techdocs.ai": {
        "id": "usr_rev_02",
        "email": "reviewer@techdocs.ai",
        "full_name": "Dr. Alex Rivera (Lead Reviewer)",
        "role": "Reviewer",
        "organization": "Enterprise Docs Corp",
        "password": "password123"
    },
    "author@techdocs.ai": {
        "id": "usr_auth_03",
        "email": "author@techdocs.ai",
        "full_name": "Elena Rostova (Tech Author)",
        "role": "Author",
        "organization": "Enterprise Docs Corp",
        "password": "password123"
    }
}

def authenticate_user(email: str, password: str) -> Optional[User]:
    user_info = USERS_DB.get(email.lower())
    if user_info and user_info["password"] == password:
        return User(
            id=user_info["id"],
            email=user_info["email"],
            full_name=user_info["full_name"],
            role=user_info["role"],
            organization=user_info["organization"]
        )
    return None

def create_access_token(user: User) -> str:
    # Simplified JWT simulation token for fast local execution & testing
    return f"mock_jwt_token_{user.id}_{int(time.time())}"
