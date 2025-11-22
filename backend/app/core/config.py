from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Traffic Monitoring API"
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/traffic_db"

    class Config:
        env_file = ".env"

settings = Settings()
