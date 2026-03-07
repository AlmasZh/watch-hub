from pydantic import BaseModel


class UploadStartRequest(BaseModel):
    file_key: str
    parts_count: int
    content_type: str = "video/mp4"

class PartInfo(BaseModel):
    PartNumber: int
    ETag: str

class UploadCompleteRequest(BaseModel):
    file_key: str
    upload_id: str
    parts: list[PartInfo]