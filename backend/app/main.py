from contextlib import asynccontextmanager

from app.api.v1.analyses import router as analyses_router
from app.api.v1.documents import router as documents_router
from app.core.logging import setup_logging
from app.core.settings import settings
from app.db import models
from app.db.models.base import Base
from app.db.session import engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents_router, prefix="/api/v1")
app.include_router(analyses_router, prefix="/api/v1")


@app.get("/")
def root():
    return {"status": "ok", "app": settings.app_name}
