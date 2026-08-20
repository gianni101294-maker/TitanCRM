from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.activity import Activity
from app.models.customer import Customer
from app.models.opportunity import Opportunity
from app.schemas.activity import (
    ActivityCreate,
    ActivityUpdate,
)


def get_activity_by_id(
    db: Session,
    activity_id: int,
) -> Activity | None:
    statement = select(Activity).where(
        Activity.id == activity_id,
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


def get_opportunity_by_id(
    db: Session,
    opportunity_id: int,
) -> Opportunity | None:
    statement = select(Opportunity).where(
        Opportunity.id == opportunity_id,
    )
    return db.scalar(statement)


def validate_opportunity_for_customer(
    db: Session,
    opportunity_id: int | None,
    customer_id: int,
) -> None:
    if opportunity_id is None:
        return

    opportunity = get_opportunity_by_id(
        db,
        opportunity_id,
    )

    if opportunity is None:
        raise ValueError(
            "La oportunidad indicada no existe.",
        )

    if opportunity.customer_id != customer_id:
        raise ValueError(
            "La oportunidad seleccionada no pertenece al cliente indicado.",
        )


def get_activities(
    db: Session,
    status: str | None = None,
    activity_type: str | None = None,
) -> list[Activity]:
    statement = select(Activity)

    if status is not None:
        statement = statement.where(
            Activity.status == status,
        )

    if activity_type is not None:
        statement = statement.where(
            Activity.activity_type == activity_type,
        )

    statement = statement.order_by(
        Activity.scheduled_at.asc(),
    )

    return list(
        db.scalars(statement).all(),
    )


def get_activities_by_customer(
    db: Session,
    customer_id: int,
) -> list[Activity]:
    customer = get_customer_by_id(
        db,
        customer_id,
    )

    if customer is None:
        raise ValueError(
            "Cliente no encontrado.",
        )

    statement = (
        select(Activity)
        .where(
            Activity.customer_id == customer_id,
        )
        .order_by(
            Activity.scheduled_at.asc(),
        )
    )

    return list(
        db.scalars(statement).all(),
    )


def get_activities_by_opportunity(
    db: Session,
    opportunity_id: int,
) -> list[Activity]:
    opportunity = get_opportunity_by_id(
        db,
        opportunity_id,
    )

    if opportunity is None:
        raise ValueError(
            "Oportunidad no encontrada.",
        )

    statement = (
        select(Activity)
        .where(
            Activity.opportunity_id == opportunity_id,
        )
        .order_by(
            Activity.scheduled_at.asc(),
        )
    )

    return list(
        db.scalars(statement).all(),
    )


def get_overdue_activities(
    db: Session,
) -> list[Activity]:
    now = datetime.now(UTC)

    statement = (
        select(Activity)
        .where(
            Activity.scheduled_at < now,
            Activity.status == "pending",
        )
        .order_by(
            Activity.scheduled_at.asc(),
        )
    )

    return list(
        db.scalars(statement).all(),
    )


def get_upcoming_activities(
    db: Session,
) -> list[Activity]:
    now = datetime.now(UTC)

    statement = (
        select(Activity)
        .where(
            Activity.scheduled_at >= now,
            Activity.status == "pending",
        )
        .order_by(
            Activity.scheduled_at.asc(),
        )
    )

    return list(
        db.scalars(statement).all(),
    )


def get_activity_summary(
    db: Session,
) -> dict[str, int]:
    activities = get_activities(db)
    now = datetime.now(UTC)

    pending = sum(
        1
        for activity in activities
        if activity.status == "pending"
    )

    completed = sum(
        1
        for activity in activities
        if activity.status == "completed"
    )

    overdue = sum(
        1
        for activity in activities
        if (
            activity.status == "pending"
            and activity.scheduled_at < now
        )
    )

    upcoming = sum(
        1
        for activity in activities
        if (
            activity.status == "pending"
            and activity.scheduled_at >= now
        )
    )

    return {
        "total": len(activities),
        "pending": pending,
        "completed": completed,
        "overdue": overdue,
        "upcoming": upcoming,
    }


def create_activity(
    db: Session,
    activity_data: ActivityCreate,
) -> Activity:
    customer = get_customer_by_id(
        db,
        activity_data.customer_id,
    )

    if customer is None:
        raise ValueError(
            "El cliente indicado no existe.",
        )

    validate_opportunity_for_customer(
        db,
        activity_data.opportunity_id,
        activity_data.customer_id,
    )

    activity = Activity(
        title=activity_data.title.strip(),
        activity_type=activity_data.activity_type,
        description=activity_data.description,
        scheduled_at=activity_data.scheduled_at,
        status=activity_data.status,
        customer_id=activity_data.customer_id,
        opportunity_id=activity_data.opportunity_id,
    )

    db.add(activity)
    db.commit()
    db.refresh(activity)

    return activity


def update_activity(
    db: Session,
    activity: Activity,
    activity_data: ActivityUpdate,
) -> Activity:
    update_data = activity_data.model_dump(
        exclude_unset=True,
    )

    target_customer_id = update_data.get(
        "customer_id",
        activity.customer_id,
    )

    customer = get_customer_by_id(
        db,
        target_customer_id,
    )

    if customer is None:
        raise ValueError(
            "El cliente indicado no existe.",
        )

    target_opportunity_id = update_data.get(
        "opportunity_id",
        activity.opportunity_id,
    )

    validate_opportunity_for_customer(
        db,
        target_opportunity_id,
        target_customer_id,
    )

    if "title" in update_data:
        update_data["title"] = (
            update_data["title"].strip()
        )

    for field, value in update_data.items():
        setattr(
            activity,
            field,
            value,
        )

    db.commit()
    db.refresh(activity)

    return activity


def delete_activity(
    db: Session,
    activity: Activity,
) -> None:
    db.delete(activity)
    db.commit()
