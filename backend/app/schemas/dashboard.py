from decimal import Decimal

from pydantic import BaseModel


class OpportunitiesByStage(BaseModel):
    prospect: int
    contacted: int
    proposal: int
    negotiation: int
    won: int
    lost: int


class DashboardComparisonMetrics(BaseModel):
    total_customers: int
    total_opportunities: int
    pending_activities: int
    won_count: int
    lost_count: int
    conversion_rate: float


class DashboardComparison(BaseModel):
    current: DashboardComparisonMetrics
    previous: DashboardComparisonMetrics


class DashboardResponse(BaseModel):
    period: str
    total_customers: int
    total_opportunities: int
    total_pipeline_value: Decimal
    won_value: Decimal
    lost_value: Decimal
    opportunities_by_stage: OpportunitiesByStage
    pending_activities: int
    overdue_activities: int
    upcoming_activities: int
    comparison: DashboardComparison
