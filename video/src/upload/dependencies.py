from typing import Annotated

from fastapi import Depends

from src.config import settings

from .storage_client import S3StorageClient

storage_client = S3StorageClient(
    bucket_name=settings.s3_bucket_name,
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
    region_name=settings.aws_region,
    endpoint_url=settings.s3_endpoint_url,
    force_path_style=settings.s3_force_path_style,
)


def get_storage_client() -> S3StorageClient:
    return storage_client


StorageClientDep = Annotated[S3StorageClient, Depends(get_storage_client)]
