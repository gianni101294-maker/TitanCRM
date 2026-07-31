from datetime import UTC, datetime

from sqlalchemy.orm import Session

from backend.app.models.activity import Activity
from backend.app.models.customer import Customer
from backend.app.schemas.activity import ActivityCreate, ActivityUpdate


def get_activities(
    db: Session,
    status: str | None = None,
    activity_type: str | None = None,
) -> list[Activity]:
    query = db.query(Activity)

    if status is not None:
        query = query.filter(Activity.status == status)

    if activity_type is not None:
        query = query.filter(
            Activity.activity_type == activity_type
        )

    return query.order_by(Activity.scheduled_at.asc()).all()

def get_activities_by_customer(
    db: Session,
    customer_id: int,
) -> list[Activity]:
    return (
        db.query(Activity)
        .filter(Activity.customer_id == customer_id)
        .order_by(Activity.scheduled_at.asc())
        .all()
    )
def get_overdue_activities(
    db: Session,
) -> list[Activity]:
    now = datetime.now(UTC)

    return (
        db.query(Activity)
        .filter(Activity.scheduled_at < now)
        .filter(Activity.status == "pending")
        .order_by(Activity.scheduled_at.asc())
        .all()
    )
def get_upcoming_activities(
    db: Session,
) -> list[Activity]:
    now = datetime.now(UTC)

    return (
        db.query(Activity)
        .filter(Activity.scheduled_at >= now)
        .filter(Activity.status == "pending")
        .order_by(Activity.scheduled_at.asc())
        .all()
    )
def get_activity_summary(
    db: Session,
) -> dict:
    now = datetime.now(UTC)

    total = db.query(Activity).count()

    pending = (
        db.query(Activity)
        .filter(Activity.status == "pending")
        .count()
    )

    completed = (
        db.query(Activity)
        .filter(Activity.status == "completed")
        .count()
    )

    overdue = (
        db.query(Activity)
        .filter(Activity.scheduled_at < now)
        .filter(Activity.status == "pending")
        .count()
    )

    upcoming = (
        db.query(Activity)
        .filter(Activity.scheduled_at >= now)
        .filter(Activity.status == "pending")
        .count()
    )

    return {
        "total": total,
        "pending": pending,
        "completed": completed,
        "overdue": overdue,
        "upcoming": upcoming,
    }

def get_activity_by_id(
    db: Session,
    activity_id: int,
) -> Activity | None:
    return (
        db.query(Activity)
        .filter(Activity.id == activity_id)
        .first()
    )


def create_activity(
    db: Session,
    activity_data: ActivityCreate,
) -> Activity | None:
    customer = (
        db.query(Customer)
        .filter(Customer.id == activity_data.customer_id)
        .first()
    )

    if customer is None:
        return None

    activity = Activity(**activity_data.model_dump())

    db.add(activity)
    db.commit()
    db.refresh(activity)

    return activity


def update_activity(
    db: Session,
    activity: Activity,
    activity_data: ActivityUpdate,
) -> Activity | None:
    update_data = activity_data.model_dump(exclude_unset=True)

    if "customer_id" in update_data:
        customer = (
            db.query(Customer)
            .filter(Customer.id == update_data["customer_id"])
            .first()
        )

        if customer is None:
            return None

    for field, value in update_data.items():
        setattr(activity, field, value)

    db.commit()
    db.refresh(activity)

    return activity


def delete_activity(
    db: Session,
    activity: Activity,
) -> None:
    db.delete(activity)
    db.commit()