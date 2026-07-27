from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.opportunity import Opportunity
from backend.app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityUpdate,
)


def get_opportunity_by_id(
    db: Session,
    opportunity_id: int,
) -> Opportunity | None:
    return db.get(Opportunity, opportunity_id)


def get_all_opportunities(
    db: Session,
) -> list[Opportunity]:
    statement = select(Opportunity).order_by(Opportunity.id)

    return list(
        db.scalars(statement).all()
    )


def get_opportunities_by_customer(
    db: Session,
    customer_id: int,
) -> list[Opportunity]:
    statement = (
        select(Opportunity)
        .where(Opportunity.customer_id == customer_id)
        .order_by(Opportunity.id)
    )

    return list(
        db.scalars(statement).all()
    )


def create_opportunity(
    db: Session,
    opportunity_data: OpportunityCreate,
) -> Opportunity:
    opportunity = Opportunity(
        title=opportunity_data.title,
        value=opportunity_data.value,
        stage=opportunity_data.stage,
        customer_id=opportunity_data.customer_id,
    )

    db.add(opportunity)
    db.commit()
    db.refresh(opportunity)

    return opportunity


def update_opportunity(
    db: Session,
    opportunity: Opportunity,
    opportunity_data: OpportunityUpdate,
) -> Opportunity:
    update_data = opportunity_data.model_dump(
        exclude_unset=True,
    )

    for field, value in update_data.items():
        setattr(opportunity, field, value)

    db.commit()
    db.refresh(opportunity)

    return opportunity


def delete_opportunity(
    db: Session,
    opportunity: Opportunity,
) -> None:
    db.delete(opportunity)
    db.commit()