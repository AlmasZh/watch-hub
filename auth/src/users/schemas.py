from pydantic import BaseModel, ConfigDict, EmailStr, PastDate
from pydantic.alias_generators import to_camel


class UserResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: int
    email: EmailStr
    username: str
    display_name: str
    picture: str | None
    date_of_birth: PastDate
