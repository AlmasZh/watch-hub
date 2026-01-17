from typing import AsyncGenerator
from fastapi import Cookie, HTTPException, status
from sqlalchemy import select

from ..database import SessionDep
from ..users.models import User
from .utils import verify_jwt_token

async def get_current_user(access_token: None | str = Cookie(None), db: SessionDep = SessionDep):
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    payload = verify_jwt_token(access_token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    stmt = select(User).where(User.id == user_id)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    
    return user


