from fastapi.security import OAuth2PasswordBearer

from .schemas import UserBase
from src.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_PREFIX}/login")