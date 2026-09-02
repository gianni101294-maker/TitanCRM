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
