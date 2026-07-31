from uuid import uuid4

from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def create_authenticated_user():
    unique_email = f"opportunity_user_{uuid4().hex}@example.com"
    password = "Password123"

    register_response = client.post(
        "/users",
        json={
            "full_name": "Usuario Oportunidades",
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
    unique_email = f"opportunity_customer_{uuid4().hex}@example.com"

    response = client.post(
        "/customers",
        headers=headers,
        json={
            "company_name": "Titan Opportunities SAC",
            "contact_name": "María Torres",
            "email": unique_email,
            "phone": "+51 999 123 456",
            "is_active": True,
        },
    )

    assert response.status_code == 201

    return response.json()["id"]


def test_opportunity_crud():
    headers = create_authenticated_user()
    customer_id = create_test_customer(headers)

    create_response = client.post(
        "/opportunities",
        headers=headers,
        json={
            "title": "Proyecto de automatización industrial",
            "value": "35000.00",
            "stage": "prospect",
            "customer_id": customer_id,
        },
    )

    assert create_response.status_code == 201

    created_opportunity = create_response.json()
    opportunity_id = created_opportunity["id"]

    assert created_opportunity["title"] == "Proyecto de automatización industrial"
    assert created_opportunity["value"] == "35000.00"
    assert created_opportunity["stage"] == "prospect"
    assert created_opportunity["customer_id"] == customer_id

    list_response = client.get(
        "/opportunities",
        headers=headers,
    )

    assert list_response.status_code == 200
    assert any(
        opportunity["id"] == opportunity_id
        for opportunity in list_response.json()
    )

    customer_opportunities_response = client.get(
        f"/opportunities/customer/{customer_id}",
        headers=headers,
    )

    assert customer_opportunities_response.status_code == 200
    assert any(
        opportunity["id"] == opportunity_id
        for opportunity in customer_opportunities_response.json()
    )

    get_response = client.get(
        f"/opportunities/{opportunity_id}",
        headers=headers,
    )

    assert get_response.status_code == 200
    assert get_response.json()["id"] == opportunity_id

    update_response = client.patch(
        f"/opportunities/{opportunity_id}",
        headers=headers,
        json={
            "title": "Proyecto de automatización aprobado",
            "value": "42000.00",
            "stage": "won",
        },
    )

    assert update_response.status_code == 200

    updated_opportunity = update_response.json()

    assert updated_opportunity["title"] == "Proyecto de automatización aprobado"
    assert updated_opportunity["value"] == "42000.00"
    assert updated_opportunity["stage"] == "won"

    delete_response = client.delete(
        f"/opportunities/{opportunity_id}",
        headers=headers,
    )

    assert delete_response.status_code == 204

    missing_response = client.get(
        f"/opportunities/{opportunity_id}",
        headers=headers,
    )

    assert missing_response.status_code == 404