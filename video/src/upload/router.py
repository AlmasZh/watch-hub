from fastapi import HTTPException, APIRouter, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
import uuid

from .schemas import UploadCompleteRequest, UploadStartRequest, UploadStartResponse
from .dependencies import StorageClientDep
from ..auth.dependencies import UserDep
from ..video.models import UserVideo
from ..database import SessionDep


router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("/start", response_model=UploadStartResponse, status_code=status.HTTP_201_CREATED)
async def start_multipart_upload(request: UploadStartRequest, storage: StorageClientDep):
    file_key = f"raw_videos/{uuid.uuid4()}-{request.filename}"

    upload_id = await storage.create_multipart_upload(
        object_key=file_key, 
        content_type=request.content_type
    )

    urls = await storage.generate_presigned_urls(
        object_key=file_key, upload_id=upload_id, parts_count=request.parts_count
    )
    return UploadStartResponse(file_key=file_key, presigned_urls=urls, upload_id=upload_id)

@router.post("/complete")
async def complete_multipart_upload(
        request: UploadCompleteRequest,
        storage: StorageClientDep, 
        user: UserDep,
        db: SessionDep
    ):
    parts_dict = [part.model_dump(by_alias=True) for part in request.parts]

    try:
        await storage.complete_multipart_upload(
            object_key=request.file_key,
            upload_id=request.upload_id,
            parts=parts_dict
        )
        
        video = UserVideo(
            owner_id=user.id,
            title=request.filename,
            original_file_name=request.filename,
            storage_key=request.file_key,
            stream_url=request.file_key, # just for testing, must be changed in future
            thumbnail_url="", # TODO: set thumbnail_url after thumbnail generation pipeline is implemented
        )
        db.add(video)

        try:
            await db.commit()
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail="An internal server error occurred while creating the video."
            )
        await db.refresh(video)

        return {"message": "Upload completed successfully", "video": video}
    except Exception as e:
        try:
            await storage.abort_multipart_upload(
                request.file_key,
                upload_id=request.upload_id,
            )
        except Exception as abort_exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(abort_exc))

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Failed to complete multipart upload. The operation was aborted."
        )
