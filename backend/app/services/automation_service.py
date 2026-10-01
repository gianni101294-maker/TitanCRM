from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.automation import AutomationRule
from app.schemas.automation import (
    AutomationRuleCreate,
    AutomationRuleUpdate,
)


def get_automation_rules(
    db: Session,
    active_only: bool = False,
) -> list[AutomationRule]:
    statement = select(AutomationRule)

    if active_only:
        statement = statement.where(
            AutomationRule.is_active.is_(True),
        )

    statement = statement.order_by(
        AutomationRule.created_at.desc(),
    )

    return list(
        db.scalars(statement).all(),
    )


def get_automation_rule_by_id(
    db: Session,
    automation_id: int,
) -> AutomationRule | None:
    statement = select(
        AutomationRule,
    ).where(
        AutomationRule.id == automation_id,
    )

    return db.scalar(statement)


def create_automation_rule(
    db: Session,
    automation_data: AutomationRuleCreate,
    user_id: int | None = None,
) -> AutomationRule:
    automation = AutomationRule(
        name=automation_data.name.strip(),
        description=automation_data.description,
        trigger_type=automation_data.trigger_type,
        conditions=automation_data.conditions,
        action_type=automation_data.action_type,
        action_config=automation_data.action_config,
        is_active=automation_data.is_active,
        created_by=user_id,
    )

    db.add(automation)
    db.commit()
    db.refresh(automation)

    return automation


def update_automation_rule(
    db: Session,
    automation: AutomationRule,
    automation_data: AutomationRuleUpdate,
) -> AutomationRule:
    update_data = automation_data.model_dump(
        exclude_unset=True,
    )

    if "name" in update_data:
        name = update_data["name"]

        if name is not None:
            update_data["name"] = name.strip()

    for field, value in update_data.items():
        setattr(
            automation,
            field,
            value,
        )

    db.commit()
    db.refresh(automation)

    return automation


def delete_automation_rule(
    db: Session,
    automation: AutomationRule,
) -> None:
    db.delete(automation)
    db.commit()