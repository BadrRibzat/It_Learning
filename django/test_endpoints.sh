#!/bin/bash

# Comprehensive Endpoint Testing Script for Learn English Platform

# Color Codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BASE_URL="http://localhost:8000/api"
TEST_USERNAME="testuser_$(date +%s)"
TEST_EMAIL="test_${TEST_USERNAME}@example.com"
TEST_PASSWORD="StrongPass123!@$(date +%s)"
TEST_BIO="Test user bio"
TEST_NOTE_TITLE="Test Note"
TEST_NOTE_CONTENT="This is a test note content"

# Logging and Error Handling
log_success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

log_error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> endpoint_test_errors.log
}

log_info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Dependency Checks
check_dependencies() {
    local dependencies=("curl" "jq" "grep")
    for tool in "${dependencies[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log_error "$tool is not installed"
            exit 1
        fi
    done
}

# JSON Validation
validate_json() {
    echo "$1" | jq empty > /dev/null 2>&1
    return $?
}

# Server Availability Check
check_server() {
    if ! curl -s -f "$BASE_URL" > /dev/null; then
        log_error "Django server is not running or inaccessible"
        exit 1
    fi
    log_success "Server is running and accessible"
}

# User Registration Test
test_user_registration() {
    log_info "Testing User Registration..."
    local response=$(curl -s -X POST "$BASE_URL/register/" \
        -H "Content-Type: application/json" \
        -d "{
            \"username\": \"$TEST_USERNAME\",
            \"email\": \"$TEST_EMAIL\",
            \"password\": \"$TEST_PASSWORD\",
            \"password_confirmation\": \"$TEST_PASSWORD\",
            \"language\": \"en\"
        }")
    
    if ! validate_json "$response"; then
        log_error "Invalid JSON response for registration"
        echo "$response"
        return 1
    fi

    local user_id=$(echo "$response" | jq -r '.id // empty')
    local username=$(echo "$response" | jq -r '.username // empty')
    local email=$(echo "$response" | jq -r '.email // empty')

    if [ -z "$user_id" ] || [ -z "$username" ] || [ -z "$email" ]; then
        log_error "User registration failed - missing critical fields"
        echo "$response"
        return 1
    fi

    log_success "User Registration Successful"
    export TEST_USER_ID="$user_id"
    return 0
}

# User Login Test
test_user_login() {
    log_info "Testing User Login..."
    local response=$(curl -s -X POST "$BASE_URL/login/" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$TEST_EMAIL\", 
            \"password\": \"$TEST_PASSWORD\"
        }")
    
    if ! validate_json "$response"; then
        log_error "Invalid JSON response for login"
        echo "$response"
        return 1
    fi

    local access_token=$(echo "$response" | jq -r '.access // empty')
    local refresh_token=$(echo "$response" | jq -r '.refresh // empty')

    if [ -z "$access_token" ] || [ -z "$refresh_token" ]; then
        log_error "Login failed - missing tokens"
        echo "$response"
        return 1
    fi

    log_success "User Login Successful"
    export ACCESS_TOKEN="$access_token"
    export REFRESH_TOKEN="$refresh_token"
    return 0
}

# Profile Picture Upload Test
test_profile_picture_upload() {
    log_info "Testing Profile Picture Upload..."
    local test_image="/tmp/test_avatar.jpg"
    
    # Create a test image
    convert -size 100x100 xc:white "$test_image"

    local response=$(curl -s -X POST "$BASE_URL/upload-profile-picture/" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -F "profile_picture=@$test_image")
    
    if [[ "$response" != *"Profile picture uploaded successfully"* ]]; then
        log_error "Profile picture upload failed"
        echo "$response"
        return 1
    fi

    log_success "Profile Picture Upload Successful"
    return 0
}

# Profile Update Test
test_profile_update() {
    log_info "Testing Profile Update..."
    local response=$(curl -s -X PUT "$BASE_URL/profile/" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"username\": \"$TEST_USERNAME\",
            \"bio\": \"$TEST_BIO\"
        }")
    
    if ! validate_json "$response"; then
        log_error "Invalid JSON response for profile update"
        echo "$response"
        return 1
    fi

    local bio=$(echo "$response" | jq -r '.bio // empty')
    if [ "$bio" != "$TEST_BIO" ]; then
        log_error "Profile update failed"
        echo "$response"
        return 1
    fi

    log_success "Profile Update Successful"
    return 0
}

# Notes Creation Test
test_notes_creation() {
    log_info "Testing Notes Creation..."
    local response=$(curl -s -X POST "$BASE_URL/notes/" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"title\": \"$TEST_NOTE_TITLE\",
            \"content\": \"$TEST_NOTE_CONTENT\",
            \"note_type\": \"general\"
        }")
    
    if ! validate_json "$response"; then
        log_error "Invalid JSON response for note creation"
        echo "$response"
        return 1
    fi

    local note_id=$(echo "$response" | jq -r '.id // empty')
    local note_title=$(echo "$response" | jq -r '.title // empty')

    if [ -z "$note_id" ] || [ "$note_title" != "$TEST_NOTE_TITLE" ]; then
        log_error "Note creation failed"
        echo "$response"
        return 1
    fi

    log_success "Note Creation Successful"
    export TEST_NOTE_ID="$note_id"
    return 0
}

