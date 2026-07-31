from uuid import uuid4

from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def create_authenticated_user():
    unique_email = f"customer_user_{uuid4().hex}@example.com"
    password = "Password123"

    register_response = client.post(
        "/users",
        json={
            "full_name": "Usuario Clientes",
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


def test_customer_crud():
    headers = create_authenticated_user()
    unique_email = f"customer_{uuid4().hex}@example.com"

    create_response = client.post(
        "/customers",
        headers=headers,
        json={
            "company_name": "Titan Industries",
            "contact_name": "Carlos Mendoza",
            "email": unique_email,
            "phone": "+51 999 888 777",
            "is_active": True,
        },
    )

    assert create_response.status_code == 201

    created_customer = create_response.json()
    customer_id = created_customer["id"]

    assert created_customer["company_name"] == "Titan Industries"
    assert created_customer["contact_name"] == "Carlos Mendoza"
    assert created_customer["email"] == unique_email
    assert created_customer["is_active"] is True

    list_response = client.get(
        "/customers",
        headers=headers,
    )

    assert list_response.status_code == 200
    assert any(
        customer["id"] == customer_id
        for customer in list_response.json()
    )

    get_response = client.get(
        f"/customers/{customer_id}",
        headers=headers,
    )

    assert get_response.status_code == 200
    assert get_response.json()["id"] == customer_id

    update_response = client.patch(
        f"/customers/{customer_id}",
        headers=headers,
        json={
            "company_name": "Titan Industries SAC",
            "phone": "+51 900 111 222",
            "is_active": False,
        },
    )

    assert update_response.status_code == 200

    updated_customer = update_response.json()

    assert updated_customer["company_name"] == "Titan Industries SAC"
    assert updated_customer["phone"] == "+51 900 111 222"
    assert updated_customer["is_active"] is False

    delete_response = client.delete(
        f"/customers/{customer_id}",
        headers=headers,
    )

    assert delete_response.status_code == 204

    missing_response = client.get(
        f"/customers/{customer_id}",
        headers=headers,
    )

    assert missing_response.status_code == 404