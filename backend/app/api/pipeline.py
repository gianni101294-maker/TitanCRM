from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.auth.dependencies import get_current_user
from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.schemas.pipeline import PipelineResponse
from backend.app.services.pipeline_service import get_pipeline

router = APIRouter(
    prefix="/pipeline",
    tags=["Pipeline"],
)


@router.get(
    "",
    response_model=PipelineResponse,
)
def get_pipeline_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_pipeline(db)