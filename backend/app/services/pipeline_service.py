from sqlalchemy.orm import Session

from backend.app.repositories.opportunity_repository import (
    get_all_opportunities,
)


def get_pipeline(db: Session) -> dict:
    opportunities = get_all_opportunities(db)

    pipeline = {
        "prospect": [],
        "contacted": [],
        "proposal": [],
        "negotiation": [],
        "won": [],
        "lost": [],
    }

    for opportunity in opportunities:
        if opportunity.stage in pipeline:
            pipeline[opportunity.stage].append(opportunity)

    return pipeline