from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
)


class ActivityBase(BaseModel):
    title: str
    activity_type: str
    description: str | None = None
    scheduled_at: datetime
    status: str = "pending"
    customer_id: int
    opportunity_id: int | None = None


class ActivityCreate(ActivityBase):
    pass


class ActivityUpdate(BaseModel):
    title: str | None = None
    activity_type: str | None = None
    description: str | None = None
    scheduled_at: datetime | None = None
    status: str | None = None
    customer_id: int | None = None
    opportunity_id: int | None = None


class ActivityResponse(ActivityBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class ActivitySummaryResponse(BaseModel):
    total: int
    pending: int
    completed: int
    overdue: int
    upcoming: int