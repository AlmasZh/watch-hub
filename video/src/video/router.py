from fastapi import APIRouter, HTTPException, status
from uuid import UUID

from src.database import SessionDep
from ..auth.dependencies import UserDep
from .service import get_movies, get_movie_by_uuid, get_all_user_videos, delete_user_video
from .schemas import MovieResponse, UserVideoResponse
from .exceptions import ForbiddenError, NotFoundError


router = APIRouter(tags=["video"])

@router.get('/movies', response_model=list[MovieResponse])
async def get_recommended_movies(db: SessionDep):
    movies = await get_movies(db)
    return movies

@router.get('/movie/{uuid}', response_model=MovieResponse)
async def get_movie(uuid: UUID, db: SessionDep):
    movie = await get_movie_by_uuid(uuid, db)
    return movie

@router.get('/videos', response_model=list[UserVideoResponse])
async def get_user_videos(user: UserDep, db: SessionDep):
    user_videos = await get_all_user_videos(owner_id=user.id, db=db)
    return user_videos

@router.delete('/{video_uuid}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_video(video_uuid: UUID, user: UserDep, db: SessionDep):
    try:
        await delete_user_video(video_uuid, user, db)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ForbiddenError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    return None