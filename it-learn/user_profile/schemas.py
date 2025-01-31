from pydantic import BaseModel, Field
from typing import Optional
from pydantic import field_validator

class ProfileUpdateSchema(BaseModel):
    """Schema for profile update requests"""
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    preferred_language: Optional[str] = Field(None)

    @field_validator('preferred_language')
    @classmethod
    def validate_language(cls, v):
        if v is not None:
            allowed_languages = {'ar', 'en', 'fr', 'es', 'de', 'ko', 'ja', 'zh'}
            if v not in allowed_languages:
                raise ValueError("Invalid language code")
        return v

class ProfilePictureSchema(BaseModel):
    """Schema for profile picture metadata"""
    filename: str
    content_type: str
    size: int

    @field_validator('content_type')
    @classmethod
    def validate_content_type(cls, v):
        allowed_types = {'image/jpeg', 'image/png', 'image/gif'}
        if v not in allowed_types:
            raise ValueError("Invalid file type")
        return v

    @field_validator('size')
    @classmethod
    def validate_size(cls, v):
        max_size = 5 * 1024 * 1024  # 5MB
        if v > max_size:
            raise ValueError("File too large")
        return v
