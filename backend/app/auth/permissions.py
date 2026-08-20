from typing import Annotated

from fastapi import Depends

from app.auth.dependencies import require_roles
from app.models.user import User


AdminUser = Annotated[
    User,
    Depends(
        require_roles(
            "admin",
        ),
    ),
]


AdminOrSupervisorUser = Annotated[
    User,
    Depends(
        require_roles(
            "admin",
            "supervisor",
        ),
    ),
]


AuthenticatedCommercialUser = Annotated[
    User,
    Depends(
        require_roles(
            "admin",
            "supervisor",
            "sales",
        ),
    ),
]