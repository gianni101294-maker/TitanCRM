from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.customer import Customer
from backend.app.schemas.customer import CustomerCreate, CustomerUpdate


def get_customer_by_email(
    db: Session,
    email: str,
) -> Customer | None:
    statement = select(Customer).where(Customer.email == email)
    return db.scalar(statement)


def get_customer_by_id(
    db: Session,
    customer_id: int,
) -> Customer | None:
    return db.get(Customer, customer_id)


def get_all_customers(
    db: Session,
) -> list[Customer]:
    statement = select(Customer).order_by(Customer.id)
    return list(db.scalars(statement).all())


def create_customer(
    db: Session,
    customer_data: CustomerCreate,
) -> Customer:
    customer = Customer(
        company_name=customer_data.company_name,
        contact_name=customer_data.contact_name,
        email=customer_data.email,
        phone=customer_data.phone,
        is_active=customer_data.is_active,
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


def update_customer(
    db: Session,
    customer: Customer,
    customer_data: CustomerUpdate,
) -> Customer:
    update_data = customer_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(customer, field, value)

    db.commit()
    db.refresh(customer)

    return customer


def delete_customer(
    db: Session,
    customer: Customer,
) -> None:
    db.delete(customer)
    db.commit()