from pydantic import BaseModel, ConfigDict, HttpUrl
from pydantic.alias_generators import to_camel
from uuid import UUID


class MovieResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True 
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
    
    status: str
    type: str