from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import UserSignUp
from ..users.models import User
from .utils import get_password_hash

async def create_user(user: UserSignUp, db: AsyncSession):
    user_dict = user.model_dump(exclude={"password"})
    passwd = user.password.get_secret_value()
    hashed_passwd = get_password_hash(passwd=passwd)
    db_user = User(
        **user_dict,
        password=hashed_passwd
    )

    db.add(db_user)

    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User with this email or username already exists")
    except SQLAlchemyError as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error occurred while creating user. Details: {e}")
    
    await db.refresh(db_user)

    return db_user