from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.db.database import Base


class Post(Base):
    __tablename__ = "posts"
    __table_args__ = {"schema": "blog_schema"}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    author_id = Column(Integer, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
