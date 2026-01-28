from typing import Annotated
from fastapi import HTTPException, status, Depends
from sqlalchemy import select

from .security import oauth2_scheme
from ..database import SessionDep
from ..users.models import User
from .utils import verify_jwt_token

async def get_current_user(access_token: Annotated[str, Depends(oauth2_scheme)], db: SessionDep = SessionDep):
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    payload = verify_jwt_token(access_token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})

    stmt = select(User).where(User.id == user_id)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found", headers={"WWW-Authenticate": "Bearer"})

    return user