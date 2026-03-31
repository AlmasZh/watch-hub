from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth.grpc_server import start_grpc_server
from auth.router import router as auth_router
from config import settings
from database import setup_database, teardown_database
from users.router import router as users_router

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://wh.com",
    "https://wh.com",
    "http://www.wh.com",
    "https://www.wh.com",
]
prefix = settings.API_PREFIX


@asynccontextmanager
async def lifespan(_app: FastAPI):
    await setup_database()
    grpc_server = await start_grpc_server()
    yield
    await grpc_server.stop(grace=5)
    await teardown_database()


app = FastAPI(
    lifespan=lifespan, docs_url=f"{prefix}/docs", openapi_url=f"{prefix}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods="*",
    allow_headers="*",
)

app.include_router(auth_router, prefix=f"{prefix}")
app.include_router(users_router, prefix=f"{prefix}/users")


@app.get(f"{prefix}/health")
def health_check():
    return {"message": "ok"}
