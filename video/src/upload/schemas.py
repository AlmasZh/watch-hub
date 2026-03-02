from pydantic import BaseModel


class UploadStarRequest(BaseModel):
    filename: str
    parts_count: int
    content_type: str = "video/mp4"

class PartInfo(BaseModel):
    PartNumber: int
    ETag: str

class UploadCompleteRequest(BaseModel):
    filename: str
    upload_id: str
    parts: list[PartInfo]