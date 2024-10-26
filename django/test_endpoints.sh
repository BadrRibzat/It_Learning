#!/bin/bash

# Set the base URL
BASE_URL="http://localhost:8000/api"

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Function to refresh token
refresh_token() {
    local refresh_response=$(curl -s -X POST "$BASE_URL/token/refresh/" \
         -H "Content-Type: application/json" \
         -d "{\"refresh\": \"$REFRESH_TOKEN\"}")
    ACCESS_TOKEN=$(echo $refresh_response | jq -r .access)
    if [ -z "$ACCESS_TOKEN" ]; then
        handle_error "Failed to refresh token"
    fi
}

# Test Authentication Endpoints
echo "Testing Authentication Endpoints..."

# Register a new user
echo "Registering a new user..."
register_response=$(curl -s -X POST "$BASE_URL/register/" \
     -H "Content-Type: application/json" \
     -d '{"username": "Kilwa", "email": "kilwa@example.com", "password": "kilwapassword"}')
echo $register_response

# Login
echo "Logging in..."
login_response=$(curl -s -X POST "$BASE_URL/login/" \
     -H "Content-Type: application/json" \
     -d '{"username": "Kilwa", "email": "kilwa@example.com", "password": "kilwapassword"}')
ACCESS_TOKEN=$(echo $login_response | jq -r .access)
REFRESH_TOKEN=$(echo $login_response | jq -r .refresh)
USER_ID=$(echo $login_response | jq -r .user.id)

if [ -z "$ACCESS_TOKEN" ]; then
    handle_error "Failed to obtain access token"
fi

# Test User Profile Management
echo "Testing User Profile Management..."

# Get user profile
echo "Getting user profile..."
curl -s -X GET "$BASE_URL/profile/" \
     -H "Authorization: Bearer $ACCESS_TOKEN"

# Get user statistics
echo "Getting user statistics..."
curl -s -X GET "$BASE_URL/statistics/" \
     -H "Authorization: Bearer $ACCESS_TOKEN"

# Upload profile picture
echo "Uploading profile picture..."
curl -s -X POST "$BASE_URL/upload-profile-picture/" \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -F "image=@./test_image.jpg"

# Test Password Management
echo "Testing Password Management..."

# Request password reset
echo "Requesting password reset..."
curl -s -X POST "$BASE_URL/password-reset/" \
     -H "Content-Type: application/json" \
     -d '{"email": "kilwa@example.com"}'

# Test Level Management
echo "Testing Level Management..."

# Get all levels
echo "Getting all levels..."
levels_response=$(curl -s -X GET "$BASE_URL/levels/" \
     -H "Authorization: Bearer $ACCESS_TOKEN")

# Get specific level
LEVEL_ID=1
echo "Getting level $LEVEL_ID..."
curl -s -X GET "$BASE_URL/levels/$LEVEL_ID/" \
     -H "Authorization: Bearer $ACCESS_TOKEN"

# Test Lesson Management
echo "Testing Lesson Management..."

# Get all lessons
echo "Getting all lessons..."
lessons_response=$(curl -s -X GET "$BASE_URL/lessons/" \
     -H "Authorization: Bearer $ACCESS_TOKEN")

# Get recommended lessons
echo "Getting recommended lessons..."
curl -s -X GET "$BASE_URL/recommended-lessons/" \
     -H "Authorization: Bearer $ACCESS_TOKEN"

# Update current lesson
echo "Updating current lesson..."
curl -s -X POST "$BASE_URL/update-current-lesson/" \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"lesson_id": 1}'

# Test Flashcard Management
echo "Testing Flashcard Management..."

# Get flashcards for lesson
LESSON_ID=1
echo "Getting flashcards for lesson $LESSON_ID..."
curl -s -X GET "$BASE_URL/flashcards/?lesson=$LESSON_ID" \
     -H "Authorization: Bearer $ACCESS_TOKEN"

# Submit flashcard progress
echo "Submitting flashcard progress..."
curl -s -X POST "$BASE_URL/user-flashcard-progress/" \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d "{\"flashcard\": 1, \"is_correct\": true}"

# Test Quiz Management
echo "Testing Quiz Management..."

# Get quizzes
echo "Getting quizzes..."
curl -s -X GET "$BASE_URL/quizzes/" \
     -H "Authorization: Bearer $ACCESS_TOKEN"

# Get quiz questions
echo "Getting quiz questions..."
curl -s -X GET "$BASE_URL/quiz-questions/" \
     -H "Authorization: Bearer $ACCESS_TOKEN"

# Submit quiz attempt
echo "Submitting quiz attempt..."
curl -s -X POST "$BASE_URL/user-quiz-attempts/" \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d "{\"quiz\": 1, \"score\": 85, \"total_questions\": 10, \"correct_answers\": 8}"

# Test Level Tests
echo "Testing Level Tests..."

# Get level tests
echo "Getting level tests..."
curl -s -X GET "$BASE_URL/level-tests/" \
     -H "Authorization: Bearer $ACCESS_TOKEN"

# Submit level test
echo "Submitting level test..."
curl -s -X POST "$BASE_URL/level-test-submit/1/" \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"score": 90, "total_questions": 1, "correct_answers": 1}'

# Test Note Management
echo "Testing Note Management..."

# Create note
echo "Creating note..."
note_response=$(curl -s -X POST "$BASE_URL/notes/" \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"content": "Test note", "note_type": "vocabulary"}')
NOTE_ID=$(echo $note_response | jq -r .id)

# Get notes
echo "Getting notes..."
curl -s -X GET "$BASE_URL/notes/" \
     -H "Authorization: Bearer $ACCESS_TOKEN"

# Update note
echo "Updating note..."
curl -s -X PUT "$BASE_URL/notes/$NOTE_ID/" \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"content": "Updated test note", "note_type": "vocabulary"}'

# Delete note
echo "Deleting note..."
curl -s -X DELETE "$BASE_URL/notes/$NOTE_ID/" \
     -H "Authorization: Bearer $ACCESS_TOKEN"

# Test Progress Management
echo "Testing Progress Management..."

# Get user progress
echo "Getting user progress..."
curl -s -X GET "$BASE_URL/user-progress/" \
     -H "Authorization: Bearer $ACCESS_TOKEN"

# Reset progress
echo "Resetting progress..."
curl -s -X POST "$BASE_URL/reset-progress/" \
     -H "Authorization: Bearer $ACCESS_TOKEN"

# Test Chatbot
echo "Testing Chatbot..."

# Authenticated chat
echo "Testing authenticated chat..."
curl -s -X POST "$BASE_URL/chatbot/" \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d "{\"input\": \"Hello\"}"

# Anonymous chat
echo "Testing anonymous chat..."
curl -s -X POST "$BASE_URL/chatbot/" \
     -H "Content-Type: application/json" \
     -d '{"input": "Hi"}'

# Logout
echo "Logging out..."
curl -s -X POST "$BASE_URL/logout/" \
     -H "Authorization: Bearer $ACCESS_TOKEN"

echo "Test script completed."
