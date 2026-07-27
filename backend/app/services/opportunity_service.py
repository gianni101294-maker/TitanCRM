from sqlalchemy.orm import Session

from backend.app.models.opportunity import Opportunity
from backend.app.repositories.customer_repository import get_customer_by_id
from backend.app.repositories.opportunity_repository import (
    create_opportunity,
    delete_opportunity,
    get_all_opportunities,
    get_opportunities_by_customer,
    get_opportunity_by_id,
    update_opportunity,
)
from backend.app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityUpdate,
)


def list_opportunities(
    db: Session,
) -> list[Opportunity]:
    return get_all_opportunities(db)


def list_customer_opportunities(
    db: Session,
    customer_id: int,
) -> list[Opportunity]:
    customer = get_customer_by_id(db, customer_id)

    if customer is None:
        raise ValueError("Cliente no encontrado.")

    return get_opportunities_by_customer(
        db,
        customer_id,
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
        raise ValueError("Oportunidad no encontrada.")

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
            "El cliente indicado no existe."
        )

    return create_opportunity(
        db,
        opportunity_data,
    )


def edit_opportunity(
    db: Session,
    opportunity_id: int,
    opportunity_data: OpportunityUpdate,
) -> Opportunity:
    opportunity = get_opportunity(
        db,
        opportunity_id,
    )

    if opportunity_data.customer_id is not None:
        customer = get_customer_by_id(
            db,
            opportunity_data.customer_id,
        )

        if customer is None:
            raise ValueError(
                "El cliente indicado no existe."
            )

    return update_opportunity(
        db,
        opportunity,
        opportunity_data,
    )


def remove_opportunity(
    db: Session,
    opportunity_id: int,
) -> None:
    opportunity = get_opportunity(
        db,
        opportunity_id,
    )

    delete_opportunity(
        db,
        opportunity,
    )