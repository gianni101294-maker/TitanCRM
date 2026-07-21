from sqlalchemy.orm import Session

from backend.app.core.security import (
    create_access_token,
    verify_password,
)
from backend.app.repositories.user_repository import get_user_by_email


def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> str:
    user = get_user_by_email(db, email)

    if user is None:
        raise ValueError("Correo o contraseña incorrectos.")

    if not user.is_active:
        raise ValueError("El usuario está inactivo.")

    if not verify_password(password, user.hashed_password):
        raise ValueError("Correo o contraseña incorrectos.")

    return create_access_token(subject=user.email)