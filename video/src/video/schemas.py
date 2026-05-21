from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, HttpUrl
from pydantic.alias_generators import to_camel
from pydantic.type_adapter import TypeAdapter


class MovieResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True, from_attributes=True
    )

    id: UUID
    title: str
    description: str | None = None

    stream_url: HttpUrl
    poster_url: HttpUrl | None = None
    thumbnail_url: HttpUrl | None = None

    # Media details
    duration_seconds: int
    release_year: int
    director: str | None = None
    rating: float | None = None

    status: Literal["pending", "processing", "ready", "failed"]
    type: str


class UserVideoResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        validate_by_alias=True,
        validate_by_name=True,
        from_attributes=True,
    )

    id: UUID
    stream_url: str
    thumbnail_url: str | None = None
    duration_seconds: int
    original_file_name: str

    created_at: datetime
    updated_at: datetime

user_video_adapter = TypeAdapter(list[UserVideoResponse])
