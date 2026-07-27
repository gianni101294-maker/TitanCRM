from datetime import UTC, datetime, timedelta
from uuid import uuid4

from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def create_authenticated_user() -> dict[str, str]:
    unique_email = f"activity_user_{uuid4().hex}@example.com"
    password = "Password123"

    register_response = client.post(
        "/users",
        json={
            "full_name": "Usuario Actividades",
            "email": unique_email,
            "password": password,
            "role": "user",
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/auth/login",
        data={
            "username": unique_email,
            "password": password,
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}",
    }


def create_test_customer(headers: dict[str, str]) -> int:
    unique_email = f"activity_customer_{uuid4().hex}@example.com"

    response = client.post(
        "/customers",
        headers=headers,
        json={
            "company_name": "Titan Activities SAC",
            "contact_name": "Luis Ramírez",
            "email": unique_email,
            "phone": "+51 987 654 321",
            "is_active": True,
        },
    )

    assert response.status_code == 201

    return response.json()["id"]


def test_activity_crud_and_queries():
    headers = create_authenticated_user()
    customer_id = create_test_customer(headers)

    upcoming_date = datetime.now(UTC) + timedelta(days=2)

    create_response = client.post(
        "/activities",
        headers=headers,
        json={
            "title": "Llamar al cliente",
            "activity_type": "call",
            "description": "Confirmar detalles de la propuesta",
            "scheduled_at": upcoming_date.isoformat(),
            "status": "pending",
            "customer_id": customer_id,
        },
    )

    assert create_response.status_code == 201

    created_activity = create_response.json()
    activity_id = created_activity["id"]

    assert created_activity["title"] == "Llamar al cliente"
    assert created_activity["activity_type"] == "call"
    assert created_activity["status"] == "pending"
    assert created_activity["customer_id"] == customer_id

    list_response = client.get(
        "/activities",
        headers=headers,
    )

    assert list_response.status_code == 200
    assert any(
        activity["id"] == activity_id
        for activity in list_response.json()
    )

    filtered_response = client.get(
        "/activities",
        headers=headers,
        params={
            "status": "pending",
            "activity_type": "call",
        },
    )

    assert filtered_response.status_code == 200
    assert any(
        activity["id"] == activity_id
        for activity in filtered_response.json()
    )

    customer_response = client.get(
        f"/activities/customer/{customer_id}",
        headers=headers,
    )

    assert customer_response.status_code == 200
    assert any(
        activity["id"] == activity_id
        for activity in customer_response.json()
    )

    get_response = client.get(
        f"/activities/{activity_id}",
        headers=headers,
    )

    assert get_response.status_code == 200
    assert get_response.json()["id"] == activity_id

    upcoming_response = client.get(
        "/activities/upcoming",
        headers=headers,
    )

    assert upcoming_response.status_code == 200
    assert any(
        activity["id"] == activity_id
        for activity in upcoming_response.json()
    )

    summary_response = client.get(
        "/activities/summary",
        headers=headers,
    )

    assert summary_response.status_code == 200

    summary = summary_response.json()

    assert "total" in summary
    assert "pending" in summary
    assert "completed" in summary
    assert "overdue" in summary
    assert "upcoming" in summary
    assert summary["total"] >= 1
    assert summary["pending"] >= 1
    assert summary["upcoming"] >= 1

    update_response = client.patch(
        f"/activities/{activity_id}",
        headers=headers,
        json={
            "title": "Llamada completada",
            "status": "completed",
            "description": "El cliente confirmó la propuesta",
        },
    )

    assert update_response.status_code == 200

    updated_activity = update_response.json()

    assert updated_activity["title"] == "Llamada completada"
    assert updated_activity["status"] == "completed"
    assert (
        updated_activity["description"]
        == "El cliente confirmó la propuesta"
    )

    delete_response = client.delete(
        f"/activities/{activity_id}",
        headers=headers,
    )

    assert delete_response.status_code == 204

    missing_response = client.get(
        f"/activities/{activity_id}",
        headers=headers,
    )

    assert missing_response.status_code == 404