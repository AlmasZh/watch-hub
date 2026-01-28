from fastapi import APIRouter, Response, Depends, status, Cookie, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated

from src.users.models import User
from src.database import SessionDep
from src.config import settings
from .utils import verify_jwt_token, generate_jwt_token
from .dependencies import get_current_user
from .schemas import UserSignUpResponse, UserSignUp
from .service import create_user

router = APIRouter(tags=["auth"])

@router.get("/authenticate")
async def authenticate(current_user = Depends(get_current_user)):
    return {"user", current_user}

# @router.post("/login")
# async def login(user: UserLogin):

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
async def refresh_access_token(refresh_token: Annotated[str, Cookie()] = None, db: SessionDep = SessionDep):
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing")
    
    payload = verify_jwt_token(refresh_token)
    user_id = payload.get("sub")
    new_access_token = generate_jwt_token(user_id, settings.JWT_ACCESS_TOKEN_EXPIRATION)
    
    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }