from fastapi import APIRouter, Response, Cookie, Depends
from fastapi.responses import RedirectResponse

from src.users.models import User
from src.database import SessionDep
from .utils import verify_jwt_token
from .dependencies import get_current_user

router = APIRouter(tags=["auth"])

@router.get("/authenticate")
async def authenticate(current_user = Depends(get_current_user)):
    return {"user", current_user}