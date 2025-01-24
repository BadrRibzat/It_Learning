import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Config(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    SECRET_KEY: str = Field("your-default-secret-key", description="Secret key for JWT")
    DEBUG: bool = Field(False, description="Enable debug mode")
    MONGODB_URI: str = Field(..., description="MongoDB connection URI")
    JWT_SECRET_KEY: str = Field("jwt-secret-key", description="JWT secret key")
    FRONTEND_URL: str = Field("http://localhost:8080", description="Frontend URL for CORS")
    PROPAGATE_EXCEPTIONS: bool = True
    REDIS_HOST: str = Field("localhost", description="Redis host")
    REDIS_PORT: int = Field(6379, description="Redis port")
    ML_MODEL_PATH: str = Field("en_core_web_sm", description="Path to ML model")
    

    @classmethod
    def create_config(cls):
         return Config()

# Load configuration
config = Config.create_config()
print(f"REDIS_HOST: {config.REDIS_HOST}")
