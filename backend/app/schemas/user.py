from datetime import datetime
from typing import Literal

from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import EmailStr
from pydantic import Field


UserRole = Literal[
    "admin",
    "supervisor",
    "sales",
]


class UserBase(BaseModel):
    full_name: str = Field(
        min_length=2,
        max_length=150,
    )

    email: EmailStr

    role: UserRole = "sales"

    is_active: bool = True


class UserCreate(UserBase):
    password: str = Field(
        min_length=8,
        max_length=128,
    )


class UserUpdate(BaseModel):
    full_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    email: EmailStr | None = None

    role: UserRole | None = None

    is_active: bool | None = None

    password: str | None = Field(
        default=None,
        min_length=8,
        max_length=128,
    )


class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginResponse(TokenResponse):
    user: UserResponse