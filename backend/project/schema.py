from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, field_validator
from uuid import UUID

class UserSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    username: str
    email: str

class ProjectBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    title: str
    description: Optional[str] = None # Changed to Optional to prevent 422 errors

class ProjectCreate(ProjectBase):
    pass # This is what your POST request uses

class ProjectUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class ProjectList(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: Optional[str] = None
    owner_id: str  # This is where the error occurs
    createdDate: datetime

    @field_validator('owner_id', mode='before')
    @classmethod
    def transform_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v