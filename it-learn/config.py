import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Config(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env.prod.local", env_file_encoding="utf-8", extra='ignore')

    # Application settings
    SECRET_KEY: str = Field(..., description="Secret key for JWT")
    DEBUG: bool = Field(default=False, description="Enable debug mode")
    
    # Database settings
    MONGODB_URI: str = Field(..., description="MongoDB connection URI")
    
    # Redis settings
    REDIS_HOST: str = Field("redis", description="Redis host")
    REDIS_PORT: int = Field(6379, description="Redis port")
    REDIS_PASSWORD: str = Field(None, description="Redis password")
    
    # Security settings
    CORS_ORIGINS: str = Field("*", description="Allowed CORS origins")
    
    # ML Model settings
    ML_MODEL_PATH: str = Field("en_core_web_sm", description="Path to SpaCy model")

    @classmethod
    def create_config(cls):
        if os.getenv('TESTING'):
            # Use test configurations
            return cls(
                SECRET_KEY='test_secret_key',
                DEBUG=True,
                MONGODB_URI='mongodb://localhost:27017/test',
                REDIS_HOST='localhost',
                REDIS_PORT=6379,
                REDIS_PASSWORD=None,
                CORS_ORIGINS='*',
                ML_MODEL_PATH='en_core_web_sm'
            )
        return cls()

# Load configuration
config = Config.create_config()
