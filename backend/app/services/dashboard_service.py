from decimal import Decimal

from sqlalchemy.orm import Session

from backend.app.repositories.customer_repository import get_all_customers
from backend.app.repositories.opportunity_repository import get_all_opportunities


def get_dashboard(db: Session) -> dict:
    customers = get_all_customers(db)
    opportunities = get_all_opportunities(db)

    dashboard = {
        "total_customers": len(customers),
        "total_opportunities": len(opportunities),
        "total_pipeline_value": Decimal("0"),
        "won_value": Decimal("0"),
        "lost_value": Decimal("0"),
        "opportunities_by_stage": {
            "prospect": 0,
            "contacted": 0,
            "proposal": 0,
            "negotiation": 0,
            "won": 0,
            "lost": 0,
        },
    }

    for opportunity in opportunities:
        dashboard["total_pipeline_value"] += opportunity.value

        stage = opportunity.stage

        if stage in dashboard["opportunities_by_stage"]:
            dashboard["opportunities_by_stage"][stage] += 1

        if stage == "won":
            dashboard["won_value"] += opportunity.value

        if stage == "lost":
            dashboard["lost_value"] += opportunity.value

    return dashboard