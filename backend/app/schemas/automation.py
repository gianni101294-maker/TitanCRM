from datetime import datetime
from typing import Any

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class AutomationRuleBase(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=150,
    )

    description: str | None = None

    trigger_type: str = Field(
        min_length=1,
        max_length=100,
    )

    conditions: dict[str, Any] = Field(
        default_factory=dict,
    )

    action_type: str = Field(
        min_length=1,
        max_length=100,
    )

    action_config: dict[str, Any] = Field(
        default_factory=dict,
    )

    is_active: bool = True


class AutomationRuleCreate(
    AutomationRuleBase,
):
    pass


class AutomationRuleUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    description: str | None = None

    trigger_type: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    conditions: dict[str, Any] | None = None

    action_type: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    action_config: dict[str, Any] | None = None

    is_active: bool | None = None


class AutomationRuleResponse(
    AutomationRuleBase,
):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    created_by: int | None
    created_at: datetime
    updated_at: datetime