from datetime import datetime
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.activity import Activity
from app.models.customer import Customer
from app.models.opportunity import Opportunity
from app.services.report_service import (
    get_latest_closing_events,
    get_period_date_ranges,
)


PIPELINE_STAGES = (
    "prospect",
    "contacted",
    "proposal",
    "negotiation",
    "won",
    "lost",
)


def _local_datetime(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.astimezone()

    return value


def _calculate_comparison_metrics(
    customers: list[Customer],
    opportunities: list[Opportunity],
    activities: list[Activity],
    latest_closing_events: dict,
    start_date: datetime,
    end_date: datetime,
) -> dict:
    total_customers = 0
    total_opportunities = 0
    pending_activities = 0
    won_count = 0
    lost_count = 0

    for customer in customers:
        created_at = _local_datetime(
            customer.created_at,
        )

        if start_date <= created_at < end_date:
            total_customers += 1

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

        reference_date = _local_datetime(
            reference_date,
        )

        if not (
            start_date
            <= reference_date
            < end_date
        ):
            continue

        total_opportunities += 1

        if stage == "won":
            won_count += 1
        elif stage == "lost":
            lost_count += 1

    for activity in activities:
        scheduled_at = _local_datetime(
            activity.scheduled_at,
        )

        if (
            start_date
            <= scheduled_at
            < end_date
            and activity.status == "pending"
        ):
            pending_activities += 1

    closed_count = (
        won_count +
        lost_count
    )

    conversion_rate = (
        (won_count / closed_count) * 100
        if closed_count > 0
        else 0.0
    )

    return {
        "total_customers": total_customers,
        "total_opportunities": total_opportunities,
        "pending_activities": pending_activities,
        "won_count": won_count,
        "lost_count": lost_count,
        "conversion_rate": conversion_rate,
    }


def get_dashboard(
    db: Session,
    period: str = "30d",
) -> dict:
    now = datetime.now().astimezone()

    (
        current_start,
        current_end,
        previous_start,
        previous_end,
    ) = get_period_date_ranges(
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
        created_at = _local_datetime(
            customer.created_at,
        )

        if (
            current_start
            <= created_at
            < current_end
        ):
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

        reference_date = _local_datetime(
            reference_date,
        )

        if not (
            current_start
            <= reference_date
            < current_end
        ):
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
        scheduled_at = _local_datetime(
            activity.scheduled_at,
        )

        if not (
            current_start
            <= scheduled_at
            < current_end
        ):
            continue

        if activity.status != "pending":
            continue

        dashboard[
            "pending_activities"
        ] += 1

        if scheduled_at.date() < now.date():
            dashboard[
                "overdue_activities"
            ] += 1

        elif scheduled_at.date() > now.date():
            dashboard[
                "upcoming_activities"
            ] += 1

    current_metrics = (
        _calculate_comparison_metrics(
            customers,
            opportunities,
            activities,
            latest_closing_events,
            current_start,
            current_end,
        )
    )

    previous_metrics = (
        _calculate_comparison_metrics(
            customers,
            opportunities,
            activities,
            latest_closing_events,
            previous_start,
            previous_end,
        )
    )

    dashboard["comparison"] = {
        "current": current_metrics,
        "previous": previous_metrics,
    }

    return dashboard
