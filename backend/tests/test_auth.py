from uuid import uuid4

from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_register_user():
    unique_email = f"test_{uuid4().hex}@example.com"

    response = client.post(
        "/users",
        json={
            "full_name": "Usuario de Prueba",
            "email": unique_email,
            "password": "Password123",
            "role": "user",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["full_name"] == "Usuario de Prueba"
    assert data["email"] == unique_email
    assert data["role"] == "user"
    assert data["is_active"] is True
    assert "id" in data
    assert "created_at" in data
    assert "password" not in data


def test_login_user():
    unique_email = f"login_{uuid4().hex}@example.com"
    password = "Password123"

    register_response = client.post(
        "/users",
        json={
            "full_name": "Usuario Login",
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

    data = login_response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_with_incorrect_password():
    unique_email = f"wrong_password_{uuid4().hex}@example.com"

    register_response = client.post(
        "/users",
        json={
            "full_name": "Usuario Contraseña Incorrecta",
            "email": unique_email,
            "password": "Password123",
            "role": "user",
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/auth/login",
        data={
            "username": unique_email,
            "password": "IncorrectPassword123",
        },
    )

    assert login_response.status_code == 401

    data = login_response.json()

    assert "detail" in data


def test_register_duplicate_email():
    unique_email = f"duplicate_{uuid4().hex}@example.com"

    user_data = {
        "full_name": "Usuario Duplicado",
        "email": unique_email,
        "password": "Password123",
        "role": "user",
    }

    first_response = client.post(
        "/users",
        json=user_data,
    )

    second_response = client.post(
        "/users",
        json=user_data,
    )

    assert first_response.status_code == 201
    assert second_response.status_code == 409

    data = second_response.json()

    assert "detail" in data