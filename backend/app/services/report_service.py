from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.opportunity import Opportunity
from app.models.opportunity_event import OpportunityEvent


MONTH_LABELS = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
]


def get_period_start_date(
    period: str,
) -> datetime:
    now = datetime.now().astimezone()

    if period == "year":
        return now.replace(
            month=1,
            day=1,
            hour=0,
            minute=0,
            second=0,
            microsecond=0,
        )

    days_by_period = {
        "7d": 7,
        "30d": 30,
        "90d": 90,
    }

    days = days_by_period.get(
        period,
        30,
    )

    return now - timedelta(days=days)


def get_latest_closing_events(
    db: Session,
    opportunity_ids: list[int],
) -> dict[int, OpportunityEvent]:
    if not opportunity_ids:
        return {}

    events = list(
        db.scalars(
            select(OpportunityEvent)
            .where(
                OpportunityEvent.opportunity_id.in_(
                    opportunity_ids
                ),
                OpportunityEvent.event_type
                == "stage_changed",
                OpportunityEvent.new_stage.in_(
                    ["won", "lost"]
                ),
            )
            .order_by(
                OpportunityEvent.opportunity_id.asc(),
                OpportunityEvent.created_at.desc(),
                OpportunityEvent.id.desc(),
            )
        ).all()
    )

    latest_events: dict[
        int,
        OpportunityEvent,
    ] = {}

    for event in events:
        if (
            event.opportunity_id
            not in latest_events
        ):
            latest_events[
                event.opportunity_id
            ] = event

    return latest_events


def get_closed_opportunities(
    db: Session,
    period: str,
) -> dict:
    opportunities = list(
        db.scalars(
            select(Opportunity)
            .where(
                Opportunity.stage.in_(
                    ["won", "lost"]
                )
            )
        ).all()
    )

    opportunity_ids = [
        opportunity.id
        for opportunity in opportunities
    ]

    latest_events = get_latest_closing_events(
        db,
        opportunity_ids,
    )

    start_date = get_period_start_date(
        period,
    )

    won = []
    lost = []

    for opportunity in opportunities:
        event = latest_events.get(
            opportunity.id
        )

        closing_date = (
            event.created_at
            if event is not None
            else opportunity.created_at
        )

        if closing_date < start_date:
            continue

        if opportunity.stage == "won":
            won.append(opportunity)

        elif opportunity.stage == "lost":
            lost.append(opportunity)

    return {
        "won": won,
        "lost": lost,
    }


def get_monthly_sales(
    db: Session,
    year: int,
    period: str = "year",
) -> dict:
    monthly_values = [
        0.0
        for _ in range(12)
    ]

    won_opportunities = list(
        db.scalars(
            select(Opportunity)
            .where(
                Opportunity.stage == "won"
            )
        ).all()
    )

    opportunity_ids = [
        opportunity.id
        for opportunity in won_opportunities
    ]

    latest_events = get_latest_closing_events(
        db,
        opportunity_ids,
    )

    start_date = get_period_start_date(
        period,
    )

    for opportunity in won_opportunities:
        event = latest_events.get(
            opportunity.id
        )

        sale_date = (
            event.created_at
            if event is not None
            else opportunity.created_at
        )

        if sale_date.year != year:
            continue

        if sale_date < start_date:
            continue

        month_index = sale_date.month - 1

        monthly_values[
            month_index
        ] += float(
            opportunity.value
        )

    return {
        "year": year,
        "months": [
            {
                "month": MONTH_LABELS[index],
                "value": value,
            }
            for index, value
            in enumerate(monthly_values)
        ],
    }
