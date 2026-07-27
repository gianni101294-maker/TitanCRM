from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class CustomerBase(BaseModel):
    company_name: str
    contact_name: str
    email: EmailStr
    phone: str
    is_active: bool = True


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    company_name: str | None = None
    contact_name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    is_active: bool | None = None


class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)