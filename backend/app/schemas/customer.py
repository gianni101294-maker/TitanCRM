from datetime import datetime

from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import EmailStr
from pydantic import Field


class CustomerBase(BaseModel):
    company_name: str = Field(
        min_length=2,
        max_length=255,
    )

    contact_name: str = Field(
        min_length=2,
        max_length=255,
    )

    email: EmailStr

    phone: str = Field(
        min_length=6,
        max_length=30,
    )

    is_active: bool = True


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    company_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    contact_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    email: EmailStr | None = None

    phone: str | None = Field(
        default=None,
        min_length=6,
        max_length=30,
    )

    is_active: bool | None = None


class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )