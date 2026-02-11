from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import setup_db
from .config import settings


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://wt.com",
    "https://wt.com",
]
prefix = settings.api_prefix

@asynccontextmanager
async def lifespan(app: FastAPI):
    # await setup_db()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods="*",
    allow_headers="*",
)

@app.get(f'{prefix}/health')
async def health_check():
    return {"message": "ok"}