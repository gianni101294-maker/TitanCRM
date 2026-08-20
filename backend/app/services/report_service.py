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


def get_monthly_sales(
    db: Session,
    year: int,
) -> dict:
    won_opportunities = list(
        db.scalars(
            select(Opportunity)
            .where(
                Opportunity.stage == "won"
            )
        ).all()
    )

    monthly_values = [
        0.0
        for _ in range(12)
    ]

    if not won_opportunities:
        return {
            "year": year,
            "months": [
                {
                    "month": label,
                    "value": 0.0,
                }
                for label in MONTH_LABELS
            ],
        }

    opportunity_ids = [
        opportunity.id
        for opportunity in won_opportunities
    ]

    won_events = list(
        db.scalars(
            select(OpportunityEvent)
            .where(
                OpportunityEvent.opportunity_id.in_(
                    opportunity_ids
                ),
                OpportunityEvent.event_type
                == "stage_changed",
                OpportunityEvent.new_stage
                == "won",
            )
            .order_by(
                OpportunityEvent.opportunity_id.asc(),
                OpportunityEvent.created_at.desc(),
                OpportunityEvent.id.desc(),
            )
        ).all()
    )

    latest_won_event_by_opportunity = {}

    for event in won_events:
        if (
            event.opportunity_id
            not in latest_won_event_by_opportunity
        ):
            latest_won_event_by_opportunity[
                event.opportunity_id
            ] = event

    for opportunity in won_opportunities:
        won_event = (
            latest_won_event_by_opportunity.get(
                opportunity.id
            )
        )

        sale_date = (
            won_event.created_at
            if won_event is not None
            else opportunity.created_at
        )

        if sale_date.year != year:
            continue

        month_index = sale_date.month - 1

        monthly_values[month_index] += float(
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
