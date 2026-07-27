from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ActivityBase(BaseModel):
    title: str
    activity_type: str
    description: Optional[str] = None
    scheduled_at: datetime
    status: str = "pending"
    customer_id: int


class ActivityCreate(ActivityBase):
    pass


class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    activity_type: Optional[str] = None
    description: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    status: Optional[str] = None
    customer_id: Optional[int] = None


class ActivityResponse(ActivityBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ActivitySummaryResponse(BaseModel):
    total: int
    pending: int
    completed: int
    overdue: int
    upcoming: int    