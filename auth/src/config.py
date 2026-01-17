from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    def __init__(self):
        self.DB_SCHEME = os.getenv("DB_SCHEME")
        self.DB_USER = os.getenv("DB_USER")
        self.DB_HOST = os.getenv("DB_HOST")
        self.DB_PORT = os.getenv("DB_PORT", "5432")
        self.DB_NAME = os.getenv("DB_NAME")
        self.DB_PASSWORD = self._get_secret("db_password") or os.getenv("DB_PASSWORD")

        self.JWT_PUBLIC_KEY = self._get_secret("jwt_public")
        self.JWT_PRIVATE_KEY = self._get_secret("jwt_private")
        self.JWT_ALGORITHM = "RS256"
        
        self.APP_ENV = os.getenv("APP_ENV")

        self._validate_config()
    
    def _get_secret(self, secret_name):
        try:
            with open(f'/run/secrets/{secret_name}', 'r') as f:
                return f.read().strip()
        except IOError:
            return None        

    def _validate_config(self):
        checks = {
            "DB_SCHEME": self.DB_SCHEME,
            "DB_HOST": self.DB_HOST,
            "DB_USER": self.DB_USER,
            "DB_NAME": self.DB_NAME,
            "DB_PASSWORD": self.DB_PASSWORD,
            "JWT_PRIVATE_KEY": self.JWT_PRIVATE_KEY,
            "JWT_PUBLIC_KEY": self.JWT_PUBLIC_KEY
        }
        missing = [name for name, value in checks.items() if not value]

        if missing:
            raise ValueError(f"Configuration error. Missing values for {', '.join(missing)}")
    
    @property
    def DB_URL(self):
        return f"{self.DB_SCHEME}://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

settings = Settings()