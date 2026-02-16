from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Movie


async def get_movies(db: AsyncSession):
    stmt = select(Movie)
    res = await db.execute(stmt)
    movies = res.scalars().all()
    return movies