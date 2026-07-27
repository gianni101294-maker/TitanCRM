from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from backend.app.auth.dependencies import get_current_user
from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.schemas.customer import (
    CustomerCreate,
    CustomerResponse,
    CustomerUpdate,
)
from backend.app.services.customer_service import (
    edit_customer,
    get_customer,
    list_customers,
    register_customer,
    remove_customer,
)


router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


@router.post(
    "",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_customer_endpoint(
    customer_data: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return register_customer(db, customer_data)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error


@router.get(
    "",
    response_model=list[CustomerResponse],
)
def list_customers_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_customers(db)


@router.get(
    "/{customer_id}",
    response_model=CustomerResponse,
)
def get_customer_endpoint(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return get_customer(db, customer_id)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.patch(
    "/{customer_id}",
    response_model=CustomerResponse,
)
def update_customer_endpoint(
    customer_id: int,
    customer_data: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return edit_customer(
            db,
            customer_id,
            customer_data,
        )
    except ValueError as error:
        message = str(error)

        if message == "Cliente no encontrado.":
            status_code = status.HTTP_404_NOT_FOUND
        else:
            status_code = status.HTTP_400_BAD_REQUEST

        raise HTTPException(
            status_code=status_code,
            detail=message,
        ) from error


@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_customer_endpoint(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        remove_customer(db, customer_id)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(status_code=status.HTTP_204_NO_CONTENT)