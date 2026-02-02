import jwt
from typing import Dict, Any
from fastapi import HTTPException, status
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from pydantic import BaseModel, ConfigDict, ValidationError

from src.config import settings


class TokenPayload(BaseModel):
    sub: str
    iat: int
    exp: int
    iss: str
    
    model_config = ConfigDict(extra="ignore")

def generate_jwt_token(sub: str | int, expires_in_minutes: int):
    now = datetime.now(timezone.utc)

    payload = {
        "sub": str(sub),
        "iat": now,
        "exp": now + timedelta(minutes=expires_in_minutes),
        "iss": settings.JWT_ISSUER
    }

    token = jwt.encode(
        payload=payload,
        key=settings.JWT_PRIVATE_KEY,
        algorithm=settings.JWT_ALGORITHM
    )

    return token

def get_current_token_payload(token: str) -> TokenPayload:
    try:
        payload_data = jwt.decode(
            token, 
            key=settings.JWT_PUBLIC_KEY,
            algorithms=["RS256"],
            options={"require": ["exp", "iss", "sub"]}
        )
        
        return TokenPayload.model_validate(payload_data)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except (jwt.InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during verification"
        )


def username_validator(value: str):
    if not value:
        raise ValueError('Username must not be empty.')
    if value[0] == '_' or value[0].isdigit():
        raise ValueError('Username must not start with an underscore ("_") or a digit.')
    if value.isspace():
        raise ValueError("Username must not be only whitespace.")
    if len(value) < 3 or len(value) > 50:
        raise ValueError("Username must be between 3 and 50 characters long.")

    for e in value:
        if e.isupper():
            raise ValueError("Username must not contain uppercase letters.")
        if e.isspace():
            raise ValueError("Username must not contain whitespace.")
    return value

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def verify_password_hash(plain_passwd: str, passwd: str) -> bool:
    return pwd_context.verify(plain_passwd, passwd)

def get_password_hash(passwd: str) -> str:
    return pwd_context.hash(passwd)