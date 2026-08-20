from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.opportunity import Opportunity
from app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityUpdate,
)

from app.services.opportunity_event_service import (
    create_opportunity_event,
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
    user_id: int | None = None,
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
    db.flush()

    create_opportunity_event(
        db=db,
        opportunity_id=opportunity.id,
        event_type="created",
        title="Oportunidad creada",
        description=(
            f"Se creó la oportunidad "
            f"«{opportunity.title}»."
        ),
        user_id=user_id,
        commit=False,
    )

    db.commit()
    db.refresh(opportunity)

    return opportunity


def edit_opportunity(
    db: Session,
    opportunity_id: int,
    opportunity_data: OpportunityUpdate,
    user_id: int | None = None,
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

    tracked_fields = {
        "stage": (
            "stage_changed",
            "Etapa modificada",
            "Etapa",
        ),
        "probability": (
            "probability_changed",
            "Probabilidad modificada",
            "Probabilidad",
        ),
        "value": (
            "value_changed",
            "Valor modificado",
            "Valor",
        ),
        "priority": (
            "priority_changed",
            "Prioridad modificada",
            "Prioridad",
        ),
        "assigned_user_id": (
            "assignee_changed",
            "Responsable modificado",
            "Responsable",
        ),
    }

    changes = []

    for field, value in update_data.items():
        old_value = getattr(
            opportunity,
            field,
        )

        if old_value != value:
            changes.append(
                (
                    field,
                    old_value,
                    value,
                )
            )

        setattr(
            opportunity,
            field,
            value,
        )

    db.flush()

    for field, old_value, new_value in changes:
        event_config = tracked_fields.get(
            field
        )

        if event_config is None:
            continue

        (
            event_type,
            event_title,
            field_label,
        ) = event_config

        if field == "probability":
            old_display = (
                f"{old_value}%"
                if old_value is not None
                else "Sin definir"
            )
            new_display = (
                f"{new_value}%"
                if new_value is not None
                else "Sin definir"
            )

        elif field == "value":
            old_display = (
                f"S/ {old_value:,.2f}"
                if old_value is not None
                else "Sin definir"
            )
            new_display = (
                f"S/ {new_value:,.2f}"
                if new_value is not None
                else "Sin definir"
            )

        elif field == "stage":
            stage_labels = {
                "prospect": "Prospecto",
                "contacted": "Contactado",
                "proposal": "Propuesta",
                "negotiation": "Negociación",
                "won": "Ganada",
                "lost": "Perdida",
            }

            old_display = (
                stage_labels.get(
                    str(old_value),
                    str(old_value),
                )
                if old_value is not None
                else "Sin definir"
            )

            new_display = (
                stage_labels.get(
                    str(new_value),
                    str(new_value),
                )
                if new_value is not None
                else "Sin definir"
            )

        elif field == "priority":
            priority_labels = {
                "low": "Baja",
                "medium": "Media",
                "high": "Alta",
            }

            old_display = (
                priority_labels.get(
                    str(old_value),
                    str(old_value),
                )
                if old_value is not None
                else "Sin definir"
            )

            new_display = (
                priority_labels.get(
                    str(new_value),
                    str(new_value),
                )
                if new_value is not None
                else "Sin definir"
            )

        else:
            old_display = (
                str(old_value)
                if old_value is not None
                else "Sin definir"
            )
            new_display = (
                str(new_value)
                if new_value is not None
                else "Sin definir"
            )

        create_opportunity_event(
            db=db,
            opportunity_id=opportunity.id,
            event_type=event_type,
            title=event_title,
            description=(
                f"{field_label}: "
                f"{old_display} → "
                f"{new_display}"
            ),
            user_id=user_id,
            commit=False,
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