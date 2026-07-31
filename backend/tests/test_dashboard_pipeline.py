from uuid import uuid4

from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def create_authenticated_headers() -> dict[str, str]:
    email = f"dashboard_{uuid4().hex}@example.com"
    password = "Password123"

    register_response = client.post(
        "/users",
        json={
            "full_name": "Usuario Dashboard",
            "email": email,
            "password": password,
            "role": "user",
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/auth/login",
        data={
            "username": email,
            "password": password,
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}",
    }


def test_dashboard_endpoint():
    headers = create_authenticated_headers()

    response = client.get(
        "/dashboard",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert "total_customers" in data
    assert "total_opportunities" in data
    assert "total_pipeline_value" in data
    assert "won_value" in data
    assert "lost_value" in data
    assert "opportunities_by_stage" in data
    assert "pending_activities" in data
    assert "overdue_activities" in data
    assert "upcoming_activities" in data


def test_pipeline_endpoint():
    headers = create_authenticated_headers()

    response = client.get(
        "/pipeline",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert "prospect" in data
    assert "contacted" in data
    assert "proposal" in data
    assert "negotiation" in data
    assert "won" in data
    assert "lost" in data


def test_dashboard_requires_authentication():
    response = client.get("/dashboard")

    assert response.status_code == 401


def test_pipeline_requires_authentication():
    response = client.get("/pipeline")

    assert response.status_code == 401