import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    def __init__(self) -> None:
        self.DB_SCHEME = os.getenv("DB_SCHEME")
        self.DB_USER = os.getenv("DB_USER")
        self.DB_HOST = os.getenv("DB_HOST")
        self.DB_PORT = os.getenv("DB_PORT", "5432")
        self.DB_NAME = os.getenv("DB_NAME")
        self.DB_PASSWORD = self._get_secret("db_password") or os.getenv("DB_PASSWORD")
        self.DB_SSL_MODE = os.getenv("DB_SSL_MODE", "require")

        self.JWT_PUBLIC_KEY = self._get_secret("jwt_public")
        self.JWT_PRIVATE_KEY = self._get_secret("jwt_private")
        self.JWT_ALGORITHM = "RS256"
        self.JWT_ISSUER = os.getenv("JWT_ISSUER", "watch-hub")
        self.JWT_ACCESS_TOKEN_EXPIRATION = 15  # minutes
        self.JWT_REFRESH_TOKEN_EXPIRATION = 10080  # 10080 minutes = 1 week
        self.GRPC_ADDR = os.getenv("GRPC_ADDR", "0.0.0.0:50051")

        self.USE_SECURE_COOKIES = (
            os.getenv("USE_SECURE_COOKIES", "True").lower() == "true"
        )

        self.APP_ENV = os.getenv("APP_ENV")

        self.API_PREFIX = "/api/auth"

        self._validate_config()

    def _get_secret(self, secret_name: str) -> str | None:
        try:
            with open(f"/etc/secrets/{secret_name}") as f:
                return f.read().strip()
        except OSError:
            return None

    def _validate_config(self) -> None:
        checks = {
            "DB_SCHEME": self.DB_SCHEME,
            "DB_HOST": self.DB_HOST,
            "DB_USER": self.DB_USER,
            "DB_NAME": self.DB_NAME,
            "DB_PASSWORD": self.DB_PASSWORD,
            "JWT_PRIVATE_KEY": self.JWT_PRIVATE_KEY,
            "JWT_PUBLIC_KEY": self.JWT_PUBLIC_KEY,
        }
        missing = [name for name, value in checks.items() if not value]

        if missing:
            raise ValueError(
                f"Configuration error. Missing values for {', '.join(missing)}"
            )

    @property
    def DB_URL(self) -> str:
        return f"{self.DB_SCHEME}://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?ssl={self.DB_SSL_MODE}"


settings = Settings()
