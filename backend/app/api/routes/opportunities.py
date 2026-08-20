from typing import Annotated

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Response
from fastapi import status
from sqlalchemy.orm import Session

from app.auth.permissions import AdminUser
from app.auth.permissions import AuthenticatedCommercialUser
from app.database.session import get_db
from app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityResponse,
    OpportunityUpdate,
)
from app.services.opportunity_service import (
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


@router.get(
    "",
    response_model=list[OpportunityResponse],
)
def get_all_opportunities(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
):
    return list_opportunities(db)


@router.get(
    "/{opportunity_id}",
    response_model=OpportunityResponse,
)
def get_one_opportunity(
    opportunity_id: int,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
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


@router.get(
    "/customer/{customer_id}",
    response_model=list[OpportunityResponse],
)
def get_by_customer(
    customer_id: int,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
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


@router.post(
    "",
    response_model=OpportunityResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_opportunity(
    payload: OpportunityCreate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
):
    try:
        return register_opportunity(
            db,
            payload,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error


@router.put(
    "/{opportunity_id}",
    response_model=OpportunityResponse,
)
def update_existing_opportunity(
    opportunity_id: int,
    payload: OpportunityUpdate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
):
    try:
        return edit_opportunity(
            db,
            opportunity_id,
            payload,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.delete(
    "/{opportunity_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_opportunity(
    opportunity_id: int,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AdminUser,
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