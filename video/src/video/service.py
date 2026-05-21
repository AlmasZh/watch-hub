from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from auth.schemas import User
from upload.dependencies import storage_client

from .exceptions import ForbiddenError, NotFoundError
from .models import Movie, UserVideo
from .schemas import UserVideoResponse, user_video_adapter


async def get_movies(db: AsyncSession) -> list[Movie]:
    stmt = select(Movie)
    res = await db.execute(stmt)
    movies = list(res.scalars().all())
    return movies


async def get_movie_by_uuid(uuid: UUID, db: AsyncSession) -> Movie:
    movie = await db.get(Movie, uuid)

    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found"
        )
    return movie

async def get_all_user_videos(owner_id: int, db: AsyncSession) -> list[UserVideoResponse]:
    stmt = select(UserVideo).where(UserVideo.owner_id == owner_id)
    res = await db.execute(stmt)
    user_videos = list(res.scalars().all())
    user_videos_response = user_video_adapter.validate_python(user_videos)

    if not user_videos:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User videos not found"
        )

    for r, v in zip(user_videos_response, user_videos, strict=True):
        r.stream_url = await storage_client.get_video_url(v.storage_key, 3600)

    return user_videos_response

async def delete_user_video(video_uuid: UUID, user: User, db: AsyncSession) -> None:
    user_video = await db.get(UserVideo, video_uuid)

    if not user_video:
        raise NotFoundError("Video not found")

    if user_video.owner_id != user.id:
        raise ForbiddenError("You don't have permissions to delete this video")

    try:
        await db.delete(user_video)
        await db.commit()
    except SQLAlchemyError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred while deleting video",
        ) from e
