from pydantic import BaseModel

from app.schemas.opportunity import OpportunityResponse


class MonthlySalesItem(BaseModel):
    month: str
    value: float


class MonthlySalesResponse(BaseModel):
    year: int
    months: list[MonthlySalesItem]


class ClosedOpportunitiesResponse(BaseModel):
    won: list[OpportunityResponse]
    lost: list[OpportunityResponse]


class PeriodMetrics(BaseModel):
    won_count: int
    lost_count: int
    won_value: float
    conversion_rate: float
    average_ticket: float


class PeriodComparisonResponse(BaseModel):
    period: str
    current: PeriodMetrics
    previous: PeriodMetrics
