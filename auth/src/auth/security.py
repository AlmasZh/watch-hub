from fastapi.security import OAuth2PasswordBearer
from .schemas import UserBase

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")