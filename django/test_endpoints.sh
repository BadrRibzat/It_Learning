#!/bin/bash

# Advanced Endpoint Testing Script for Learn English Platform

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

# Logging and Error Handling
log_success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

log_error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
    # Optional: Log to a file for further investigation
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
    
    # Print full response for debugging
    echo "Full Registration Response: $response"
    
    # Check for validation errors
    local validation_errors=$(echo "$response" | jq -r '.errors // empty')
    if [ -n "$validation_errors" ]; then
        log_error "Registration Validation Errors:"
        echo "$validation_errors"
        return 1
    fi

    # Validate JSON response
    if ! validate_json "$response"; then
        log_error "Invalid JSON response for registration"
        echo "$response"
        return 1
    fi

    # Extract user details
    local user_id=$(echo "$response" | jq -r '.id // empty')
    local username=$(echo "$response" | jq -r '.username // empty')
    local email=$(echo "$response" | jq -r '.email // empty')

    # Validate extracted details
    if [ -z "$user_id" ] || [ -z "$username" ] || [ -z "$email" ]; then
        log_error "User registration failed - missing critical fields"
        log_error "User ID: $user_id"
        log_error "Username: $username"
        log_error "Email: $email"
        return 1
    fi

    log_success "User Registration Successful"
    export TEST_USER_ID="$user_id"
    export TEST_USERNAME="$username"
    export TEST_EMAIL="$email"
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
    # Create a test image if not exists
    local test_image="$HOME/test_avatar.jpg"
    if [ ! -f "$test_image" ]; then
        convert -size 100x100 xc:white "$test_image"
    fi

    local response=$(curl -s -X POST "$BASE_URL/upload-profile-picture/" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -F "profile_picture=@$test_image")
    
    if ! echo "$response" | grep -q "Profile picture uploaded successfully"; then
        log_error "Profile picture upload failed"
        echo "$response"
        return 1
    fi

    log_success "Profile Picture Upload Successful"
    return 0
}

# Lessons Endpoint Test
test_lessons_endpoints() {
    log_info "Testing Lessons Endpoints..."
    
    # Get Lessons
    local lessons_response=$(curl -s -X GET "$BASE_URL/lessons/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if ! validate_json "$lessons_response"; then
        log_error "Invalid JSON response for lessons"
        echo "$lessons_response"
        return 1
    fi

    local lesson_count=$(echo "$lessons_response" | jq '. | length')
    if [ "$lesson_count" -eq 0 ]; then
        log_error "No lessons found"
        return 1
    fi

    log_success "Lessons Endpoint Test Successful (Found $lesson_count lessons)"
    return 0
}

# Flashcards Endpoint Test
test_flashcards_endpoint() {
    log_info "Testing Flashcards Endpoint..."
    
    # Get First Lesson ID to fetch flashcards
    local lessons_response=$(curl -s -X GET "$BASE_URL/lessons/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    local first_lesson_id=$(echo "$lessons_response" | jq -r '.[0].id // empty')
    if [ -z "$first_lesson_id" ]; then
        log_error "Could not find a lesson ID for flashcards test"
        return 1
    fi

    local flashcards_response=$(curl -s -X GET "$BASE_URL/flashcards/?lesson_id=$first_lesson_id" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if ! validate_json "$flashcards_response"; then
        log_error "Invalid JSON response for flashcards"
        echo "$flashcards_response"
        return 1
    fi

    local flashcard_count=$(echo "$flashcards_response" | jq '. | length')
    if [ "$flashcard_count" -eq 0 ]; then
        log_error "No flashcards found for lesson $first_lesson_id"
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

    log_success "Chatbot Endpoint Test Successful (Received: $response_text)"
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
