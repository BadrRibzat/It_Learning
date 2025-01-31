import pytest
from httpx import AsyncClient
import uuid
import logging
from datetime import datetime, UTC

logger = logging.getLogger(__name__)

# Test data
TEST_PASSWORD = "Testpassword1!"
TEST_USER_DATA = {
    "password": TEST_PASSWORD,
    "confirm_password": TEST_PASSWORD,
    "full_name": "Test User",
    "date_of_birth": "1990-01-01",
    "current_language": "en"
}

@pytest.fixture
def unique_email():
    """Generate unique test email"""
    return f"test_{uuid.uuid4()}@example.com"

@pytest.fixture
async def authenticated_user(client, unique_email):
    """Create and authenticate a test user"""
    # Register user
    register_response = await client.post(
        "/auth/register",
        json={
            "email": unique_email,
            **TEST_USER_DATA
        }
    )
    assert register_response.status_code == 200
    user_id = register_response.json()["user"]["id"]

    # Login user
    login_response = await client.post(
        "/auth/login",
        json={
            "email": unique_email,
            "password": TEST_PASSWORD
        }
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    return {
        "user_id": user_id,
        "email": unique_email,
        "token": token
    }

@pytest.mark.asyncio
class TestAuthentication:
    async def test_register_success(self, client, unique_email):
        """Test successful user registration"""
        response = await client.post(
            "/auth/register",
            json={
                "email": unique_email,
                **TEST_USER_DATA
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        assert all(key in data["user"] for key in ["id", "email"])
        assert data["user"]["email"] == unique_email

    async def test_register_duplicate_email(self, client, unique_email, authenticated_user):
        """Test registration with existing email"""
        response = await client.post(
            "/auth/register",
            json={
                "email": unique_email,
                **TEST_USER_DATA
            }
        )
        assert response.status_code == 400
        assert "exists" in response.json()["error"].lower()

    async def test_login_success(self, client, authenticated_user):
        """Test successful login"""
        response = await client.post(
            "/auth/login",
            json={
                "email": authenticated_user["email"],
                "password": TEST_PASSWORD
            }
        )
        assert response.status_code == 200
        assert "access_token" in response.json()
        assert "message" in response.json()
        assert response.json()["message"] == "Login successful"

    async def test_login_invalid_credentials(self, client, authenticated_user):
        """Test login with invalid credentials"""
        # Test wrong password
        response = await client.post(
            "/auth/login",
            json={
                "email": authenticated_user["email"],
                "password": "WrongPassword1!"
            }
        )
        assert response.status_code == 401

        # Test non-existent email
        response = await client.post(
            "/auth/login",
            json={
                "email": f"nonexistent_{authenticated_user['email']}",
                "password": TEST_PASSWORD
            }
        )
        assert response.status_code == 401

    async def test_logout_success(self, client, authenticated_user):
        """Test successful logout"""
        response = await client.post(
            "/auth/logout",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"}
        )
        assert response.status_code == 200
        assert response.json()["message"] == "Logout successful"

        # Verify token is invalidated
        profile_response = await client.get(
            "/profile/profile",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"}
        )
        assert profile_response.status_code == 401

    async def test_token_refresh(self, client, authenticated_user):
        """Test token refresh functionality"""
        response = await client.post(
            "/auth/refresh",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"}
        )
        assert response.status_code == 200
        assert "access_token" in response.json()
        assert response.json()["access_token"] != authenticated_user["token"]

    async def test_validation_errors(self, client):
        """Test registration validation errors"""
        test_cases = [
            {
                "case": "invalid_email",
                "data": {**TEST_USER_DATA, "email": "invalid-email"},
                "expected_error": "email"
            },
            {
                "case": "short_password",
                "data": {
                    **TEST_USER_DATA,
                    "email": f"test_{uuid.uuid4()}@example.com",
                    "password": "short",
                    "confirm_password": "short"
                },
                "expected_error": "password"
            }
        ]

        for test_case in test_cases:
            response = await client.post(
                "/auth/register",
                json=test_case["data"]
            )
            assert response.status_code == 400
            assert test_case["expected_error"] in response.json()["error"].lower()

    async def test_account_lockout(self, client, authenticated_user):
        """Test account lockout after multiple failed attempts"""
        # Attempt multiple failed logins
        for _ in range(5):
            await client.post(
                "/auth/login",
                json={
                    "email": authenticated_user["email"],
                    "password": "WrongPassword1!"
                }
            )

        # Verify account is locked
        response = await client.post(
            "/auth/login",
            json={
                "email": authenticated_user["email"],
                "password": TEST_PASSWORD
            }
        )
        assert response.status_code == 401
        assert "locked" in response.json()["error"].lower()
