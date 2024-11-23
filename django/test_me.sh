#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Base URL
BASE_URL="http://localhost:8000"

# Test user credentials
USERNAME="testuser"
EMAIL="testuser@example.com"
PASSWORD="TestPassword123!"

# Function to check response
check_response() {
    if [ $1 -eq 0 ] && [ $2 -eq $3 ]; then
        echo -e "${GREEN}✓ $4${NC}"
        return 0
    else
        echo -e "${RED}✗ $4 (Expected: $3, Got: $2)${NC}"
        return 1
    fi
}

# Function to make HTTP requests with token
make_request() {
    if [ -n "$3" ]; then
        curl -s -X $1 -H "Authorization: Bearer $ACCESS_TOKEN" -H "Content-Type: application/json" -d "$3" $2
    else
        curl -s -X $1 -H "Authorization: Bearer $ACCESS_TOKEN" -H "Content-Type: application/json" $2
    fi
}

echo "Starting comprehensive endpoint tests..."

# 2. User Registration and Verification
echo "Testing user registration and verification..."
REGISTER_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "{
    \"username\": \"$USERNAME\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"password_confirmation\": \"$PASSWORD\",
    \"language\": \"en\"
}" $BASE_URL/accounts/register/)
check_response $? 201 201 "User registration"

# Request email verification
VERIFY_EMAIL_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "{
    \"email\": \"$EMAIL\"
}" $BASE_URL/accounts/verify-email/)
check_response $? 200 200 "Request email verification"

# 3. Password Reset Flow
echo "Testing password reset flow..."
RESET_REQUEST_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "{
    \"email\": \"$EMAIL\"
}" $BASE_URL/accounts/password-reset/)
check_response $? 200 200 "Password reset request"

# 4. User Login
echo "Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
}" $BASE_URL/accounts/login/)
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access":"[^"]*' | cut -d'"' -f4)
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"refresh":"[^"]*' | cut -d'"' -f4)
check_response $? 200 200 "User login"

# 5. Multi-Factor Authentication
echo "Testing MFA setup..."
MFA_SETUP_RESPONSE=$(make_request "POST" "$BASE_URL/accounts/mfa/setup/")
check_response $? 200 200 "MFA setup"

# 6. Profile Operations
echo "Testing profile operations..."
PROFILE_RESPONSE=$(make_request "GET" "$BASE_URL/accounts/profile/")
check_response $? 200 200 "Get profile"

# Update profile
UPDATE_PROFILE_RESPONSE=$(make_request "PUT" "$BASE_URL/accounts/profile/" "{
    \"username\": \"${USERNAME}_updated\",
    \"bio\": \"Test bio\"
}")
check_response $? 200 200 "Update profile"

# Upload profile picture
echo "Testing profile picture operations..."
PICTURE_RESPONSE=$(curl -s -X POST -H "Authorization: Bearer $ACCESS_TOKEN" \
    -F "profile_picture=@test_image.jpg" \
    "$BASE_URL/accounts/upload-profile-picture/")
check_response $? 200 200 "Upload profile picture"

# Delete profile picture
DELETE_PICTURE_RESPONSE=$(make_request "DELETE" "$BASE_URL/accounts/delete-profile-picture/")
check_response $? 200 200 "Delete profile picture"

# 7. Notes CRUD
echo "Testing notes operations..."
CREATE_NOTE_RESPONSE=$(make_request "POST" "$BASE_URL/accounts/notes/" "{
    \"title\": \"Test Note\",
    \"content\": \"This is a test note content\",
    \"note_type\": \"general\"
}")
NOTE_ID=$(echo $CREATE_NOTE_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
check_response $? 201 201 "Create note"

# Get notes
NOTES_RESPONSE=$(make_request "GET" "$BASE_URL/accounts/notes/")
check_response $? 200 200 "Get notes"

# Search notes
SEARCH_NOTES_RESPONSE=$(make_request "GET" "$BASE_URL/accounts/notes/search/?q=test")
check_response $? 200 200 "Search notes"

# Update note
UPDATE_NOTE_RESPONSE=$(make_request "PUT" "$BASE_URL/accounts/notes/$NOTE_ID/" "{
    \"title\": \"Updated Test Note\",
    \"content\": \"Updated test note content\",
    \"note_type\": \"vocabulary\"
}")
check_response $? 200 200 "Update note"

# Delete note
DELETE_NOTE_RESPONSE=$(make_request "DELETE" "$BASE_URL/accounts/notes/$NOTE_ID/")
check_response $? 204 204 "Delete note"

# 8. Learning Progress
echo "Testing learning progress..."

# Get levels
LEVELS_RESPONSE=$(make_request "GET" "$BASE_URL/lessons/levels/")
check_response $? 200 200 "Get levels"

# Get recommended lessons
RECOMMENDED_RESPONSE=$(make_request "GET" "$BASE_URL/accounts/recommended-lessons/")
check_response $? 200 200 "Get recommended lessons"

# Get user statistics
STATISTICS_RESPONSE=$(make_request "GET" "$BASE_URL/accounts/statistics/")
check_response $? 200 200 "Get user statistics"

# Submit flashcard answer
FLASHCARD_RESPONSE=$(make_request "POST" "$BASE_URL/lessons/flashcards/submit-answer/" "{
    \"flashcard_id\": 1,
    \"user_answer\": \"test\"
}")
check_response $? 200 200 "Submit flashcard answer"

# Submit quiz
QUIZ_RESPONSE=$(make_request "POST" "$BASE_URL/lessons/quizzes/submit-quiz/" "{
    \"quiz_id\": 1,
    \"answers\": [{\"question_id\": 1, \"user_answer\": \"test\"}]
}")
check_response $? 200 200 "Submit quiz"

# Submit level test
LEVEL_TEST_RESPONSE=$(make_request "POST" "$BASE_URL/lessons/level-tests/submit-test/" "{
    \"level_test_id\": 1,
    \"answers\": [{\"question_id\": 1, \"user_answer\": \"test\"}]
}")
check_response $? 200 200 "Submit level test"

# Get level test progress
LEVEL_TEST_PROGRESS=$(make_request "GET" "$BASE_URL/lessons/level-tests/progress/")
check_response $? 200 200 "Get level test progress"

# 9. Chatbot
echo "Testing chatbot..."
CHATBOT_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "{
    \"input\": \"Hello\"
}" $BASE_URL/chatbot/chatbot/)
check_response $? 200 200 "Chatbot interaction"

# 10. Reset Progress and Logout
echo "Testing final operations..."

# Get reset progress details
RESET_DETAILS_RESPONSE=$(make_request "GET" "$BASE_URL/accounts/reset-progress-details/")
check_response $? 200 200 "Get reset progress details"

# Reset progress
RESET_RESPONSE=$(make_request "POST" "$BASE_URL/accounts/reset-progress/")
check_response $? 200 200 "Reset progress"

# Logout
LOGOUT_RESPONSE=$(make_request "POST" "$BASE_URL/accounts/logout/" "{
    \"refresh_token\": \"$REFRESH_TOKEN\"
}")
check_response $? 200 200 "User logout"

echo "All tests completed!"
