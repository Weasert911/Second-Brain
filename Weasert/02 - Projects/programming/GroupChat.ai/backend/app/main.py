from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routes import auth, debate, models, providers


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="GroupChat AI", version="1.0.0", lifespan=lifespan, redirect_slashes=False
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(providers.router, prefix="/api/providers", tags=["providers"])
app.include_router(models.router, prefix="/api/models", tags=["models"])
app.include_router(debate.router, prefix="/api/debate", tags=["debate"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}
