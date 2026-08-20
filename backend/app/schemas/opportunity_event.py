from datetime import datetime

from pydantic import BaseModel
from pydantic import ConfigDict


class OpportunityEventResponse(BaseModel):
    id: int
    opportunity_id: int
    event_type: str
    title: str
    description: str | None
    user_id: int | None
    old_stage: str | None
    new_stage: str | None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )
