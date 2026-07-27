from pydantic import BaseModel

from backend.app.schemas.opportunity import OpportunityResponse


class PipelineResponse(BaseModel):
    prospect: list[OpportunityResponse]
    contacted: list[OpportunityResponse]
    proposal: list[OpportunityResponse]
    negotiation: list[OpportunityResponse]
    won: list[OpportunityResponse]
    lost: list[OpportunityResponse]