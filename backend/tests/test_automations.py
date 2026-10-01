from uuid import uuid4

from fastapi.testclient import TestClient

from app.auth.dependencies import get_current_user
from app.core.security import hash_password
from app.database.session import SessionLocal
from app.main import app
from app.models.automation import AutomationRule
from app.models.user import User


client = TestClient(app)


def create_test_user(role: str) -> User:
    db = SessionLocal()

    try:
        user = User(
            full_name=f"Test {role}",
            email=f"{role}_{uuid4().hex}@example.com",
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


def delete_test_user(user_id: int) -> None:
    db = SessionLocal()

    try:
        user = db.get(User, user_id)

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


def test_automations_requires_authentication():
    response = client.get(
        "/automations",
    )

    assert response.status_code == 401


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

        assert response.status_code == 403

    finally:
        app.dependency_overrides.clear()
        delete_test_user(
            sales_user.id,
        )


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
                "name": "Automatización Test",
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

        created = create_response.json()

        automation_id = created["id"]

        assert (
            created["name"]
            == "Automatización Test"
        )
        assert created["is_active"] is True
        assert (
            created["created_by"]
            == admin_user.id
        )

        print("Created:", automation_id)

        print("")
        print("===== GET =====")

        get_response = client.get(
            f"/automations/{automation_id}",
        )

        assert get_response.status_code == 200
        assert (
            get_response.json()["id"]
            == automation_id
        )

        print("")
        print("===== LIST =====")

        list_response = client.get(
            "/automations",
        )

        assert list_response.status_code == 200

        assert any(
            item["id"] == automation_id
            for item in list_response.json()
        )

        print("")
        print("===== PATCH =====")

        patch_response = client.patch(
            f"/automations/{automation_id}",
            json={
                "name": (
                    "Automatización Test Editada"
                ),
                "is_active": False,
            },
        )

        assert patch_response.status_code == 200

        updated = patch_response.json()

        assert (
            updated["name"]
            == "Automatización Test Editada"
        )
        assert updated["is_active"] is False

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
