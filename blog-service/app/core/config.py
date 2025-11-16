import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # Database
    POSTGRES_DB: str = os.getenv('POSTGRES_DB', 'united_db')
    POSTGRES_USER: str = os.getenv('POSTGRES_USER', 'postgres')
    POSTGRES_PASSWORD: str = os.getenv('POSTGRES_PASSWORD', 'postgres')
    POSTGRES_HOST: str = os.getenv('POSTGRES_HOST', 'localhost')
    POSTGRES_PORT: str = os.getenv('POSTGRES_PORT', '5432')

    # JWT
    JWT_SECRET_KEY: str = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
    JWT_ALGORITHM: str = os.getenv('JWT_ALGORITHM', 'HS256')

    # CORS
    CORS_ALLOWED_ORIGINS: list = os.getenv(
        'CORS_ALLOWED_ORIGINS', 'http://localhost:5173'
    ).split(',')

    # Debug
    DEBUG: bool = os.getenv('BLOG_SERVICE_DEBUG', 'True').lower() == 'true'

    @property
    def DATABASE_URL(self) -> str:
        password = quote_plus(self.POSTGRES_PASSWORD)
        return f"postgresql://{self.POSTGRES_USER}:{password}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"


settings = Settings()
