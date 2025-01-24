import pytest
from httpx import AsyncClient
from run import create_app
import json
from httpx import ASGITransport
from asgiref.wsgi import WsgiToAsgi

@pytest.fixture(scope="module")
def app():
    flask_app = create_app()
    return WsgiToAsgi(flask_app)

@pytest.fixture(scope="function")
async def client(app):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client
    # Cleanup after test
    from utils.db import get_db
    db = get_db()
    db.users.delete_many({})
    db.profiles.delete_many({})
    db.lessons.delete_many({})
    db.lessons_progress.delete_many({})

@pytest.fixture(scope="function")
async def auth_token(client):
    # Register a user first
    register_response = await client.post(
        "/auth/register",
        json={
            "email": "testprofile@example.com",
            "password": "testpassword",
            "confirm_password": "testpassword",
            "full_name": "Test User",
            "current_language": "en"
        }
    )

    # Login the user to obtain an access token
    login_response = await client.post(
        "/auth/login",
        json={"email": "testprofile@example.com", "password": "testpassword"}
    )
    access_token = login_response.json()["access_token"]
    return access_token


@pytest.mark.asyncio
async def test_get_profile_success(client, auth_token):
    response = await client.get(
        "/profile/profile",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    assert "profile_data" in response.json()
    assert "statistics" in response.json()
    assert "message" in response.json()
    # Assuming 'profile_data' and 'statistics' are dictionaries, check for keys based on likely profile structure
    # Example: assert "email" in response.json()["profile_data"]


@pytest.mark.asyncio
async def test_get_profile_fail_unauthorized(client):
    response = await client.get(
        "/profile/profile",
    )
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_update_profile_success(client, auth_token):
    response = await client.put(
        "/profile/update",
        headers={"Authorization": f"Bearer {auth_token}"},
         json={
           "bio": "Updated Bio",
           "preferred_language": "fr",
            "profile_picture": "https://example.com/updated.jpg"
        }
    )
    assert response.status_code == 200
    assert "message" in response.json()

@pytest.mark.asyncio
async def test_update_profile_fail_unauthorized(client):
    response = await client.put(
        "/profile/update",
        json={
           "bio": "Updated Bio",
           "preferred_language": "fr",
            "profile_picture": "https://example.com/updated.jpg"
        }
    )
    assert response.status_code == 401
