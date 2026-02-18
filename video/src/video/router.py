from fastapi import APIRouter
from uuid import UUID

from src.database import SessionDep
from .service import get_movies, get_movie_by_uuid
from .schemas import MovieResponse


router = APIRouter(tags=["video"])

@router.get('/movies', response_model=list[MovieResponse])
async def get_recommended_movies(db: SessionDep):
    movies = await get_movies(db)
    return movies

@router.get('/movie/{uuid}', response_model=MovieResponse)
async def get_movie(uuid: UUID, db: SessionDep):
    movie = await get_movie_by_uuid(uuid, db)
    return movie