from typing import Annotated

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Response
from fastapi import status
from sqlalchemy.orm import Session

from app.auth.dependencies import require_roles
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate
from app.schemas.user import UserResponse
from app.schemas.user import UserUpdate
from app.services.user_service import create_user
from app.services.user_service import delete_user
from app.services.user_service import get_user_by_id
from app.services.user_service import get_users
from app.services.user_service import update_user


AdminUser = Annotated[
    User,
    Depends(
        require_roles(
            "admin",
        ),
    ),
]


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "",
    response_model=list[UserResponse],
)
def list_users(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AdminUser,
):
    return get_users(db)


@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_user(
    payload: UserCreate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AdminUser,
):
    try:
        return create_user(
            db,
            payload,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.put(
    "/{user_id}",
    response_model=UserResponse,
)
def edit_user(
    user_id: int,
    payload: UserUpdate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AdminUser,
):
    user = get_user_by_id(
        db,
        user_id,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado.",
        )

    try:
        return update_user(
            db,
            user,
            payload,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_user(
    user_id: int,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    current_user: AdminUser,
):
    user = get_user_by_id(
        db,
        user_id,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado.",
        )

    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "No puedes eliminar tu propio usuario "
                "mientras tienes una sesión activa."
            ),
        )

    delete_user(
        db,
        user,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )