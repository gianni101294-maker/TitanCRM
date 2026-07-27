from decimal import Decimal

from pydantic import BaseModel


class OpportunitiesByStage(BaseModel):
    prospect: int
    contacted: int
    proposal: int
    negotiation: int
    won: int
    lost: int


class DashboardResponse(BaseModel):
    total_customers: int
    total_opportunities: int
    total_pipeline_value: Decimal
    won_value: Decimal
    lost_value: Decimal
    opportunities_by_stage: OpportunitiesByStage
    pending_activities: int
    overdue_activities: int
    upcoming_activities: int