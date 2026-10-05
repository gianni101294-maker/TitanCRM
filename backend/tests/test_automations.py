from types import SimpleNamespace
from unittest.mock import MagicMock
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy import select

from app.auth.dependencies import get_current_user
from app.core.security import hash_password
from app.database.session import SessionLocal
from app.main import app
from app.models.activity import Activity
from app.models.automation import AutomationRule
from app.models.customer import Customer
from app.models.opportunity import Opportunity
from app.models.user import User
from app.schemas.opportunity import OpportunityUpdate
from app.services.automation_service import (
    execute_automation_trigger,
)
from app.services.opportunity_service import (
    edit_opportunity,
)


client = TestClient(app)


# =========================================================
# HELPERS
# =========================================================


def create_test_user(
    role: str,
) -> User:
    db = SessionLocal()

    try:
        user = User(
            full_name=f"Test {role}",
            email=(
                f"{role}_{uuid4().hex}"
                "@example.com"
            ),
            hashed_password=hash_password(
                "Password123",
            ),
            role=role,
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        db.expunge(user)

        return user

    finally:
        db.close()


def delete_test_user(
    user_id: int,
) -> None:
    db = SessionLocal()

    try:
        user = db.get(
            User,
            user_id,
        )

        if user is not None:
            db.delete(user)
            db.commit()

    finally:
        db.close()


def delete_test_automation(
    automation_id: int,
) -> None:
    db = SessionLocal()

    try:
        automation = db.get(
            AutomationRule,
            automation_id,
        )

        if automation is not None:
            db.delete(automation)
            db.commit()

    finally:
        db.close()


def delete_test_activity(
    activity_id: int,
) -> None:
    db = SessionLocal()

    try:
        activity = db.get(
            Activity,
            activity_id,
        )

        if activity is not None:
            db.delete(activity)
            db.commit()

    finally:
        db.close()


def delete_test_opportunity(
    opportunity_id: int,
) -> None:
    db = SessionLocal()

    try:
        opportunity = db.get(
            Opportunity,
            opportunity_id,
        )

        if opportunity is not None:
            db.delete(opportunity)
            db.commit()

    finally:
        db.close()


def delete_test_customer(
    customer_id: int,
) -> None:
    db = SessionLocal()

    try:
        customer = db.get(
            Customer,
            customer_id,
        )

        if customer is not None:
            db.delete(customer)
            db.commit()

    finally:
        db.close()


def create_mock_db_with_automation(
    automation: AutomationRule,
) -> MagicMock:
    db = MagicMock()

    scalar_result = MagicMock()

    scalar_result.all.return_value = [
        automation,
    ]

    db.scalars.return_value = (
        scalar_result
    )

    return db


def create_mock_opportunity(
) -> SimpleNamespace:
    return SimpleNamespace(
        id=123,
        title="Proyecto Domótica Test",
        customer_id=456,
    )


# =========================================================
# TEST 1
# SIN AUTENTICACIÓN NO SE PUEDE ACCEDER
# =========================================================


def test_automations_requires_authentication():
    response = client.get(
        "/automations",
    )

    assert response.status_code == 401


# =========================================================
# TEST 2
# SALES NO PUEDE ADMINISTRAR AUTOMATIZACIONES
# =========================================================


def test_sales_cannot_access_automations():
    sales_user = create_test_user(
        "sales",
    )

    def override_current_user():
        return sales_user

    app.dependency_overrides[
        get_current_user
    ] = override_current_user

    try:
        response = client.get(
            "/automations",
        )

        assert (
            response.status_code
            == 403
        )

    finally:
        app.dependency_overrides.clear()

        delete_test_user(
            sales_user.id,
        )


# =========================================================
# TEST 3
# CRUD COMPLETO DE AUTOMATIZACIONES
# =========================================================


def test_admin_automation_crud():
    admin_user = create_test_user(
        "admin",
    )

    def override_current_user():
        return admin_user

    app.dependency_overrides[
        get_current_user
    ] = override_current_user

    automation_id = None

    try:
        print("")
        print("===== CREATE =====")

        create_response = client.post(
            "/automations",
            json={
                "name": (
                    "Automatización Test"
                ),
                "description": (
                    "Regla creada por pytest"
                ),
                "trigger_type": (
                    "opportunity_stage_changed"
                ),
                "conditions": {
                    "stage": "proposal",
                },
                "action_type": (
                    "create_activity"
                ),
                "action_config": {
                    "activity_type": "call",
                    "delay_days": 2,
                },
                "is_active": True,
            },
        )

        assert (
            create_response.status_code
            == 201
        )

        created = (
            create_response.json()
        )

        automation_id = (
            created["id"]
        )

        assert (
            created["name"]
            == "Automatización Test"
        )

        assert (
            created["is_active"]
            is True
        )

        assert (
            created["created_by"]
            == admin_user.id
        )

        print(
            "Created:",
            automation_id,
        )

        print("")
        print("===== GET =====")

        get_response = client.get(
            f"/automations/{automation_id}",
        )

        assert (
            get_response.status_code
            == 200
        )

        assert (
            get_response.json()["id"]
            == automation_id
        )

        print("")
        print("===== LIST =====")

        list_response = client.get(
            "/automations",
        )

        assert (
            list_response.status_code
            == 200
        )

        assert any(
            item["id"]
            == automation_id
            for item
            in list_response.json()
        )

        print("")
        print("===== PATCH =====")

        patch_response = client.patch(
            f"/automations/{automation_id}",
            json={
                "name": (
                    "Automatización Test "
                    "Editada"
                ),
                "is_active": False,
            },
        )

        assert (
            patch_response.status_code
            == 200
        )

        updated = (
            patch_response.json()
        )

        assert (
            updated["name"]
            == (
                "Automatización Test "
                "Editada"
            )
        )

        assert (
            updated["is_active"]
            is False
        )

        print("")
        print("===== DELETE =====")

        delete_response = client.delete(
            f"/automations/{automation_id}",
        )

        assert (
            delete_response.status_code
            == 204
        )

        automation_id = None

    finally:
        app.dependency_overrides.clear()

        if automation_id is not None:
            delete_test_automation(
                automation_id,
            )

        delete_test_user(
            admin_user.id,
        )


# =========================================================
# TEST 4
# MOTOR BÁSICO DE AUTOMATIZACIONES
# =========================================================


def test_automation_engine_creates_activity():
    print("")
    print("===== AUTOMATION ENGINE =====")

    automation = AutomationRule(
        id=999,
        name="Seguimiento de propuesta",
        description=(
            "Crear llamada cuando una "
            "oportunidad pase a propuesta."
        ),
        trigger_type=(
            "opportunity_stage_changed"
        ),
        conditions={
            "stage": "proposal",
        },
        action_type="create_activity",
        action_config={
            "activity_type": "call",
            "delay_days": 0,
        },
        is_active=True,
    )

    opportunity = (
        create_mock_opportunity()
    )

    db = (
        create_mock_db_with_automation(
            automation,
        )
    )

    created_activities = (
        execute_automation_trigger(
            db=db,
            trigger_type=(
                "opportunity_stage_changed"
            ),
            opportunity=opportunity,
            context={
                "stage": "proposal",
            },
        )
    )

    assert (
        len(created_activities)
        == 1
    )

    activity = (
        created_activities[0]
    )

    assert (
        activity.activity_type
        == "call"
    )

    assert (
        activity.status
        == "pending"
    )

    assert (
        activity.customer_id
        == 456
    )

    assert (
        activity.opportunity_id
        == 123
    )

    assert (
        activity.title
        == (
            "Llamada: "
            "Proyecto Domótica Test"
        )
    )

    assert (
        "Seguimiento de propuesta"
        in activity.description
    )

    db.add.assert_called_once()
    db.flush.assert_called_once()

    print(
        "Actividad creada:",
        activity.title,
    )


# =========================================================
# TEST 5
# NO EJECUTAR SI NO COINCIDE LA ETAPA
# =========================================================


def test_automation_engine_ignores_non_matching_stage():
    print("")
    print(
        "===== NON MATCHING CONDITION ====="
    )

    automation = AutomationRule(
        id=998,
        name="Seguimiento de propuesta",
        trigger_type=(
            "opportunity_stage_changed"
        ),
        conditions={
            "stage": "proposal",
        },
        action_type="create_activity",
        action_config={
            "activity_type": "call",
            "delay_days": 0,
        },
        is_active=True,
    )

    opportunity = (
        create_mock_opportunity()
    )

    db = (
        create_mock_db_with_automation(
            automation,
        )
    )

    created_activities = (
        execute_automation_trigger(
            db=db,
            trigger_type=(
                "opportunity_stage_changed"
            ),
            opportunity=opportunity,
            context={
                "stage": "negotiation",
            },
        )
    )

    assert (
        created_activities
        == []
    )

    db.add.assert_not_called()
    db.flush.assert_not_called()


# =========================================================
# TEST 6
# CONDICIONES INTELIGENTES:
# TODAS LAS CONDICIONES SE CUMPLEN
# =========================================================


def test_smart_conditions_create_activity():
    print("")
    print(
        "===== SMART CONDITIONS MATCH ====="
    )

    automation = AutomationRule(
        id=997,
        name=(
            "Propuesta de alto valor"
        ),
        trigger_type=(
            "opportunity_stage_changed"
        ),
        conditions={
            "stage": "proposal",
            "priority": "high",
            "probability_min": 60,
            "value_min": 20000,
        },
        action_type="create_activity",
        action_config={
            "activity_type": "task",
            "delay_days": 0,
        },
        is_active=True,
    )

    opportunity = (
        create_mock_opportunity()
    )

    db = (
        create_mock_db_with_automation(
            automation,
        )
    )

    created_activities = (
        execute_automation_trigger(
            db=db,
            trigger_type=(
                "opportunity_stage_changed"
            ),
            opportunity=opportunity,
            context={
                "stage": "proposal",
                "old_stage": "contacted",
                "priority": "high",
                "probability": 75,
                "value": 35000,
            },
        )
    )

    assert (
        len(created_activities)
        == 1
    )

    activity = (
        created_activities[0]
    )

    assert (
        activity.activity_type
        == "task"
    )

    assert (
        activity.title
        == (
            "Tarea: "
            "Proyecto Domótica Test"
        )
    )

    db.add.assert_called_once()
    db.flush.assert_called_once()


# =========================================================
# TEST 7
# CONDICIONES INTELIGENTES:
# PRIORIDAD INCORRECTA
# =========================================================


def test_smart_conditions_block_wrong_priority():
    print("")
    print(
        "===== SMART PRIORITY BLOCK ====="
    )

    automation = AutomationRule(
        id=996,
        name=(
            "Propuesta prioridad alta"
        ),
        trigger_type=(
            "opportunity_stage_changed"
        ),
        conditions={
            "stage": "proposal",
            "priority": "high",
        },
        action_type="create_activity",
        action_config={
            "activity_type": "task",
            "delay_days": 0,
        },
        is_active=True,
    )

    opportunity = (
        create_mock_opportunity()
    )

    db = (
        create_mock_db_with_automation(
            automation,
        )
    )

    created_activities = (
        execute_automation_trigger(
            db=db,
            trigger_type=(
                "opportunity_stage_changed"
            ),
            opportunity=opportunity,
            context={
                "stage": "proposal",
                "priority": "medium",
                "probability": 80,
                "value": 50000,
            },
        )
    )

    assert (
        created_activities
        == []
    )

    db.add.assert_not_called()
    db.flush.assert_not_called()


# =========================================================
# TEST 8
# CONDICIONES INTELIGENTES:
# PROBABILIDAD INFERIOR AL MÍNIMO
# =========================================================


def test_smart_conditions_block_low_probability():
    print("")
    print(
        "===== SMART PROBABILITY BLOCK ====="
    )

    automation = AutomationRule(
        id=995,
        name=(
            "Probabilidad mínima 60"
        ),
        trigger_type=(
            "opportunity_stage_changed"
        ),
        conditions={
            "stage": "proposal",
            "probability_min": 60,
        },
        action_type="create_activity",
        action_config={
            "activity_type": "task",
            "delay_days": 0,
        },
        is_active=True,
    )

    opportunity = (
        create_mock_opportunity()
    )

    db = (
        create_mock_db_with_automation(
            automation,
        )
    )

    created_activities = (
        execute_automation_trigger(
            db=db,
            trigger_type=(
                "opportunity_stage_changed"
            ),
            opportunity=opportunity,
            context={
                "stage": "proposal",
                "priority": "high",
                "probability": 45,
                "value": 50000,
            },
        )
    )

    assert (
        created_activities
        == []
    )

    db.add.assert_not_called()
    db.flush.assert_not_called()


# =========================================================
# TEST 9
# CONDICIONES INTELIGENTES:
# VALOR INFERIOR AL MÍNIMO
# =========================================================


def test_smart_conditions_block_low_value():
    print("")
    print(
        "===== SMART VALUE BLOCK ====="
    )

    automation = AutomationRule(
        id=994,
        name=(
            "Valor mínimo 20000"
        ),
        trigger_type=(
            "opportunity_stage_changed"
        ),
        conditions={
            "stage": "proposal",
            "value_min": 20000,
        },
        action_type="create_activity",
        action_config={
            "activity_type": "call",
            "delay_days": 0,
        },
        is_active=True,
    )

    opportunity = (
        create_mock_opportunity()
    )

    db = (
        create_mock_db_with_automation(
            automation,
        )
    )

    created_activities = (
        execute_automation_trigger(
            db=db,
            trigger_type=(
                "opportunity_stage_changed"
            ),
            opportunity=opportunity,
            context={
                "stage": "proposal",
                "priority": "high",
                "probability": 90,
                "value": 15000,
            },
        )
    )

    assert (
        created_activities
        == []
    )

    db.add.assert_not_called()
    db.flush.assert_not_called()


# =========================================================
# TEST 10
# CONDICIONES NUMÉRICAS:
# VALORES EXACTAMENTE EN EL LÍMITE
# =========================================================


def test_smart_conditions_accept_exact_limits():
    print("")
    print(
        "===== SMART EXACT LIMITS ====="
    )

    automation = AutomationRule(
        id=993,
        name="Límites exactos",
        trigger_type=(
            "opportunity_stage_changed"
        ),
        conditions={
            "stage": "proposal",
            "probability_min": 60,
            "value_min": 20000,
        },
        action_type="create_activity",
        action_config={
            "activity_type": "meeting",
            "delay_days": 0,
        },
        is_active=True,
    )

    opportunity = (
        create_mock_opportunity()
    )

    db = (
        create_mock_db_with_automation(
            automation,
        )
    )

    created_activities = (
        execute_automation_trigger(
            db=db,
            trigger_type=(
                "opportunity_stage_changed"
            ),
            opportunity=opportunity,
            context={
                "stage": "proposal",
                "priority": "medium",
                "probability": 60,
                "value": 20000,
            },
        )
    )

    assert (
        len(created_activities)
        == 1
    )

    activity = (
        created_activities[0]
    )

    assert (
        activity.activity_type
        == "meeting"
    )

    db.add.assert_called_once()
    db.flush.assert_called_once()


# =========================================================
# TEST 11
# INTEGRACIÓN REAL CON POSTGRESQL
# =========================================================


def test_stage_change_creates_real_activity():
    print("")
    print(
        "===== REAL DATABASE INTEGRATION ====="
    )

    db = SessionLocal()

    customer_id = None
    opportunity_id = None
    automation_id = None

    created_activity_ids = []

    try:
        unique_code = (
            uuid4().hex[:8]
        )

        customer = Customer(
            company_name=(
                "Cliente Automatización "
                f"{unique_code}"
            ),
            contact_name=(
                "Contacto Pytest"
            ),
            email=(
                "automatizacion_"
                f"{unique_code}"
                "@example.com"
            ),
            phone="999999999",
            is_active=True,
        )

        db.add(customer)
        db.commit()
        db.refresh(customer)

        customer_id = (
            customer.id
        )

        print(
            "Cliente creado:",
            customer.id,
            customer.company_name,
        )

        opportunity = Opportunity(
            title=(
                "Proyecto Integración "
                "Automatización"
            ),
            value=10000,
            stage="prospect",
            priority="medium",
            probability=20,
            notes=(
                "Oportunidad creada por "
                "pytest para probar "
                "automatizaciones."
            ),
            customer_id=customer.id,
        )

        db.add(opportunity)
        db.commit()
        db.refresh(opportunity)

        opportunity_id = (
            opportunity.id
        )

        print(
            "Oportunidad creada:",
            opportunity.id,
            opportunity.stage,
        )

        automation = AutomationRule(
            name=(
                "Seguimiento propuesta "
                "integración"
            ),
            description=(
                "Regla real de integración "
                "pytest"
            ),
            trigger_type=(
                "opportunity_stage_changed"
            ),
            conditions={
                "stage": "proposal",
            },
            action_type=(
                "create_activity"
            ),
            action_config={
                "activity_type": "call",
                "delay_days": 0,
            },
            is_active=True,
        )

        db.add(automation)
        db.commit()
        db.refresh(automation)

        automation_id = (
            automation.id
        )

        print(
            "Automatización creada:",
            automation.id,
            automation.name,
        )

        before_statement = (
            select(
                Activity.id,
            ).where(
                Activity.opportunity_id
                == opportunity.id,
            )
        )

        activity_ids_before = set(
            db.scalars(
                before_statement,
            ).all()
        )

        edited_opportunity = (
            edit_opportunity(
                db=db,
                opportunity_id=(
                    opportunity.id
                ),
                opportunity_data=(
                    OpportunityUpdate(
                        stage="proposal",
                    )
                ),
                user_id=None,
            )
        )

        assert (
            edited_opportunity.stage
            == "proposal"
        )

        after_statement = (
            select(
                Activity,
            ).where(
                Activity.opportunity_id
                == opportunity.id,
            )
        )

        activities_after = list(
            db.scalars(
                after_statement,
            ).all()
        )

        new_activities = [
            activity
            for activity
            in activities_after
            if (
                activity.id
                not in activity_ids_before
            )
        ]

        created_activity_ids = [
            activity.id
            for activity
            in new_activities
        ]

        assert (
            len(new_activities)
            >= 1
        )

        matching_activities = [
            activity
            for activity
            in new_activities
            if (
                activity.activity_type
                == "call"
                and activity.status
                == "pending"
                and activity.customer_id
                == customer.id
                and (
                    activity.opportunity_id
                    == opportunity.id
                )
                and (
                    "Seguimiento propuesta "
                    "integración"
                    in (
                        activity.description
                        or ""
                    )
                )
            )
        ]

        assert (
            len(matching_activities)
            == 1
        )

        activity = (
            matching_activities[0]
        )

        assert (
            activity.title
            == (
                "Llamada: "
                "Proyecto Integración "
                "Automatización"
            )
        )

        assert (
            activity.activity_type
            == "call"
        )

        assert (
            activity.status
            == "pending"
        )

        assert (
            activity.customer_id
            == customer.id
        )

        assert (
            activity.opportunity_id
            == opportunity.id
        )

        print("")
        print(
            "==================================="
        )
        print(
            "AUTOMATIZACIÓN REAL EJECUTADA"
        )
        print(
            "==================================="
        )

        print(
            "Oportunidad:",
            opportunity.id,
        )

        print(
            "Nueva etapa:",
            edited_opportunity.stage,
        )

        print(
            "Actividad:",
            activity.id,
        )

        print(
            "Título:",
            activity.title,
        )

        print(
            "Tipo:",
            activity.activity_type,
        )

        print(
            "Estado:",
            activity.status,
        )

        print(
            "==================================="
        )

    finally:
        db.close()

        for activity_id in (
            created_activity_ids
        ):
            delete_test_activity(
                activity_id,
            )

        if automation_id is not None:
            delete_test_automation(
                automation_id,
            )

        if opportunity_id is not None:
            delete_test_opportunity(
                opportunity_id,
            )

        if customer_id is not None:
            delete_test_customer(
                customer_id,
            )