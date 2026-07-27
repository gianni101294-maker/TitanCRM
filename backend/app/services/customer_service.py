from sqlalchemy.orm import Session

from backend.app.models.customer import Customer
from backend.app.repositories.customer_repository import (
    create_customer,
    delete_customer,
    get_all_customers,
    get_customer_by_email,
    get_customer_by_id,
    update_customer,
)
from backend.app.schemas.customer import CustomerCreate, CustomerUpdate


def list_customers(db: Session) -> list[Customer]:
    return get_all_customers(db)


def get_customer(db: Session, customer_id: int) -> Customer:
    customer = get_customer_by_id(db, customer_id)

    if customer is None:
        raise ValueError("Cliente no encontrado.")

    return customer


def register_customer(
    db: Session,
    customer_data: CustomerCreate,
) -> Customer:
    existing_customer = get_customer_by_email(
        db,
        customer_data.email,
    )

    if existing_customer is not None:
        raise ValueError(
            "Ya existe un cliente con ese correo electrónico."
        )

    return create_customer(db, customer_data)


def edit_customer(
    db: Session,
    customer_id: int,
    customer_data: CustomerUpdate,
) -> Customer:
    customer = get_customer(db, customer_id)

    if customer_data.email is not None:
        existing_customer = get_customer_by_email(
            db,
            customer_data.email,
        )

        if (
            existing_customer is not None
            and existing_customer.id != customer_id
        ):
            raise ValueError(
                "Ya existe otro cliente con ese correo electrónico."
            )

    return update_customer(
        db,
        customer,
        customer_data,
    )


def remove_customer(
    db: Session,
    customer_id: int,
) -> None:
    customer = get_customer(db, customer_id)
    delete_customer(db, customer)