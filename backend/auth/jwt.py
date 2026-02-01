import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from . import schema

# Force load the .env from the root directory
load_dotenv()

# Get key from env; if it's missing, use a temporary fallback string to prevent crashes
SECRET_KEY = os.getenv("SECRET_KEY") or "a_very_secret_fallback_string_123"
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 43200 # 30 days

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    # Ensure ID is a string for JSON serialization
    if "id" in to_encode:
        to_encode["id"] = str(to_encode["id"])
    return jwt.encode(to_encode, str(SECRET_KEY), algorithm=ALGORITHM)

def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, str(SECRET_KEY), algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: str = str(payload.get("id"))
        if email is None or user_id is None:
            raise credentials_exception
        return schema.TokenData(email=email, id=user_id)
    except (JWTError, AttributeError):
        raise credentials_exception

# Use 'auth/login' to match your router prefix
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"Authorization": "Bearer"}
    )
    return verify_token(token, credentials_exception)