from fastapi import HTTPException, Depends, APIRouter, status
import uuid

from .storage_client import S3StorageClient
from .dependencies import get_storage_client
from .schemas import UploadCompleteRequest, UploadStartRequest


router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("/start")
async def start_multipart_upload(request: UploadStartRequest, storage: S3StorageClient = Depends(get_storage_client)):
    file_key = f"raw_videos/{uuid.uuid4()}-{request.file_key}"

    upload_id = await storage.create_multipart_upload(
        object_key=file_key, 
        content_type=request.content_type
    )

    urls = await storage.generate_presigned_urls(
        object_key=file_key, upload_id=upload_id, parts_count=request.parts_count
    )
    
    return {
        "file_key": file_key,
        "upload_id": upload_id,
        "presigned_urls": urls
    }

@router.post("/complete")
async def complete_multipart_upload(request: UploadCompleteRequest, storage: S3StorageClient = Depends(get_storage_client)):
    parts_dict = [part.model_dump() for part in request.parts]

    try:
        await storage.complete_multipart_upload(
            object_key=request.file_key,
            upload_id=request.upload_id,
            parts=parts_dict
        )
        
        # Store video data using sqlalchemy
        # ...

        return {"message": "Upload completed successfully", "file_key": request.file_key}
    except Exception as e:
        await storage.abort_multipart_upload(
            request.file_key,
            upload_id=request.upload_id,
        )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))