import pytest
from httpx import AsyncClient
import uuid
import logging
from PIL import Image
import io
import os
from datetime import datetime

logger = logging.getLogger(__name__)

@pytest.fixture
def test_image():
    """Create a test image for profile tests"""
    img = Image.new('RGB', (100, 100), color='red')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    return img_byte_arr

@pytest.fixture
def test_upload_dir():
    """Setup and cleanup test upload directory"""
    test_dir = os.path.join('uploads', 'profile_pictures', 'test')
    os.makedirs(test_dir, exist_ok=True)
    yield test_dir
    # Cleanup test files
    for file in os.listdir(test_dir):
        if file != '.gitkeep':
            os.remove(os.path.join(test_dir, file))

@pytest.mark.asyncio
class TestProfile:
    async def test_get_profile(self, client, authenticated_user):
        """Test getting user profile"""
        response = await client.get(
            "/profile/profile",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "profile_data" in data
        assert "learning_stats" in data
        assert data["profile_data"]["email"] == authenticated_user["email"]

    async def test_update_profile(self, client, authenticated_user):
        """Test profile update"""
        update_data = {
            "full_name": "Updated Name",
            "bio": "Test bio",
            "preferred_language": "fr"
        }
        response = await client.put(
            "/profile/update",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"},
            json=update_data
        )
        assert response.status_code == 200

        # Verify changes
        profile = await client.get(
            "/profile/profile",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"}
        )
        profile_data = profile.json()["profile_data"]
        assert profile_data["full_name"] == update_data["full_name"]
        assert profile_data["bio"] == update_data["bio"]
        assert profile_data["preferred_language"] == update_data["preferred_language"]

    async def test_upload_profile_picture(self, client, authenticated_user, test_image, test_upload_dir):
        """Test profile picture upload"""
        # Ensure test image is at start
        test_image.seek(0)
    
        files = {
            "file": ("test.png", test_image, "image/png")
        }
    
        headers = {
            "Authorization": f"Bearer {authenticated_user['token']}"
        }
    
        response = await client.post(
            "/profile/upload-picture",
            headers=headers,
            files=files
        )
    
        assert response.status_code == 200, f"Response: {response.text}"
        data = response.json()
        assert "message" in data
        assert "profile_picture" in data
        assert data["message"] == "Profile picture updated successfully"
        assert isinstance(data["profile_picture"], str)

    async def test_get_learning_stats(self, client, authenticated_user):
        """Test learning statistics"""
        response = await client.get(
            "/profile/statistics",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"}
        )
        assert response.status_code == 200
        assert all(key in response.json() for key in [
            "total_points", "rank", "completed_lessons", "achievements"
        ])

    async def test_get_activity_feed(self, client, authenticated_user):
        """Test activity feed"""
        response = await client.get(
            "/profile/activity",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "activities" in data
        assert "summary" in data

    async def test_get_points_info(self, client, authenticated_user):
        """Test points information"""
        response = await client.get(
            "/profile/points",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert all(key in data for key in [
            "total_points", "current_rank", "points_history"
        ])

    async def test_unauthorized_access(self, client):
        """Test unauthorized access"""
        endpoints = [
            "/profile/profile",
            "/profile/statistics",
            "/profile/activity",
            "/profile/points",
        ]
        for endpoint in endpoints:
            response = await client.get(endpoint)
            assert response.status_code == 401

    async def test_delete_account(self, client, 
    authenticated_user, test_image, test_upload_dir):
        """Test account deletion"""
        # Create some test data first
        update_data = {
            "full_name": "Updated Name",
            "bio": "Test bio",
            "preferred_language": "fr"
        }
        await client.put(
            "/profile/update",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"},
            json=update_data
        )

        # Upload profile picture
        files = {
            "file": ("test.png", test_image.getvalue(), "image/png")
        }
        await client.post(
            "/profile/upload-picture",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"},
            files=files
        )

        # Delete account
        response = await client.delete(
            "/profile/delete",
            headers={"Authorization": f"Bearer {authenticated_user['token']}"}
        )
        assert response.status_code == 200

        # Verify account is deleted
        login_response = await client.post(
            "/auth/login",
            json={
                "email": authenticated_user["email"],
                "password": "Testpassword1!"
            }
        )
        assert login_response.status_code == 401
