import jwt
from typing import Dict, Any
from fastapi import HTTPException, status
from datetime import datetime, timedelta, timezone

from src.config import settings

def generate_jwt_token(sub: str, expires_in_minutes: int):
    now = datetime.now(timezone.utc)

    payload = {
        "sub": sub,
        "iat": now,
        "exp": now + timedelta(minutes=expires_in_minutes),
        "iss": "watch-together"
    }

    token = jwt.encode(payload=payload, key=settings.JWT_PRIVATE_KEY, algorithm=settings.JWT_ALGORITHM)

    return token

def verify_jwt_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, key=settings.JWT_PUBLIC_KEY, algorithms=[settings.JWT_ALGORITHM])
        print(f'\n\n payload:\n{payload}\n\n')
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during verification"
        )
