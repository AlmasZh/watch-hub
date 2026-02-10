import uuid
from enum import Enum
from datetime import datetime

from sqlalchemy import ForeignKey, String, Integer, Float, Text, DateTime, func, Table, Column
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.dialects.postgresql import UUID

from src.models import Base


class MediaStatus(str, Enum):
    PENDING = "pending"   # Uploaded
    PROCESSING = "processing"
    READY = "ready"       # Ready to stream
    FAILED = "failed"

class VideoPrivacy(str, Enum): # This is unnecessary currently, but may be needed in the future 
    PUBLIC = "public"
    PRIVATE = "private"
    UNLISTED = "unlisted"

movie_genres = Table(
    "movie_genres",
    Base.metadata,
    Column("movie_id", ForeignKey("movies.id"), primary_key=True),
    Column("genre_id", ForeignKey("genres.id"), primary_key=True)
)

class Media(Base):
    __tablename__ = "media"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(255), index=True)
    description: Mapped[str | None] = mapped_column(Text)
    stream_url: Mapped[str] = mapped_column(String(512))
    thumbnail_url: Mapped[str | None] = mapped_column(String(512))
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[MediaStatus] = mapped_column(
        String, default=MediaStatus.PENDING
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), onupdate=func.now(), server_default=func.now()
    )

    # This column distinguishes between 'movie' and 'user_video'
    type: Mapped[str] = mapped_column(String(50))

    __mapper_args__ = {
        "polymorphic_identity": "media",
        "polymorphic_on": "type",
    }


class UserVideo(Media):
    __tablename__ = "user_videos"
    
    id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("media.id"), primary_key=True
    )
    owner_id: Mapped[int] = mapped_column(Integer)
    privacy: Mapped[VideoPrivacy] = mapped_column(
        String, default=VideoPrivacy.PUBLIC
    )

    __mapper_args__ = {
        "polymorphic_identity": "user_video",
    }

class Movie(Media):
    __tablename__ = "movies"

    id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("media.id"), primary_key=True
    )

    # Specific fields for Movies
    release_year: Mapped[int] = mapped_column(Integer)
    director: Mapped[str | None] = mapped_column(String(100))
    rating: Mapped[float | None] = mapped_column(Float) # e.g. IMDB rating 1-10
    
    # Relationships
    genres: Mapped[list["Genre"]] = relationship(
        secondary=movie_genres, back_populates="movies"
    )

    __mapper_args__ = {
        "polymorphic_identity": "movie",
    }

class Genre(Base):
    __tablename__ = "genres"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)
    
    movies: Mapped[list["Movie"]] = relationship(
        secondary=movie_genres, back_populates="genres"
    )
