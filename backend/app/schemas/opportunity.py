from datetime import date, datetime
from decimal import Decimal
from typing import Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


OpportunityStage = Literal[
    "prospect",
    "contacted",
    "proposal",
    "negotiation",
    "won",
    "lost",
]


OpportunityPriority = Literal[
    "low",
    "medium",
    "high",
]


class OpportunityBase(BaseModel):
    title: str = Field(
        min_length=2,
        max_length=200,
    )

    value: Decimal = Field(
        gt=0,
        max_digits=12,
        decimal_places=2,
    )

    stage: OpportunityStage = "prospect"

    priority: OpportunityPriority = "medium"

    probability: int = Field(
        default=20,
        ge=0,
        le=100,
    )

    expected_close_date: date | None = None

    notes: str | None = Field(
        default=None,
        max_length=5000,
    )

    assigned_user_id: int | None = Field(
        default=None,
        gt=0,
    )

    customer_id: int = Field(
        gt=0,
    )


class OpportunityCreate(OpportunityBase):
    pass


class OpportunityUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=2,
        max_length=200,
    )

    value: Decimal | None = Field(
        default=None,
        gt=0,
        max_digits=12,
        decimal_places=2,
    )

    stage: OpportunityStage | None = None

    priority: OpportunityPriority | None = None

    probability: int | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    expected_close_date: date | None = None

    notes: str | None = Field(
        default=None,
        max_length=5000,
    )

    assigned_user_id: int | None = Field(
        default=None,
        gt=0,
    )

    customer_id: int | None = Field(
        default=None,
        gt=0,
    )


class OpportunityResponse(
    OpportunityBase,
):
    id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )