import email
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from pydantic import BaseModel, ConfigDict, field_validator
from uuid import UUID


class User(BaseModel):
    username: str
    email: EmailStr
    firstName: str
    lastName: str
    password: str

    
class DisplayAccount(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    username: str
    email: str
    firstName: Optional[str]
    lastName: Optional[str]
   
    @field_validator('id', mode='before')
    @classmethod
    def transform_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v

   


class UserUpdate(BaseModel):
    username: Optional[str]
    email: Optional[EmailStr]
    firstName: Optional[str]
    lastName: Optional[str]
    password: Optional[str]
    

class Login(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
    id: Optional[str] = None 