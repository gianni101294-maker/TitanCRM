from typing import Annotated

from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.dashboard import (
    DashboardResponse,
)
from app.services.dashboard_service import (
    get_dashboard,
)
from app.auth.permissions import AdminOrSupervisorUser

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "",
    response_model=DashboardResponse,
)
def dashboard(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AdminOrSupervisorUser,
):
    return get_dashboard(db)

