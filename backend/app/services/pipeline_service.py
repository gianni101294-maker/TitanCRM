from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.opportunity import Opportunity


PIPELINE_STAGES = (
    "prospect",
    "contacted",
    "proposal",
    "negotiation",
    "won",
    "lost",
)


def get_pipeline(
    db: Session,
) -> dict[str, list[Opportunity]]:
    statement = select(
        Opportunity,
    ).order_by(
        Opportunity.id.desc(),
    )

    opportunities = list(
        db.scalars(statement).all(),
    )

    pipeline: dict[
        str,
        list[Opportunity],
    ] = {
        stage: []
        for stage in PIPELINE_STAGES
    }

    for opportunity in opportunities:
        if opportunity.stage in pipeline:
            pipeline[
                opportunity.stage
            ].append(opportunity)

    return pipeline