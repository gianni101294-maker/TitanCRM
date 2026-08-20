from typing import Annotated

from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import CurrentUser
from app.database.session import get_db
from app.schemas.opportunity import OpportunityResponse
from app.services.pipeline_service import get_pipeline


router = APIRouter(
    prefix="/pipeline",
    tags=["Pipeline"],
)


@router.get(
    "",
    response_model=dict[
        str,
        list[OpportunityResponse],
    ],
    
)
def pipeline(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: CurrentUser,
):
    return get_pipeline(db)