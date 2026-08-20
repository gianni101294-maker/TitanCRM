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
from app.schemas.customer import CustomerCreate
from app.schemas.customer import CustomerResponse
from app.schemas.customer import CustomerUpdate
from app.services.customer_service import create_customer
from app.services.customer_service import delete_customer
from app.services.customer_service import get_customer_by_id
from app.services.customer_service import get_customers
from app.services.customer_service import update_customer


router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


@router.get(
    "",
    response_model=list[CustomerResponse],
)
def list_customers(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
):
    return get_customers(db)


@router.post(
    "",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_customer(
    payload: CustomerCreate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
):
    try:
        return create_customer(
            db,
            payload,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.put(
    "/{customer_id}",
    response_model=CustomerResponse,
)
def edit_customer(
    customer_id: int,
    payload: CustomerUpdate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AuthenticatedCommercialUser,
):
    customer = get_customer_by_id(
        db,
        customer_id,
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado.",
        )

    try:
        return update_customer(
            db,
            customer,
            payload,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_customer(
    customer_id: int,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AdminUser,
):
    customer = get_customer_by_id(
        db,
        customer_id,
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado.",
        )

    delete_customer(
        db,
        customer,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )