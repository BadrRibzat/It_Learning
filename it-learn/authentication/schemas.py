from pydantic import BaseModel, EmailStr, ConfigDict, Field
from datetime import datetime
from pydantic import field_validator, ValidationInfo

class UserRegisterSchema(BaseModel):
    model_config = ConfigDict(extra='forbid')
    
    full_name: str = Field(..., min_length=1)
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str = Field(...)
    date_of_birth: str | None = None
    current_language: str = Field(default='en')

    @field_validator('confirm_password')
    @classmethod
    def passwords_match(cls, v: str, values: ValidationInfo) -> str:
        password = values.data.get('password')
        if password and v != password:
            raise ValueError("Passwords do not match")
        return v

    @field_validator('date_of_birth')
    @classmethod
    def validate_date_of_birth(cls, v: str | None) -> str | None:
        if v:
            try:
                datetime.strptime(v, "%Y-%m-%d")
            except ValueError:
                raise ValueError("Date of birth must be in YYYY-MM-DD format")
        return v

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str
