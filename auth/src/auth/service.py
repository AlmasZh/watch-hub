from fastapi import HTTPException, status
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from src.users.models import User
from .schemas import UserRegister
from .utils import get_password_hash, verify_password_hash


async def create_user(user: UserRegister, db: AsyncSession):
    user_dict = user.model_dump(exclude={"password"})
    passwd = user.password.get_secret_value()
    hashed_passwd = get_password_hash(passwd=passwd)
    db_user = User(**user_dict, password=hashed_passwd)

    db.add(db_user)

    try:
        await db.commit()
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email or username already exists",
        ) from e
    except SQLAlchemyError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred while creating user. Details: {e}",
        ) from e

    await db.refresh(db_user)

    return db_user


async def authenticate_user(user: OAuth2PasswordRequestForm, db: AsyncSession) -> User:
    stmt = select(User).where(
        or_(User.username == user.username, User.email == user.username)
    )
    res = await db.execute(stmt)
    selected_user = res.scalar_one_or_none()

    if selected_user is None or not verify_password_hash(
        user.password, selected_user.password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username or password is incorrect",
        )

    return selected_user
