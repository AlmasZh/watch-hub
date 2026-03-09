from fastapi import Depends, HTTPException, status
from typing import Annotated

from .service import validate_token
from .schemas import User
from .security import oauth2_scheme


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    user = await validate_token(token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

UserDep = Annotated[User, Depends(get_current_user)]