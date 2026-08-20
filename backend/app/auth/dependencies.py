from collections.abc import Callable
from typing import Annotated

from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.database.session import get_db
from app.models.user import User
from app.services.user_service import get_user_by_id


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login",
)


def get_current_user(
    token: Annotated[
        str,
        Depends(oauth2_scheme),
    ],
    db: Annotated[
        Session,
        Depends(get_db),
    ],
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales.",
        headers={
            "WWW-Authenticate": "Bearer",
        },
    )

    payload = decode_access_token(token)

    if payload is None:
        raise credentials_exception

    subject = payload.get("sub")

    if subject is None:
        raise credentials_exception

    try:
        user_id = int(subject)
    except (TypeError, ValueError) as error:
        raise credentials_exception from error

    user = get_user_by_id(
        db,
        user_id,
    )

    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="El usuario se encuentra inactivo.",
        )

    return user


def require_roles(
    *allowed_roles: str,
) -> Callable[..., User]:
    def role_dependency(
        current_user: Annotated[
            User,
            Depends(get_current_user),
        ],
    ) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "No tienes permisos para realizar "
                    "esta acción."
                ),
            )

        return current_user

    return role_dependency


CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]