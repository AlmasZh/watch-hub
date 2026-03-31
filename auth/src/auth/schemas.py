from typing import Annotated

from pydantic import (
    AfterValidator,
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    PastDate,
    SecretStr,
)
from pydantic.alias_generators import to_camel

from .utils import username_validator


class UserBase(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    email: EmailStr = Field(examples=["almas@gmail.com"])
    username: Annotated[
        str,
        Field(min_length=2, max_length=50, examples=["almas"]),
        AfterValidator(username_validator),
    ]
    display_name: str = Field(min_length=2, max_length=50, default=None)
    date_of_birth: PastDate = Field(examples=["2012-12-12"])


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class UserRegister(UserBase):
    password: SecretStr = Field(min_length=8, max_length=100, examples=["passwd123"])


class AccessTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
