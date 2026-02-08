from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import setup_db


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://wt.com",
    "https://wt.com",
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    await setup_db()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods="*",
    allow_headers="*",
)

@app.get("/")
async def health_check():
    return {"message": "ok"}