from typing import Literal
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        secrets_dir="/run/secrets",
        extra="ignore"
    )

    db_scheme: str = "postgresql+asyncpg"
    db_host: str = "db"
    db_port: int = 5432
    db_user: str = "user"
    db_name: str = "video"

    db_password: SecretStr
    
    jwt_public: SecretStr
    jwt_algorithm: str = "RS256"
    jwt_issuer: str = "watch-hub"

    s3_bucket_name: str
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_region: str
    s3_endpoint_url: str
    s3_force_path_style: bool | None = None

    grpc_addr: str = "auth:50051"
    auth_addr: str = "http://wh.com/api/auth"

    api_prefix: str = "/api/video"
    app_env: Literal["dev", "test", "prod"] = "prod"

    @property
    def db_url(self) -> str:
        return f'{self.db_scheme}://{self.db_user}:{self.db_password.get_secret_value()}@{self.db_host}:{self.db_port}/{self.db_name}'
    
    @property
    def stream_url_prefix(self) -> str:
        return f'{self.s3_endpoint_url}/{self.s3_bucket_name}/'

settings = Settings()
