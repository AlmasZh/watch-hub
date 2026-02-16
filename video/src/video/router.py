from fastapi import APIRouter

from src.database import SessionDep
from .service import get_movies
from .schemas import MovieResponse


router = APIRouter(tags=["video"])

@router.get('/movies', response_model=list[MovieResponse])
async def get_recommended_movies(db: SessionDep):
    movies = await get_movies(db)
    return movies