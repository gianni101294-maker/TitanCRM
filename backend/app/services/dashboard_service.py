from datetime import datetime
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.activity import Activity
from app.models.customer import Customer
from app.models.opportunity import Opportunity
from app.services.report_service import (
    get_latest_closing_events,
    get_period_start_date,
)


PIPELINE_STAGES = (
    "prospect",
    "contacted",
    "proposal",
    "negotiation",
    "won",
    "lost",
)


def get_dashboard(
    db: Session,
    period: str = "30d",
) -> dict:
    now = datetime.now().astimezone()

    start_date = get_period_start_date(
        period,
    )

    customers = list(
        db.scalars(
            select(Customer),
        ).all(),
    )

    opportunities = list(
        db.scalars(
            select(Opportunity),
        ).all(),
    )

    activities = list(
        db.scalars(
            select(Activity),
        ).all(),
    )

    closed_opportunities = [
        opportunity
        for opportunity in opportunities
        if opportunity.stage in ("won", "lost")
    ]

    closed_ids = [
        opportunity.id
        for opportunity in closed_opportunities
    ]

    latest_closing_events = (
        get_latest_closing_events(
            db,
            closed_ids,
        )
    )

    dashboard = {
        "period": period,
        "total_customers": 0,
        "total_opportunities": 0,
        "total_pipeline_value": Decimal("0"),
        "won_value": Decimal("0"),
        "lost_value": Decimal("0"),
        "opportunities_by_stage": {
            stage: 0
            for stage in PIPELINE_STAGES
        },
        "pending_activities": 0,
        "overdue_activities": 0,
        "upcoming_activities": 0,
    }

    for customer in customers:
        created_at = customer.created_at

        if created_at.tzinfo is None:
            created_at = created_at.astimezone()

        if created_at >= start_date:
            dashboard[
                "total_customers"
            ] += 1

    for opportunity in opportunities:
        stage = opportunity.stage

        if stage in ("won", "lost"):
            event = latest_closing_events.get(
                opportunity.id,
            )

            reference_date = (
                event.created_at
                if event is not None
                else opportunity.created_at
            )
        else:
            reference_date = (
                opportunity.created_at
            )

        if reference_date < start_date:
            continue

        dashboard[
            "total_opportunities"
        ] += 1

        if (
            stage
            in dashboard[
                "opportunities_by_stage"
            ]
        ):
            dashboard[
                "opportunities_by_stage"
            ][stage] += 1

        if stage == "won":
            dashboard[
                "won_value"
            ] += opportunity.value

        elif stage == "lost":
            dashboard[
                "lost_value"
            ] += opportunity.value

        else:
            dashboard[
                "total_pipeline_value"
            ] += opportunity.value

    for activity in activities:
        if activity.scheduled_at < start_date:
            continue

        if activity.scheduled_at > now:
            dashboard[
                "upcoming_activities"
            ] += 1

        if activity.status == "pending":
            dashboard[
                "pending_activities"
            ] += 1

            if activity.scheduled_at < now:
                dashboard[
                    "overdue_activities"
                ] += 1

    return dashboard
