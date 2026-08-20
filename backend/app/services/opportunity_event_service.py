from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.opportunity_event import OpportunityEvent


def create_opportunity_event(
    db: Session,
    opportunity_id: int,
    event_type: str,
    title: str,
    description: str | None = None,
    user_id: int | None = None,
    *,
    commit: bool = True,
) -> OpportunityEvent:
    event = OpportunityEvent(
        opportunity_id=opportunity_id,
        event_type=event_type,
        title=title,
        description=description,
        user_id=user_id,
    )

    db.add(event)

    if commit:
        db.commit()
        db.refresh(event)
    else:
        db.flush()

    return event


def get_opportunity_events(
    db: Session,
    opportunity_id: int,
) -> list[OpportunityEvent]:
    statement = (
        select(OpportunityEvent)
        .where(
            OpportunityEvent.opportunity_id
            == opportunity_id,
        )
        .order_by(
            OpportunityEvent.created_at.desc(),
            OpportunityEvent.id.desc(),
        )
    )

    return list(
        db.scalars(statement).all(),
    )
