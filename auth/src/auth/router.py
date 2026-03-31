from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from fastapi.security.oauth2 import OAuth2PasswordRequestForm

from src.config import settings
from src.database import SessionDep

from .dependencies import UserDep
from .schemas import AccessTokenResponse, UserRegister
from .service import authenticate_user, create_user
from .utils import generate_jwt_token, get_current_token_payload

router = APIRouter(tags=["auth"])


@router.get("/verify")
async def verify(current_user: UserDep):
    return current_user


@router.post("/login", response_model=AccessTokenResponse)
async def login(
    response: Response,
    user: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: SessionDep,
):
    selected_user = await authenticate_user(user, db)

    access_token = generate_jwt_token(
        selected_user.id, settings.JWT_ACCESS_TOKEN_EXPIRATION
    )
    refresh_token = generate_jwt_token(
        selected_user.id, settings.JWT_REFRESH_TOKEN_EXPIRATION
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=settings.USE_SECURE_COOKIES,
        samesite="lax",
        max_age=settings.JWT_REFRESH_TOKEN_EXPIRATION * 60,
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post(
    "/register", response_model=AccessTokenResponse, status_code=status.HTTP_201_CREATED
)
async def register(response: Response, user: UserRegister, db: SessionDep):
    new_user = await create_user(user=user, db=db)

    access_token = generate_jwt_token(new_user.id, settings.JWT_ACCESS_TOKEN_EXPIRATION)
    refresh_token = generate_jwt_token(
        new_user.id, settings.JWT_REFRESH_TOKEN_EXPIRATION
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=settings.USE_SECURE_COOKIES,
        samesite="lax",
        max_age=settings.JWT_REFRESH_TOKEN_EXPIRATION * 60,
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/refresh-token", response_model=AccessTokenResponse)
async def refresh_access_token(refresh_token: Annotated[str | None, Cookie()] = None):
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing"
        )

    payload = get_current_token_payload(refresh_token)
    user_id = payload.sub
    new_access_token = generate_jwt_token(user_id, settings.JWT_ACCESS_TOKEN_EXPIRATION)

    return {"access_token": new_access_token, "token_type": "bearer"}
