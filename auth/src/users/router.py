from fastapi import APIRouter

from auth.dependencies import UserDep
from users.models import User

from .schemas import UserResponse

router = APIRouter(tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_user_info(current_user: UserDep) -> User:
    return current_user
