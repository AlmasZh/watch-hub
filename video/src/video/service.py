from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from .models import Movie, UserVideo


async def get_movies(db: AsyncSession) -> list[Movie]:
    stmt = select(Movie)
    res = await db.execute(stmt)
    movies = res.scalars().all()
    return movies

async def get_movie_by_uuid(uuid: UUID, db: AsyncSession) -> Movie:
    movie = await db.get(Movie, uuid)

    if not Movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
    return movie

async def get_all_user_videos(owner_id: int, db: AsyncSession) -> list[UserVideo]:
    stmt = select(UserVideo).where(UserVideo.owner_id == owner_id)
    res = await db.execute(stmt)
    user_videos = res.scalars().all()
    return user_videos