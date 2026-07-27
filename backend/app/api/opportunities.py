from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from backend.app.auth.dependencies import get_current_user
from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityResponse,
    OpportunityUpdate,
)
from backend.app.services.opportunity_service import (
    edit_opportunity,
    get_opportunity,
    list_customer_opportunities,
    list_opportunities,
    register_opportunity,
    remove_opportunity,
)


router = APIRouter(
    prefix="/opportunities",
    tags=["Opportunities"],
)


@router.post(
    "",
    response_model=OpportunityResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_opportunity_endpoint(
    opportunity_data: OpportunityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return register_opportunity(
            db,
            opportunity_data,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error


@router.get(
    "",
    response_model=list[OpportunityResponse],
)
def list_opportunities_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_opportunities(db)


@router.get(
    "/customer/{customer_id}",
    response_model=list[OpportunityResponse],
)
def list_customer_opportunities_endpoint(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return list_customer_opportunities(
            db,
            customer_id,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.get(
    "/{opportunity_id}",
    response_model=OpportunityResponse,
)
def get_opportunity_endpoint(
    opportunity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return get_opportunity(
            db,
            opportunity_id,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.patch(
    "/{opportunity_id}",
    response_model=OpportunityResponse,
)
def update_opportunity_endpoint(
    opportunity_id: int,
    opportunity_data: OpportunityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return edit_opportunity(
            db,
            opportunity_id,
            opportunity_data,
        )
    except ValueError as error:
        message = str(error)

        if message == "Oportunidad no encontrada.":
            status_code = status.HTTP_404_NOT_FOUND
        else:
            status_code = status.HTTP_400_BAD_REQUEST

        raise HTTPException(
            status_code=status_code,
            detail=message,
        ) from error


@router.delete(
    "/{opportunity_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_opportunity_endpoint(
    opportunity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        remove_opportunity(
            db,
            opportunity_id,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )