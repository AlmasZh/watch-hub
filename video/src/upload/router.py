from fastapi import HTTPException, Depends, APIRouter, status
from typing import Annotated
import uuid

from .storage_client import S3StorageClient
from .dependencies import get_storage_client
from .schemas import UploadCompleteRequest, UploadStartRequest, UploadStartResponse


router = APIRouter(prefix="/upload", tags=["upload"])

StorageClientDep = Annotated[S3StorageClient, Depends(get_storage_client)]

@router.post("/start", response_model=UploadStartResponse)
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
async def complete_multipart_upload(request: UploadCompleteRequest, storage: StorageClientDep):
    parts_dict = [part.model_dump(by_alias=True) for part in request.parts]

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
