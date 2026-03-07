from pydantic import BaseModel, ConfigDict, Field


class UploadStartRequest(BaseModel):
    filename: str
    parts_count: int
    content_type: str = "video/mp4"

class PartInfo(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    part_number: int = Field(alias="PartNumber")
    etag: str = Field(alias="ETag")

class UploadCompleteRequest(BaseModel):
    file_key: str
    upload_id: str
    parts: list[PartInfo]