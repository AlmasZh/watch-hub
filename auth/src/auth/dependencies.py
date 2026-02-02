from typing import Annotated
from fastapi import HTTPException, status, Depends
from sqlalchemy import select

from .security import oauth2_scheme
from ..database import SessionDep
from ..users.models import User
from .utils import get_current_token_payload

async def get_current_user(access_token: Annotated[str, Depends(oauth2_scheme)], db: SessionDep) -> User:
    payload = get_current_token_payload(access_token)
    sub = payload.sub
    
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    user_id = int(sub)
    stmt = select(User).where(User.id == user_id)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found", headers={"WWW-Authenticate": "Bearer"})

    return user