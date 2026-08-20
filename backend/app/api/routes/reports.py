from datetime import datetime
from typing import Annotated

from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query
from sqlalchemy.orm import Session

from app.auth.permissions import AdminOrSupervisorUser
from app.database.session import get_db
from app.schemas.report import MonthlySalesResponse
from app.services.report_service import get_monthly_sales


router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get(
    "/monthly-sales",
    response_model=MonthlySalesResponse,
)
def monthly_sales(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AdminOrSupervisorUser,
    year: int = Query(
        default_factory=lambda: datetime.now().year,
        ge=2000,
        le=2100,
    ),
):
    return get_monthly_sales(
        db,
        year,
    )
