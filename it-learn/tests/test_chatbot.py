import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
class TestChatbot:
    async def test_chat_basic(self, client):
        """Test basic chat functionality"""
        response = await client.post(
            "/chatbot/chat",
            json={
                "input": "What does the ls command do?",
                "preferred_format": "detailed"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert all(key in data for key in [
            "response_text", "command_details", "related_commands",
            "learning_tips", "conversation_id"
        ])

    async def test_chat_validation(self, client):
        """Test chat input validation"""
        # Test empty input
        response = await client.post(
            "/chatbot/chat",
            json={
                "preferred_format": "detailed"
            }
        )
        assert response.status_code == 400

        # Test invalid format
        response = await client.post(
            "/chatbot/chat",
            json={
                "input": "ls command",
                "preferred_format": "invalid"
            }
        )
        assert response.status_code == 400

        # Test too long input
        response = await client.post(
            "/chatbot/chat",
            json={
                "input": "?" * 1000,
                "preferred_format": "detailed"
            }
        )
        assert response.status_code == 400

    async def test_chat_context(self, client):
        """Test chat context maintenance"""
        # First question
        response1 = await client.post(
            "/chatbot/chat",
            json={
                "input": "What is the ls command?",
                "preferred_format": "detailed"
            }
        )
        assert response1.status_code == 200
        conversation_id = response1.json()["conversation_id"]

        # Follow-up question with context
        response2 = await client.post(
            "/chatbot/chat",
            json={
                "input": "What about its -l option?",
                "context": conversation_id,
                "preferred_format": "detailed"
            }
        )
        assert response2.status_code == 200
        assert "long format" in response2.json()["response_text"].lower()

    async def test_response_format(self, client):
        """Test different response formats"""
        # Test detailed format
        detailed_response = await client.post(
            "/chatbot/chat",
            json={
                "input": "explain cd command",
                "preferred_format": "detailed"
            }
        )
        assert detailed_response.status_code == 200
        
        # Test concise format
        concise_response = await client.post(
            "/chatbot/chat",
            json={
                "input": "explain cd command",
                "preferred_format": "concise"
            }
        )
        assert concise_response.status_code == 200
        assert len(concise_response.json()["response_text"]) < len(detailed_response.json()["response_text"])
