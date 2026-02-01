from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, field_validator, EmailStr
from uuid import UUID

class UserSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    username: str
    email: EmailStr

class ProjectSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str

class TaskBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    title: str
    description: str
    status: str
    project_id: int
    dueDate: date

class TaskCreate(TaskBase):
    pass # This matches what your frontend sends

class TaskUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    project_id: Optional[int] = None
    dueDate: Optional[date] = None

class TaskList(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    status: str
    owner_id: str 
    project_id: int
    project: ProjectSchema
    owner: UserSchema
    # FIX: Change these from 'date' to 'datetime'
    createdDate: datetime 
    dueDate: datetime 

    @field_validator('owner_id', mode='before')
    @classmethod
    def transform_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v

class TaskLogBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    createdDate: datetime # Use datetime here too
    task_id: int