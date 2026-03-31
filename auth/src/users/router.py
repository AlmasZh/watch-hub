from fastapi import APIRouter

from src.auth.dependencies import UserDep
from .schemas import UserResponse

router = APIRouter(tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_user_info(current_user: UserDep):
    return current_user
