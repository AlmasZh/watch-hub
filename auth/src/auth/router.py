from fastapi import APIRouter, Response, Depends, status, Cookie, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from typing import Annotated

from src.users.models import User
from src.database import SessionDep
from src.config import settings
from .utils import get_current_token_payload, generate_jwt_token
from .dependencies import get_current_user
from .schemas import UserSignUpResponse, UserSignUp, UserLoginResponse
from .service import create_user, authenticate_user

router = APIRouter(tags=["auth"])

@router.get("/verify")
async def verify(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/login", response_model=UserLoginResponse)
async def login(response: Response, user: Annotated[OAuth2PasswordRequestForm, Depends()], db: SessionDep):
    selected_user = await authenticate_user(user, db)

    access_token = generate_jwt_token(selected_user.id, settings.JWT_ACCESS_TOKEN_EXPIRATION)
    refresh_token = generate_jwt_token(selected_user.id, settings.JWT_REFRESH_TOKEN_EXPIRATION)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token, 
        httponly=True,
        secure=settings.USE_SECURE_COOKIES,
        samesite="lax",
        max_age=settings.JWT_REFRESH_TOKEN_EXPIRATION * 60,
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/signup", response_model=UserSignUpResponse, status_code=status.HTTP_201_CREATED)
async def signup(response: Response, user: UserSignUp, db: SessionDep):
    new_user = await create_user(user=user, db=db)

    access_token = generate_jwt_token(new_user.id, settings.JWT_ACCESS_TOKEN_EXPIRATION)
    refresh_token = generate_jwt_token(new_user.id, settings.JWT_REFRESH_TOKEN_EXPIRATION)
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token, 
        httponly=True,
        secure=settings.USE_SECURE_COOKIES,
        samesite="lax",
        max_age=settings.JWT_REFRESH_TOKEN_EXPIRATION * 60,
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/refresh-token")
async def refresh_access_token(refresh_token: Annotated[str | None, Cookie()] = None):
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing")
    
    payload = get_current_token_payload(refresh_token)
    user_id = payload.sub
    new_access_token = generate_jwt_token(user_id, settings.JWT_ACCESS_TOKEN_EXPIRATION)
    
    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }