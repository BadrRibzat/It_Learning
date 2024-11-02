#!/bin/bash

# Set the base URL for the API
BASE_URL="http://127.0.0.1:8000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print results
print_result() {
    if [ "$2" -eq 200 ] || [ "$2" -eq 201 ]; then
        echo -e "${GREEN}----------------------------------------"
        echo -e "✅ Endpoint: $1"
        echo -e "Status Code: $2"
        echo -e "Response: $3${NC}"
    else
        echo -e "${RED}----------------------------------------"
        echo -e "❌ Endpoint: $1"
        echo -e "Status Code: $2"
        echo -e "Response: $3${NC}"
    fi
    echo "----------------------------------------"
}

# Test registration
echo "Testing Registration..."
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/register/" -H "Content-Type: application/json" -d '{"username": "testuser", "email": "testuser@example.com", "password": "testpassword", "password_confirmation": "testpassword"}')
status_code=${response: -3}
body=${response:0:${#response}-3}
print_result "Register User" "$status_code" "$body"

# Test login
echo "Testing Login..."
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/login/" -H "Content-Type: application/json" -d '{"email": "testuser@example.com", "password": "testpassword"}')
status_code=${response: -3}
body=${response:0:${#response}-3}
print_result "Login" "$status_code" "$body"

# Extract the access token
ACCESS_TOKEN=$(echo $body | jq -r '.access')

# Test user profile
echo "Testing User Profile..."
response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/profile/" -H "Authorization: Bearer $ACCESS_TOKEN")
status_code=${response: -3}
body=${response:0:${#response}-3}
print_result "Get User Profile" "$status_code" "$body"

# Test user statistics
echo "Testing User Statistics..."
response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/statistics/" -H "Authorization: Bearer $ACCESS_TOKEN")
status_code=${response: -3}
body=${response:0:${#response}-3}
print_result "Get User Statistics" "$status_code" "$body"

# Test lessons
echo "Testing Lessons..."
response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/lessons/" -H "Authorization: Bearer $ACCESS_TOKEN")
status_code=${response: -3}
body=${response:0:${#response}-3}
print_result "Get Lessons" "$status_code" "$body"

# Test flashcards
echo "Testing Flashcards..."
response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/flashcards/" -H "Authorization: Bearer $ACCESS_TOKEN")
status_code=${response: -3}
body=${response:0:${#response}-3}
print_result "Get Flashcards" "$status_code" "$body"

# Test quizzes
echo "Testing Quizzes..."
response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/quizzes/" -H "Authorization: Bearer $ACCESS_TOKEN")
status_code=${response: -3}
body=${response:0:${#response}-3}
print_result "Get Quizzes" "$status_code" "$body"

# Test level tests
echo "Testing Level Tests..."
response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/level-tests/" -H "Authorization: Bearer $ACCESS_TOKEN")
status_code=${response: -3}
body=${response:0:${#response}-3}
print_result "Get Level Tests" "$status_code" "$body"

# Test user progress
echo "Testing User Progress..."
response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/user-progress/" -H "Authorization: Bearer $ACCESS_TOKEN")
status_code=${response: -3}
body=${response:0:${#response}-3}
print_result "Get User Progress" "$status_code" "$body"

# Test recommended lessons
echo "Testing Recommended Lessons..."
response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/recommended-lessons/" -H "Authorization: Bearer $ACCESS_TOKEN")
status_code=${response: -3}
body=${response:0:${#response}-3}
print_result "Get Recommended Lessons" "$status_code" "$body"

# Test chatbot
echo "Testing Chatbot..."
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/chat/" -H "Content-Type: application/json" -H "Authorization: Bearer $ACCESS_TOKEN" -d '{"input": "Hello"}')
status_code=${response: -3}
body=${response:0:${#response}-3}
print_result "Chatbot Interaction" "$status_code" "$body"

# Test logout
echo "Testing Logout..."
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/logout/" -H "Authorization: Bearer $ACCESS_TOKEN")
status_code=${response: -3}
body=${response:0:${#response}-3}
print_result "Logout" "$status_code" "$body"

# Test accessing a protected endpoint after logout
echo "Testing Protected Endpoint After Logout..."
response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/profile/" -H "Authorization: Bearer $ACCESS_TOKEN")
status_code=${response: -3}
body=${response:0:${#response}-3}
print_result "Access Protected Endpoint After Logout" "$status_code" "$body"

echo "All tests completed."
