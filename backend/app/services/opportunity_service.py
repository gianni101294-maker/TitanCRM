from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.opportunity import Opportunity
from app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityUpdate,
)


def get_opportunity_by_id(
    db: Session,
    opportunity_id: int,
) -> Opportunity | None:
    statement = select(Opportunity).where(
        Opportunity.id == opportunity_id,
    )

    return db.scalar(statement)


def get_customer_by_id(
    db: Session,
    customer_id: int,
) -> Customer | None:
    statement = select(Customer).where(
        Customer.id == customer_id,
    )

    return db.scalar(statement)


def list_opportunities(
    db: Session,
) -> list[Opportunity]:
    statement = select(
        Opportunity,
    ).order_by(
        Opportunity.id.desc(),
    )

    return list(
        db.scalars(statement).all(),
    )


def list_customer_opportunities(
    db: Session,
    customer_id: int,
) -> list[Opportunity]:
    customer = get_customer_by_id(
        db,
        customer_id,
    )

    if customer is None:
        raise ValueError(
            "Cliente no encontrado.",
        )

    statement = (
        select(Opportunity)
        .where(
            Opportunity.customer_id
            == customer_id,
        )
        .order_by(
            Opportunity.id.desc(),
        )
    )

    return list(
        db.scalars(statement).all(),
    )


def get_opportunity(
    db: Session,
    opportunity_id: int,
) -> Opportunity:
    opportunity = get_opportunity_by_id(
        db,
        opportunity_id,
    )

    if opportunity is None:
        raise ValueError(
            "Oportunidad no encontrada.",
        )

    return opportunity


def register_opportunity(
    db: Session,
    opportunity_data: OpportunityCreate,
) -> Opportunity:
    customer = get_customer_by_id(
        db,
        opportunity_data.customer_id,
    )

    if customer is None:
        raise ValueError(
            "El cliente indicado no existe.",
        )

    opportunity = Opportunity(
        title=opportunity_data.title.strip(),
        value=opportunity_data.value,
        stage=opportunity_data.stage,
        priority=opportunity_data.priority,
        probability=opportunity_data.probability,
        expected_close_date=(
            opportunity_data.expected_close_date
        ),
        notes=opportunity_data.notes,
        assigned_user_id=(
            opportunity_data.assigned_user_id
        ),
        customer_id=opportunity_data.customer_id,
    )

    db.add(opportunity)
    db.commit()
    db.refresh(opportunity)

    return opportunity


def edit_opportunity(
    db: Session,
    opportunity_id: int,
    opportunity_data: OpportunityUpdate,
) -> Opportunity:
    opportunity = get_opportunity(
        db,
        opportunity_id,
    )

    update_data = opportunity_data.model_dump(
        exclude_unset=True,
    )

    if "customer_id" in update_data:
        customer = get_customer_by_id(
            db,
            update_data["customer_id"],
        )

        if customer is None:
            raise ValueError(
                "El cliente indicado no existe.",
            )

    if (
        "title" in update_data
        and update_data["title"] is not None
    ):
        update_data["title"] = (
            update_data["title"].strip()
        )

    for field, value in update_data.items():
        setattr(
            opportunity,
            field,
            value,
        )

    db.commit()
    db.refresh(opportunity)

    return opportunity


def remove_opportunity(
    db: Session,
    opportunity_id: int,
) -> None:
    opportunity = get_opportunity(
        db,
        opportunity_id,
    )

    db.delete(opportunity)
    db.commit()