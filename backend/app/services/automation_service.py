from datetime import UTC, datetime, timedelta
from decimal import Decimal, InvalidOperation

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.activity import Activity
from app.models.automation import AutomationRule
from app.models.opportunity import Opportunity
from app.schemas.automation import (
    AutomationRuleCreate,
    AutomationRuleUpdate,
)


# =========================================================
# CRUD DE REGLAS DE AUTOMATIZACIÓN
# =========================================================


def get_automation_rules(
    db: Session,
    active_only: bool = False,
) -> list[AutomationRule]:
    statement = select(AutomationRule)

    if active_only:
        statement = statement.where(
            AutomationRule.is_active.is_(True),
        )

    statement = statement.order_by(
        AutomationRule.created_at.desc(),
    )

    return list(
        db.scalars(statement).all(),
    )


def get_automation_rule_by_id(
    db: Session,
    automation_id: int,
) -> AutomationRule | None:
    statement = select(
        AutomationRule,
    ).where(
        AutomationRule.id == automation_id,
    )

    return db.scalar(statement)


def create_automation_rule(
    db: Session,
    automation_data: AutomationRuleCreate,
    user_id: int | None = None,
) -> AutomationRule:
    automation = AutomationRule(
        name=automation_data.name.strip(),
        description=automation_data.description,
        trigger_type=automation_data.trigger_type,
        conditions=automation_data.conditions,
        action_type=automation_data.action_type,
        action_config=automation_data.action_config,
        is_active=automation_data.is_active,
        created_by=user_id,
    )

    db.add(automation)
    db.commit()
    db.refresh(automation)

    return automation


def update_automation_rule(
    db: Session,
    automation: AutomationRule,
    automation_data: AutomationRuleUpdate,
) -> AutomationRule:
    update_data = automation_data.model_dump(
        exclude_unset=True,
    )

    if "name" in update_data:
        name = update_data["name"]

        if name is not None:
            update_data["name"] = name.strip()

    for field, value in update_data.items():
        setattr(
            automation,
            field,
            value,
        )

    db.commit()
    db.refresh(automation)

    return automation


def delete_automation_rule(
    db: Session,
    automation: AutomationRule,
) -> None:
    db.delete(automation)
    db.commit()


# =========================================================
# MOTOR DE AUTOMATIZACIONES
# =========================================================


def _to_decimal(
    value: object,
) -> Decimal | None:
    """
    Convierte números recibidos desde Python, PostgreSQL
    o JSON a Decimal para poder compararlos de forma segura.
    """

    if value is None:
        return None

    try:
        return Decimal(
            str(value),
        )
    except (
        InvalidOperation,
        ValueError,
        TypeError,
    ):
        return None


def _numeric_condition_matches(
    actual_value: object,
    expected_value: object,
    operator: str,
) -> bool:
    """
    Evalúa una condición numérica.

    Operadores soportados:
    - min: actual >= esperado
    - max: actual <= esperado
    """

    actual_number = _to_decimal(
        actual_value,
    )

    expected_number = _to_decimal(
        expected_value,
    )

    if (
        actual_number is None
        or expected_number is None
    ):
        return False

    if operator == "min":
        return (
            actual_number
            >= expected_number
        )

    if operator == "max":
        return (
            actual_number
            <= expected_number
        )

    return False


def _conditions_match(
    automation: AutomationRule,
    context: dict,
) -> bool:
    """
    Comprueba si todas las condiciones configuradas
    en una regla coinciden con el contexto recibido.

    Condiciones de igualdad:
    - stage
    - old_stage
    - priority

    Condiciones numéricas:
    - probability_min
    - probability_max
    - value_min
    - value_max

    Cualquier otra condición conserva el comportamiento
    anterior y se compara mediante igualdad.
    """

    conditions = (
        automation.conditions
        or {}
    )

    for field, expected_value in conditions.items():
        if field == "probability_min":
            if not _numeric_condition_matches(
                actual_value=context.get(
                    "probability",
                ),
                expected_value=expected_value,
                operator="min",
            ):
                return False

            continue

        if field == "probability_max":
            if not _numeric_condition_matches(
                actual_value=context.get(
                    "probability",
                ),
                expected_value=expected_value,
                operator="max",
            ):
                return False

            continue

        if field == "value_min":
            if not _numeric_condition_matches(
                actual_value=context.get(
                    "value",
                ),
                expected_value=expected_value,
                operator="min",
            ):
                return False

            continue

        if field == "value_max":
            if not _numeric_condition_matches(
                actual_value=context.get(
                    "value",
                ),
                expected_value=expected_value,
                operator="max",
            ):
                return False

            continue

        actual_value = context.get(
            field,
        )

        if actual_value != expected_value:
            return False

    return True


def _create_activity_action(
    db: Session,
    automation: AutomationRule,
    opportunity: Opportunity,
) -> Activity:
    """
    Ejecuta la acción create_activity para una oportunidad.

    La actividad se agrega a la sesión de base de datos,
    pero esta función no realiza commit.
    """

    config = (
        automation.action_config
        or {}
    )

    activity_type = config.get(
        "activity_type",
        "call",
    )

    delay_days = config.get(
        "delay_days",
        0,
    )

    title = config.get(
        "title",
    )

    if not title:
        activity_labels = {
            "call": "Llamada",
            "meeting": "Reunión",
            "email": "Correo",
            "task": "Tarea",
        }

        activity_label = activity_labels.get(
            activity_type,
            "Actividad",
        )

        title = (
            f"{activity_label}: "
            f"{opportunity.title}"
        )

    description = config.get(
        "description",
    )

    if not description:
        description = (
            "Actividad creada automáticamente "
            f"por la regla «{automation.name}»."
        )

    scheduled_at = (
        datetime.now(UTC)
        + timedelta(
            days=delay_days,
        )
    )

    activity = Activity(
        title=title,
        activity_type=activity_type,
        description=description,
        scheduled_at=scheduled_at,
        status="pending",
        customer_id=opportunity.customer_id,
        opportunity_id=opportunity.id,
    )

    db.add(activity)
    db.flush()

    return activity


def execute_automation_trigger(
    db: Session,
    trigger_type: str,
    opportunity: Opportunity,
    context: dict,
) -> list[Activity]:
    """
    Ejecuta todas las reglas activas correspondientes
    al trigger recibido.

    Ejemplo de contexto:

    {
        "stage": "proposal",
        "old_stage": "contacted",
        "priority": "high",
        "probability": 70,
        "value": 25000,
    }

    Si todas las condiciones de una regla se cumplen,
    ejecuta la acción correspondiente.
    """

    statement = select(
        AutomationRule,
    ).where(
        AutomationRule.is_active.is_(True),
        AutomationRule.trigger_type
        == trigger_type,
    )

    automations = list(
        db.scalars(
            statement,
        ).all(),
    )

    created_activities: list[
        Activity
    ] = []

    for automation in automations:
        if not _conditions_match(
            automation=automation,
            context=context,
        ):
            continue

        if (
            automation.action_type
            == "create_activity"
        ):
            activity = (
                _create_activity_action(
                    db=db,
                    automation=automation,
                    opportunity=opportunity,
                )
            )

            created_activities.append(
                activity,
            )

    return created_activities