from sqlalchemy.orm import Session

from backend.app.core.security import hash_password
from backend.app.repositories.user_repository import (
    create_user,
    get_user_by_email,
)
from backend.app.schemas.user import UserCreate


def register_user(db: Session, user_data: UserCreate):
    existing_user = get_user_by_email(db, user_data.email)

    if existing_user:
        raise ValueError("El correo electrónico ya está registrado.")

    hashed = hash_password(user_data.password)

    return create_user(
        db=db,
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hashed,
        role=user_data.role,
    )