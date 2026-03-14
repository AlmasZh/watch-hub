from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import setup_db
from .config import settings
from .video.router import router as video_router
from .upload.router import router as upload_router
from .auth.auth_client import auth_grpc_client


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://wh.com",
    "https://wh.com",
]
prefix = settings.api_prefix

@asynccontextmanager
async def lifespan(app: FastAPI):
    # await setup_db()
    auth_grpc_client.connect()
    yield
    
    await auth_grpc_client.close()

app = FastAPI(lifespan=lifespan, docs_url=f'{prefix}/docs', openapi_url=f'{prefix}/openapi.json')

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers="*",
)

app.include_router(video_router, prefix=prefix)
app.include_router(upload_router, prefix=prefix)

@app.get(f'{prefix}/health')
async def health_check():
    return {"message": "ok"}