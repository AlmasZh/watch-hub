from fastapi import APIRouter
from uuid import UUID

from src.database import SessionDep
from ..auth.dependencies import UserDep
from .service import get_movies, get_movie_by_uuid, get_all_user_videos
from .schemas import MovieResponse, UserVideoResponse


router = APIRouter(tags=["video"])

@router.get('/movies', response_model=list[MovieResponse])
async def get_recommended_movies(db: SessionDep):
    movies = await get_movies(db)
    return movies

@router.get('/movie/{uuid}', response_model=MovieResponse)
async def get_movie(uuid: UUID, db: SessionDep):
    movie = await get_movie_by_uuid(uuid, db)
    return movie

@router.get('/videos', response_model=list[UserVideoResponse] | None)
async def get_user_videos(user: UserDep, db: SessionDep):
    user_videos = await get_all_user_videos(owner_id=user.id, db=db)
    return user_videos