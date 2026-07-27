from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.auth.dependencies import get_current_user
from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.schemas.dashboard import DashboardResponse
from backend.app.services.dashboard import get_dashboard


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "",
    response_model=DashboardResponse,
)
def get_dashboard_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_dashboard(db)