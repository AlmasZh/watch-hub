from typing import Any
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel
from datetime import datetime
from uuid import UUID


class UploadStartRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, validate_by_alias=True, validate_by_name=True)
    
    filename: str
    parts_count: int
    content_type: str = "video/mp4"

class UploadStartResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, validate_by_alias=True, validate_by_name=True)

    file_key: str
    upload_id: str
    presigned_urls: list[dict[str, Any]]

class PartInfo(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    part_number: int = Field(alias="PartNumber")
    etag: str = Field(alias="ETag")

class UploadCompleteRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, validate_by_alias=True, validate_by_name=True)
    
    filename: str
    file_key: str
    duration_seconds: int = Field(ge=0)
    upload_id: str
    parts: list[PartInfo]

class UploadCompleteResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, validate_by_alias=True, validate_by_name=True, from_attributes=True)

    id: UUID
    stream_url: str
    thumbnail_url: str | None = None
    duration_seconds: int
    original_file_name: str
    
    created_at: datetime            
    updated_at: datetime