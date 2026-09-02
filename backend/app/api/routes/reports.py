from datetime import datetime
from typing import Annotated

from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query
from sqlalchemy.orm import Session

from app.auth.permissions import AdminOrSupervisorUser
from app.database.session import get_db
from app.schemas.report import (
    ClosedOpportunitiesResponse,
    MonthlySalesResponse,
    PeriodComparisonResponse,
)
from app.services.report_service import (
    get_closed_opportunities,
    get_monthly_sales,
    get_period_comparison,
)


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
    period: str = Query(
        default="year",
        pattern="^(7d|30d|90d|year)$",
    ),
):
    return get_monthly_sales(
        db,
        year,
        period,
    )


@router.get(
    "/closed-opportunities",
    response_model=ClosedOpportunitiesResponse,
)
def closed_opportunities(
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
    return get_closed_opportunities(
        db,
        period,
    )


@router.get(
    "/period-comparison",
    response_model=PeriodComparisonResponse,
)
def period_comparison(
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
    return get_period_comparison(
        db,
        period,
    )
