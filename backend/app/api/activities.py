from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.auth.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.schemas.activity import (
    ActivityCreate,
    ActivityResponse,
    ActivitySummaryResponse,
    ActivityUpdate,
)
from backend.app.services.activity_service import (
    create_activity,
    delete_activity,
    get_activities,
    get_activities_by_customer,
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
    status: str | None = None,
    activity_type: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_activities(
        db,
        status=status,
        activity_type=activity_type,
    )

@router.get(
    "/customer/{customer_id}",
    response_model=list[ActivityResponse],
)
def list_activities_by_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_activities_by_customer(db, customer_id)

@router.get(
    "/overdue",
    response_model=list[ActivityResponse],
)
def list_overdue_activities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_overdue_activities(db)

@router.get(
    "/upcoming",
    response_model=list[ActivityResponse],
)
def list_upcoming_activities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_upcoming_activities(db)

@router.get(
    "/summary",
    response_model=ActivitySummaryResponse,
)
def activity_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_activity_summary(db)

@router.get(
    "/{activity_id}",
    response_model=ActivityResponse,
)
def get_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    activity = get_activity_by_id(db, activity_id)

    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Actividad no encontrada",
        )

    return activity


@router.post(
    "",
    response_model=ActivityResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_activity(
    activity_data: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    activity = create_activity(db, activity_data)

    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado",
        )

    return activity


@router.patch(
    "/{activity_id}",
    response_model=ActivityResponse,
)
def update_existing_activity(
    activity_id: int,
    activity_data: ActivityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    activity = get_activity_by_id(db, activity_id)

    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Actividad no encontrada",
        )

    updated_activity = update_activity(
        db,
        activity,
        activity_data,
    )

    if updated_activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado",
        )

    return updated_activity


@router.delete(
    "/{activity_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    activity = get_activity_by_id(db, activity_id)

    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Actividad no encontrada",
        )

    delete_activity(db, activity)