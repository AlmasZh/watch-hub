from fastapi import APIRouter, Depends

from ..auth.dependencies import get_current_user
from .models import User

router = APIRouter(tags=["users"])

@router.get("/me")
async def get_user_info(current_user: User = Depends(get_current_user)):
    return current_user