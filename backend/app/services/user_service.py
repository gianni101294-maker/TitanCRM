from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User
from app.schemas.user import UserCreate
from app.schemas.user import UserUpdate


def normalize_email(email: str) -> str:
    return email.strip().lower()


def get_user_by_id(
    db: Session,
    user_id: int,
) -> User | None:
    statement = select(User).where(
        User.id == user_id,
    )

    return db.scalar(statement)


def get_user_by_email(
    db: Session,
    email: str,
) -> User | None:
    normalized_email = normalize_email(email)

    statement = select(User).where(
        User.email == normalized_email,
    )

    return db.scalar(statement)


def get_users(
    db: Session,
) -> list[User]:
    statement = select(User).order_by(
        User.id.desc(),
    )

    return list(
        db.scalars(statement).all(),
    )


def create_user(
    db: Session,
    payload: UserCreate,
) -> User:
    existing_user = get_user_by_email(
        db,
        payload.email,
    )

    if existing_user:
        raise ValueError(
            "Ya existe un usuario con ese correo.",
        )

    user = User(
        full_name=payload.full_name.strip(),
        email=normalize_email(payload.email),
        hashed_password=hash_password(
            payload.password,
        ),
        role=payload.role,
        is_active=payload.is_active,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def update_user(
    db: Session,
    user: User,
    payload: UserUpdate,
) -> User:
    update_data = payload.model_dump(
        exclude_unset=True,
    )

    if "email" in update_data:
        email = normalize_email(
            update_data["email"],
        )

        existing_user = get_user_by_email(
            db,
            email,
        )

        if (
            existing_user
            and existing_user.id != user.id
        ):
            raise ValueError(
                "Ya existe un usuario con ese correo.",
            )

        update_data["email"] = email

    password = update_data.pop(
        "password",
        None,
    )

    if password:
        user.hashed_password = hash_password(
            password,
        )

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return user


def delete_user(
    db: Session,
    user: User,
) -> None:
    db.delete(user)
    db.commit()