# Lessons Endpoint Test
test_lessons_endpoints() {
    log_info "Testing Lessons Endpoints..."
    
    # Get Lessons
    local lessons_response=$(curl -s -X GET "$BASE_URL/lessons/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    # Debug: Print full response
    echo "Lessons Response: $lessons_response"
    
    if ! validate_json "$lessons_response"; then
        log_error "Invalid JSON response for lessons"
        echo "$lessons_response"
        return 1
    fi

    # Improved lesson count and ID extraction
    local lesson_count=$(echo "$lessons_response" | jq '.results | length')
    if [ "$lesson_count" -eq 0 ]; then
        log_error "No lessons found"
        return 1
    fi

    # Get First Lesson Details
    local first_lesson_id=$(echo "$lessons_response" | jq -r '.results[0].id')
    
    # Correct URL for lesson detail
    local lesson_details=$(curl -s -X GET "$BASE_URL/lessons/$first_lesson_id/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")

    if ! validate_json "$lesson_details"; then
        log_error "Invalid JSON response for lesson details"
        echo "$lesson_details"
        return 1
    fi

    log_success "Lessons Endpoint Test Successful (Found $lesson_count lessons)"
    export TEST_LESSON_ID="$first_lesson_id"
    return 0
}

# Flashcards Endpoint Test
test_flashcards_endpoint() {
    log_info "Testing Flashcards Endpoint..."
    
    if [ -z "$TEST_LESSON_ID" ]; then
        log_error "No lesson ID available. Fetching lesson ID first."
        # Attempt to get lesson ID if not set
        local lessons_response=$(curl -s -X GET "$BASE_URL/lessons/" \
            -H "Authorization: Bearer $ACCESS_TOKEN")
        
        local first_lesson_id=$(echo "$lessons_response" | jq -r '.results[0].id')
        
        if [ -z "$first_lesson_id" ]; then
            log_error "Failed to retrieve lesson ID"
            return 1
        fi
        
        export TEST_LESSON_ID="$first_lesson_id"
    fi

    # Fetch flashcards for the lesson
    local flashcards_response=$(curl -s -X GET "$BASE_URL/flashcards/?lesson_id=$TEST_LESSON_ID" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    # Debug: Print full flashcards response
    echo "Flashcards Response: $flashcards_response"
    
    if ! validate_json "$flashcards_response"; then
        log_error "Invalid JSON response for flashcards"
        echo "$flashcards_response"
        return 1
    fi

    # Check if flashcards exist
    local flashcard_count=$(echo "$flashcards_response" | jq '. | length')
    if [ "$flashcard_count" -eq 0 ]; then
        log_error "No flashcards found for lesson $TEST_LESSON_ID"
        return 1
    fi

    # Select first flashcard for testing
    local first_flashcard=$(echo "$flashcards_response" | jq -r '.[0]')
    local first_flashcard_id=$(echo "$first_flashcard" | jq -r '.id')
    local first_flashcard_word=$(echo "$first_flashcard" | jq -r '.word')

    # Debug: Print flashcard details
    log_info "Testing Flashcard ID: $first_flashcard_id, Word: $first_flashcard_word"

    # Check answer for the flashcard
    local flashcard_answer_response=$(curl -s -X POST "$BASE_URL/flashcards/$first_flashcard_id/check-answer/" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"answer\": \"$first_flashcard_word\"}")

    # Debug: Print full response
    echo "Flashcard Answer Response: $flashcard_answer_response"

    # Validate JSON response
    if ! validate_json "$flashcard_answer_response"; then
        log_error "Invalid JSON response for flashcard answer"
        echo "$flashcard_answer_response"
        return 1
    fi

    # Check response structure
    local is_correct=$(echo "$flashcard_answer_response" | jq -r '.is_correct // "null"')
    local correct_answer=$(echo "$flashcard_answer_response" | jq -r '.correct_answer // "null"')
    local points_earned=$(echo "$flashcard_answer_response" | jq -r '.points_earned // "null"')
    
    if [ "$is_correct" == "null" ] || [ "$correct_answer" == "null" ] || [ "$points_earned" == "null" ]; then
        log_error "Incomplete response for flashcard answer"
        echo "$flashcard_answer_response"
        return 1
    fi

    log_success "Flashcards Endpoint Test Successful (Found $flashcard_count flashcards)"
    return 0
}

# Chatbot Endpoint Test
test_chatbot_endpoint() {
    log_info "Testing Chatbot Endpoint..."
    
    local chatbot_response=$(curl -s -X POST "$BASE_URL/chatbot/" \
        -H "Content-Type: application/json" \
        -d '{"input": "Hello"}')
    
    if ! validate_json "$chatbot_response"; then
        log_error "Invalid JSON response from chatbot"
        echo "$chatbot_response"
        return 1
    fi

    local response_text=$(echo "$chatbot_response" | jq -r '.response_text // empty')
    if [ -z "$response_text" ]; then
        log_error "No response text received from chatbot"
        return 1
    fi

    log_success "Chatbot Endpoint Test Successful"
    return 0
}

# Main Test Runner
run_comprehensive_tests() {
    check_dependencies
    check_server

    local tests=(
        test_user_registration
        test_user_login
        test_profile_picture_upload
        test_profile_update
        test_notes_creation
        test_lessons_endpoints
        test_flashcards_endpoint
        test_chatbot_endpoint
    )

    local total_tests=${#tests[@]}
    local passed_tests=0

    for test in "${tests[@]}"; do
        if $test; then
            ((passed_tests++))
        else
            log_error "Test $test FAILED"
        fi
    done

    log_info "Test Summary: $passed_tests/$total_tests tests passed"

    if [ "$passed_tests" -ne "$total_tests" ]; then
        exit 1
    fi
}

# Execute Tests
run_comprehensive_tests
