from pydantic import BaseModel, Field
from typing import Optional

class ProfileUpdateSchema(BaseModel):
    bio: Optional[str] = Field(None, description="User's bio")
    preferred_language: Optional[str] = Field(None, description="User's preferred language")
    profile_picture: Optional[str] = Field(None, description="URL of the user's profile picture")
