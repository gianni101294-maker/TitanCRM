from typing import Annotated

from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query
from sqlalchemy.orm import Session

from app.auth.permissions import (
    AdminOrSupervisorUser,
)
from app.database.session import get_db
from app.schemas.dashboard import (
    DashboardResponse,
)
from app.services.dashboard_service import (
    get_dashboard,
)


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
    period: str = Query(
        default="30d",
        pattern="^(7d|30d|90d|year)$",
    ),
):
    return get_dashboard(
        db,
        period,
    )
