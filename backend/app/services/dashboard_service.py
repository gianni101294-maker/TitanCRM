from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.activity import Activity
from app.models.customer import Customer
from app.models.opportunity import Opportunity


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
) -> dict:
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

    dashboard = {
        "total_customers": len(customers),
        "total_opportunities": len(opportunities),
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

    for opportunity in opportunities:
        dashboard[
            "total_pipeline_value"
        ] += opportunity.value

        stage = opportunity.stage

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

        if stage == "lost":
            dashboard[
                "lost_value"
            ] += opportunity.value

    for activity in activities:
        if activity.status == "pending":
            dashboard[
                "pending_activities"
            ] += 1

    return dashboard