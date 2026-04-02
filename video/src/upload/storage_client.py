from contextlib import AbstractAsyncContextManager
from typing import Any

import aioboto3
from botocore.config import Config
from botocore.exceptions import ClientError
from types_aiobotocore_s3 import S3Client


class S3StorageClient:
    def __init__(
        self,
        bucket_name: str,
        aws_access_key_id: str,
        aws_secret_access_key: str,
        region_name: str,
        endpoint_url: str | None = None,
        force_path_style: bool = False,
    ):
        self.bucket_name = bucket_name
        self.endpoint_url = endpoint_url

        client_config_kwargs = {}
        if force_path_style:
            client_config_kwargs["s3"] = {"addressing_style": "path"}
            client_config_kwargs["signature_version"] = "s3v4"
        self.boto_config = (
            Config(**client_config_kwargs) if client_config_kwargs else None
        )

        self.session = aioboto3.Session(
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name,
        )

    def get_client(self) -> AbstractAsyncContextManager[S3Client]:
        return self.session.client(
            "s3", endpoint_url=self.endpoint_url, config=self.boto_config
        )

    async def create_multipart_upload(
        self, object_key: str, content_type: str = "video/mp4"
    ):
        try:
            async with self.get_client() as s3:
                response = await s3.create_multipart_upload(
                    Bucket=self.bucket_name, Key=object_key, ContentType=content_type
                )
                return response["UploadId"]
        except ClientError as e:
            print(f"Failed to create multipart upload for {object_key}: {e}")
            raise

    async def generate_presigned_urls(
        self, object_key: str, upload_id: str, parts_count: int, expires_in: int = 3600
    ) -> list[dict[str, Any]]:
        presigned_urls = []
        try:
            async with self.get_client() as s3:
                for part_number in range(1, parts_count + 1):
                    url = await s3.generate_presigned_url(
                        ClientMethod="upload_part",
                        Params={
                            "Bucket": self.bucket_name,
                            "Key": object_key,
                            "UploadId": upload_id,
                            "PartNumber": part_number,
                        },
                        ExpiresIn=expires_in,
                    )
                    presigned_urls.append({"partNumber": part_number, "url": url})
            return presigned_urls
        except ClientError as e:
            print(f"Failed to generate presigned urls for {object_key}: {e}")
            raise

    async def complete_multipart_upload(
        self, object_key: str, upload_id: str, parts: list[dict[str, Any]]
    ):
        sorted_parts = sorted(parts, key=lambda x: x["PartNumber"])

        try:
            async with self.get_client() as s3:
                response = await s3.complete_multipart_upload(
                    Bucket=self.bucket_name,
                    Key=object_key,
                    UploadId=upload_id,
                    MultipartUpload={"Parts": sorted_parts},
                )
                return response
        except ClientError as e:
            print(f"Failed to complete multipart upload for {object_key}: {e}")
            raise

    async def abort_multipart_upload(self, object_key: str, upload_id: str) -> None:
        try:
            async with self.get_client() as s3:
                await s3.abort_multipart_upload(
                    Bucket=self.bucket_name, Key=object_key, UploadId=upload_id
                )
        except ClientError as e:
            print(f"Failed to abort multipart upload for {object_key}: {e}")
            raise
