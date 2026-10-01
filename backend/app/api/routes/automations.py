from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status,
)
from sqlalchemy.orm import Session

from app.auth.permissions import AdminUser
from app.database.session import get_db
from app.schemas.automation import (
    AutomationRuleCreate,
    AutomationRuleResponse,
    AutomationRuleUpdate,
)
from app.services.automation_service import (
    create_automation_rule,
    delete_automation_rule,
    get_automation_rule_by_id,
    get_automation_rules,
    update_automation_rule,
)


router = APIRouter(
    prefix="/automations",
    tags=["Automations"],
)


@router.get(
    "",
    response_model=list[AutomationRuleResponse],
)
def list_automations(
    current_user: AdminUser,
    active_only: bool = False,
    db: Session = Depends(get_db),
):
    return get_automation_rules(
        db,
        active_only=active_only,
    )


@router.get(
    "/{automation_id}",
    response_model=AutomationRuleResponse,
)
def get_automation(
    automation_id: int,
    current_user: AdminUser,
    db: Session = Depends(get_db),
):
    automation = get_automation_rule_by_id(
        db,
        automation_id,
    )

    if automation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Automatización no encontrada",
        )

    return automation


@router.post(
    "",
    response_model=AutomationRuleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_automation(
    automation_data: AutomationRuleCreate,
    current_user: AdminUser,
    db: Session = Depends(get_db),
):
    return create_automation_rule(
        db,
        automation_data,
        user_id=current_user.id,
    )


@router.patch(
    "/{automation_id}",
    response_model=AutomationRuleResponse,
)
def update_automation(
    automation_id: int,
    automation_data: AutomationRuleUpdate,
    current_user: AdminUser,
    db: Session = Depends(get_db),
):
    automation = get_automation_rule_by_id(
        db,
        automation_id,
    )

    if automation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Automatización no encontrada",
        )

    return update_automation_rule(
        db,
        automation,
        automation_data,
    )


@router.delete(
    "/{automation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_automation(
    automation_id: int,
    current_user: AdminUser,
    db: Session = Depends(get_db),
):
    automation = get_automation_rule_by_id(
        db,
        automation_id,
    )

    if automation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Automatización no encontrada",
        )

    delete_automation_rule(
        db,
        automation,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )