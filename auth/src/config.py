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
        
        self.APP_ENV = os.getenv("APP_ENV")
    
    def _get_secret(self, secret_name):
        try:
            with open(f'/run/secrets/{secret_name}', 'r') as f:
                return f.read().strip()
        except IOError:
            return None        

    @property
    def DB_URL(self):
        return f"{self.DB_SCHEME}://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

settings = Settings()