from typing import Annotated

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Query
from fastapi import Response
from fastapi import status
from sqlalchemy.orm import Session

from app.auth.permissions import AdminUser
from app.auth.permissions import AuthenticatedCommercialUser
from app.database.session import get_db
from app.schemas.activity import (
    ActivityCreate,
    ActivityResponse,
    ActivitySummaryResponse,
    ActivityUpdate,
)
from app.services.activity_service import (
    create_activity,
    delete_activity,
    get_activities,
    get_activities_by_customer,
    get_activities_by_opportunity,
    get_activity_by_id,
    get_activity_summary,
    get_overdue_activities,
    get_upcoming_activities,
    update_activity,
)


router = APIRouter(
    prefix="/activities",
    tags=["Activities"],
)


@router.get(
    "",
    response_model=list[ActivityResponse],
)
def list_activities(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
    status_filter: str | None = Query(
        default=None,
        alias="status",
    ),
    activity_type: str | None = Query(
        default=None,
    ),
):
    return get_activities(
        db,
        status=status_filter,
        activity_type=activity_type,
    )


@router.get(
    "/summary",
    response_model=ActivitySummaryResponse,
)
def activity_summary(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
):
    return get_activity_summary(db)


@router.get(
    "/overdue",
    response_model=list[ActivityResponse],
)
def overdue_activities(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
):
    return get_overdue_activities(db)


@router.get(
    "/upcoming",
    response_model=list[ActivityResponse],
)
def upcoming_activities(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
):
    return get_upcoming_activities(db)


@router.get(
    "/customer/{customer_id}",
    response_model=list[ActivityResponse],
)
def customer_activities(
    customer_id: int,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
):
    try:
        return get_activities_by_customer(
            db,
            customer_id,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.get(
    "/opportunity/{opportunity_id}",
    response_model=list[ActivityResponse],
)
def opportunity_activities(
    opportunity_id: int,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
):
    try:
        return get_activities_by_opportunity(
            db,
            opportunity_id,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.get(
    "/{activity_id}",
    response_model=ActivityResponse,
)
def get_activity(
    activity_id: int,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
):
    activity = get_activity_by_id(
        db,
        activity_id,
    )

    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Actividad no encontrada.",
        )

    return activity


@router.post(
    "",
    response_model=ActivityResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_activity(
    payload: ActivityCreate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
):
    try:
        return create_activity(
            db,
            payload,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error


@router.put(
    "/{activity_id}",
    response_model=ActivityResponse,
)
def edit_activity(
    activity_id: int,
    payload: ActivityUpdate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
):
    activity = get_activity_by_id(
        db,
        activity_id,
    )

    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Actividad no encontrada.",
        )

    try:
        return update_activity(
            db,
            activity,
            payload,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error


@router.delete(
    "/{activity_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_activity(
    activity_id: int,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AdminUser,
):
    activity = get_activity_by_id(
        db,
        activity_id,
    )

    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Actividad no encontrada.",
        )

    delete_activity(
        db,
        activity,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )