from typing import Annotated
from pydantic import BaseModel, EmailStr, Field, AfterValidator, SecretStr, PastDate
from pydantic import ConfigDict
from pydantic.alias_generators import to_camel

from .utils import username_validator


class UserBase(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    email: EmailStr
    username: Annotated[str, Field(min_length=2, max_length=50), AfterValidator(username_validator)]
    display_name: str | None = Field(min_length=2, max_length=50, default=None)
    date_of_birth: PastDate

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

class UserSignUp(UserBase):
    password: SecretStr = Field(min_length=8, max_length=100)

class UserSignUpResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"