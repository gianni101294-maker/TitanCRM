from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate
from app.schemas.customer import CustomerUpdate


def normalize_email(email: str) -> str:
    return email.strip().lower()


def get_customer_by_id(
    db: Session,
    customer_id: int,
) -> Customer | None:
    statement = select(Customer).where(
        Customer.id == customer_id,
    )

    return db.scalar(statement)


def get_customer_by_email(
    db: Session,
    email: str,
) -> Customer | None:
    normalized_email = normalize_email(email)

    statement = select(Customer).where(
        Customer.email == normalized_email,
    )

    return db.scalar(statement)


def get_customers(
    db: Session,
) -> list[Customer]:
    statement = select(Customer).order_by(
        Customer.id.desc(),
    )

    return list(
        db.scalars(statement).all(),
    )


def create_customer(
    db: Session,
    payload: CustomerCreate,
) -> Customer:
    existing_customer = get_customer_by_email(
        db,
        payload.email,
    )

    if existing_customer:
        raise ValueError(
            "Ya existe un cliente con ese correo.",
        )

    customer = Customer(
        company_name=payload.company_name.strip(),
        contact_name=payload.contact_name.strip(),
        email=normalize_email(payload.email),
        phone=payload.phone.strip(),
        is_active=payload.is_active,
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


def update_customer(
    db: Session,
    customer: Customer,
    payload: CustomerUpdate,
) -> Customer:
    update_data = payload.model_dump(
        exclude_unset=True,
    )

    if "email" in update_data:
        email = normalize_email(
            update_data["email"],
        )

        existing_customer = get_customer_by_email(
            db,
            email,
        )

        if (
            existing_customer
            and existing_customer.id
            != customer.id
        ):
            raise ValueError(
                "Ya existe un cliente con ese correo.",
            )

        update_data["email"] = email

    if "company_name" in update_data:
        update_data["company_name"] = (
            update_data["company_name"].strip()
        )

    if "contact_name" in update_data:
        update_data["contact_name"] = (
            update_data["contact_name"].strip()
        )

    if "phone" in update_data:
        update_data["phone"] = (
            update_data["phone"].strip()
        )

    for field, value in update_data.items():
        setattr(
            customer,
            field,
            value,
        )

    db.commit()
    db.refresh(customer)

    return customer


def delete_customer(
    db: Session,
    customer: Customer,
) -> None:
    db.delete(customer)
    db.commit()