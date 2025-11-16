from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.core.config import settings
from app.api import posts
from app.db.database import engine
from app.models import post as post_model

# Create schema if not exists
with engine.connect() as conn:
    conn.execute(text("CREATE SCHEMA IF NOT EXISTS blog_schema"))
    conn.commit()

# Create tables (checkfirst=True by default)
post_model.Base.metadata.create_all(bind=engine, checkfirst=True)

app = FastAPI(
    title="Blog Service",
    description="Blog API with JWT verification",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(posts.router, prefix="/api/posts", tags=["posts"])


@app.get("/")
async def root():
    return {"message": "Blog Service API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
