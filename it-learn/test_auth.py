import pytest
from httpx import AsyncClient, ASGITransport, Response
from run import create_app
from asgiref.wsgi import WsgiToAsgi
import uuid
import json
from bson import ObjectId
import redis
from config import config
from flask_jwt_extended import get_jwt
from functools import wraps

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)


def json_dumps(response: Response):
    response.json = lambda: json.loads(CustomJSONEncoder().encode(response.json()))
    return response


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
    db.revoked_tokens.delete_many({})
    db.profiles.delete_many({})
    db.lessons_progress.delete_many({})
    db.level_test_submissions.delete_many({})

@pytest.fixture(scope="function")
def unique_email():
    """Generate a unique email address for testing"""
    return f"test_{uuid.uuid4()}@example.com"

async def create_test_user(client, email=None, password="Testpassword1!"):
    if not email:
        email = f"test_{uuid.uuid4()}@example.com"
    response = await client.post(
        "/auth/register",
        json={
            "email": email,
            "password": password,
            "confirm_password": password,
            "full_name": "Test User",
            "current_language": "en"
        }
    )
    response.raise_for_status()
    return response.json()["user"]["id"]

async def delete_test_user(client, user_id, access_token=None):
    if access_token:
        # Simply send the delete request; no need to handle JWT here
        response = await client.delete(
            "/auth/delete",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        response.raise_for_status()
    else:
        response = await client.delete(
            "/auth/delete",
        )
        response.raise_for_status()

async def login_test_user(client, email=None, password="Testpassword1!"):
    # Register a user first
    if not email:
        email = f"test_{uuid.uuid4()}@example.com"
    user_id = await create_test_user(client, email)
    login_response = await client.post(
        "/auth/login",
        json={"email": email, "password": password}
    )
    login_response.raise_for_status()
    access_token = login_response.json()["access_token"]
    return user_id, access_token

def process_response(response: Response):
  response.json = lambda: json.loads(CustomJSONEncoder().encode(response.json()))
  return response

@pytest.mark.asyncio
async def test_register_success(client, unique_email):
    response = await client.post(
        "/auth/register",
        json={
            "email": unique_email,
            "password": "Testpassword1!",
            "confirm_password": "Testpassword1!",
            "full_name": "Test User",
            "current_language": "en"
        }
    )
    assert response.status_code == 200
    assert "user" in response.json()

@pytest.mark.asyncio
async def test_register_fail_password_mismatch(client):
    response = await client.post(
         "/auth/register",
        json={
          "email": "test@example.com",
          "password": "testpassword1!",
          "confirm_password": "different_password",
          "full_name": "Test User"
        }
    )
    assert response.status_code == 400
    assert "error" in response.json()

@pytest.mark.asyncio
async def test_register_fail_missing_fields(client):
    response = await client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword1!",
            "confirm_password": "testpassword",
        }
    )
    assert response.status_code == 400
    assert "error" in response.json()

@pytest.mark.asyncio
async def test_register_fail_invalid_email(client):
    response = await client.post(
         "/auth/register",
        json={
          "email": "invalid-email",
          "password": "testpassword1!",
          "confirm_password": "testpassword",
          "full_name": "Test User"
        }
    )
    assert response.status_code == 400
    assert "error" in response.json()

@pytest.mark.asyncio
async def test_login_success(client, unique_email):
    # Register a user first
    user_id = await create_test_user(client, unique_email)

    response = await client.post(
        "/auth/login",
        json={"email": unique_email, "password": "Testpassword1!"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    
    # Pass the access token to delete_test_user
    access_token = response.json()["access_token"]
    await delete_test_user(client, user_id, access_token=access_token)

@pytest.mark.asyncio
async def test_login_fail_invalid_credentials(client):
    response = await client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert "error" in response.json()

@pytest.mark.asyncio
async def test_login_fail_non_existent_user(client):
    response = await client.post(
        "/auth/login",
        json={"email": "nonexistent@example.com", "password": "testpassword"}
    )
    assert response.status_code == 401
    assert "error" in response.json()

@pytest.mark.asyncio
async def test_logout_success(client, unique_email):
    # Register with complete data
    response = await client.post(
        "/auth/register",
        json={
            "email": unique_email,
            "password": "Testpassword1!",
            "confirm_password": "Testpassword1!",
            "full_name": "Test User",
            "current_language": "en"
        }
    )
    user_id = response.json()["user"]["id"]
    
    # Login
    login_response = await client.post(
        "/auth/login",
        json={"email": unique_email, "password": "Testpassword1!"}
    )
    access_token = login_response.json()["access_token"]
    
    # Logout
    logout_response = await client.post(
        "/auth/logout",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert logout_response.status_code == 200

@pytest.mark.asyncio
async def test_delete_account_success(client, unique_email):
    # Register a user first with explicit password
    response = await client.post(
        "/auth/register",
        json={
            "email": unique_email,
            "password": "Testpassword1!",
            "confirm_password": "Testpassword1!",
            "full_name": "Test User",
            "current_language": "en"
        }
    )
    user_id = response.json()["user"]["id"]
    
    # Login with correct credentials
    login_response = await client.post(
        "/auth/login",
        json={"email": unique_email, "password": "Testpassword1!"}
    )
    access_token = login_response.json()["access_token"]
    
    # Delete account
    response = await client.delete(
        "/auth/delete",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_delete_account_fail_unauthorized(client):
    response = await client.delete(
        "/auth/delete",
    )
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_delete_account_token_invalidation(client, unique_email):
    user_id, access_token = await login_test_user(client, unique_email)

    delete_response = await client.delete(
        "/auth/delete",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert delete_response.status_code == 200

    
    profile_response = await client.get(
        "/profile/profile",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert profile_response.status_code == 401
    
@pytest.mark.asyncio
async def test_logout_token_invalidation(client, unique_email):
    user_id, access_token = await login_test_user(client, unique_email)

    logout_response = await client.post(
        "/auth/logout",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert logout_response.status_code == 200

    # Try to use the token again on a protected endpoint
    profile_response = await client.get(
        "/profile/profile",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert profile_response.status_code == 401
