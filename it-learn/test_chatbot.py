import pytest
from httpx import AsyncClient
from run import create_app
from httpx import ASGITransport
from asgiref.wsgi import WsgiToAsgi
from datetime import datetime, timezone
from bson import ObjectId

@pytest.fixture(scope="module")
def app():
    flask_app = create_app()
    return WsgiToAsgi(flask_app)

@pytest.fixture(scope="function")
async def client(app):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client

@pytest.mark.asyncio
async def test_chatbot_success(client):
    response = await client.post(
        "/chatbot/chatbot",
        json={"input": "Hello"}
    )
    assert response.status_code == 200
    assert "response_text" in response.json()

@pytest.mark.asyncio
async def test_chatbot_fail_missing_input(client):
    response = await client.post(
        "/chatbot/chatbot",
        json={}
    )
    assert response.status_code == 400
    assert "error" in response.json()
