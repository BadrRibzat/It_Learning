#!/bin/bash

# Logging functions
log_info() {
    echo -e "\e[34m[INFO]\e[0m $1"
}

log_success() {
    echo -e "\e[32m[SUCCESS]\e[0m $1"
}

log_error() {
    echo -e "\e[31m[ERROR]\e[0m $1"
}

# Configuration
BASE_URL="http://127.0.0.1:8000/api"
USERNAME="testuser@example.com"
PASSWORD="TestPassword123!"

# Registration function
test_registration() {
    log_info "Testing user registration..."
    
    local register_response=$(curl -s -X POST "$BASE_URL/register/" \
        -H "Content-Type: application/json" \
        -d "{
            \"username\": \"testuser\",
            \"email\": \"$USERNAME\",
            \"password\": \"$PASSWORD\",
            \"password_confirmation\": \"$PASSWORD\",
            \"language\": \"en\"
        }")
    
    # Check for both id and username in the response
    if echo "$register_response" | jq -e '(.id or .username)' > /dev/null; then
        log_success "Registration successful"
        return 0
    else
        log_error "Registration failed"
        echo "Response: $register_response"
        return 1
}

# Login function
test_login() {
    log_info "Testing user login..."
    
    local login_response=$(curl -s -X POST "$BASE_URL/login/" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$USERNAME\",
            \"password\": \"$PASSWORD\"
        }")
    
    # Extract access token with more robust checking
    ACCESS_TOKEN=$(echo "$login_response" | jq -r 'if .access then .access else "" end')
    
    if [ ! -z "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
        log_success "Login successful"
        export ACCESS_TOKEN
        return 0
    else
        log_error "Login failed"
        echo "Response: $login_response"
        return 1
}


# Test server availability
test_server() {
    log_info "Testing server availability..."
    
    local server_response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
    
    if [ "$server_response" -eq 200 ] || [ "$server_response" -eq 404 ]; then
        log_success "Server is running"
        return 0
    else
        log_error "Server not responding (HTTP $server_response)"
        return 1
    fi
}

# Test lessons endpoint
test_lessons() {
    log_info "Testing lessons endpoint..."
    
    local lessons_response=$(curl -s "$BASE_URL/lessons/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if echo "$lessons_response" | jq -e '.results' > /dev/null; then
        log_success "Lessons endpoint test passed"
        # Store first lesson ID for further tests
        FIRST_LESSON_ID=$(echo "$lessons_response" | jq -r '.results[0].id')
        export FIRST_LESSON_ID
        return 0
    else
        log_error "Lessons endpoint test failed"
        echo "Response: $lessons_response"
        return 1
    fi
}

# Test flashcards endpoint
test_flashcards() {
    log_info "Testing flashcards endpoint..."
    
    # Use the first lesson ID from previous test
    local flashcards_response=$(curl -s "$BASE_URL/flashcards/?lesson_id=$FIRST_LESSON_ID" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if echo "$flashcards_response" | jq -e '.results' > /dev/null; then
        log_success "Flashcards endpoint test passed"
        return 0
    else
        log_error "Flashcards endpoint test failed"
        echo "Response: $flashcards_response"
        return 1
    fi
}

# Test quiz endpoints
test_quiz() {
    log_info "Testing quiz endpoints..."
    
    if [ -z "$FIRST_LESSON_ID" ]; then
        log_error "No lesson ID available. Run lessons test first."
        return 1
    fi
    
    # Get quiz for lesson
    local quiz_response=$(curl -s "$BASE_URL/lessons/$FIRST_LESSON_ID/quizzes/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if ! echo "$quiz_response" | jq -e '.id' > /dev/null; then
        log_error "Failed to retrieve quiz"
        echo "Response: $quiz_response"
        return 1
    fi
    
    local quiz_id=$(echo "$quiz_response" | jq -r '.id')
    local first_question_id=$(echo "$quiz_response" | jq -r '.questions[0].id')
    
    # Submit quiz answers
    local submit_response=$(curl -s -X POST "$BASE_URL/lessons/$FIRST_LESSON_ID/submit-quiz/" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"answers\": [{
                \"question_id\": $first_question_id,
                \"answer\": \"test answer\"
            }]
        }")
    
    if echo "$submit_response" | jq -e '.score' > /dev/null; then
        log_success "Quiz endpoints test passed"
        return 0
    else
        log_error "Quiz submission failed"
        echo "Response: $submit_response"
        return 1
    fi
}

# Test level test endpoints
test_level_test() {
    log_info "Testing level test endpoints..."
    
    # Get first level
    local level_response=$(curl -s "$BASE_URL/levels/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    local first_level_id=$(echo "$level_response" | jq -r '.results[0].id')
    
    if [ -z "$first_level_id" ] || [ "$first_level_id" == "null" ]; then
        log_error "Could not retrieve level ID"
        return 1
    fi
    
    # Get level test
    local test_response=$(curl -s "$BASE_URL/levels/$first_level_id/test/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if echo "$test_response" | jq -e '.id' > /dev/null; then
        log_success "Level test endpoints test passed"
        return 0
    else
        log_error "Level test endpoint failed"
        echo "Response: $test_response"
        return 1
    fi
}

# Test user progress endpoints
test_user_progress() {
    log_info "Testing user progress endpoints..."
    
    # Test progress endpoint
    local progress_response=$(curl -s "$BASE_URL/user/progress/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if ! echo "$progress_response" | jq -e '.level' > /dev/null; then
        log_error "Progress endpoint test failed"
        echo "Response: $progress_response"
        return 1
    fi
    
    # Test statistics endpoint
    local stats_response=$(curl -s "$BASE_URL/user/statistics/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if echo "$stats_response" | jq -e '.completed_lessons' > /dev/null; then
        log_success "User progress endpoints test passed"
        return 0
    else
        log_error "Statistics endpoint test failed"
        echo "Response: $stats_response"
        return 1
    fi
}

# Main test runner
main() {
    local failed=0
    
    # Ensure jq is installed
    if ! command -v jq &> /dev/null; then
        log_error "jq is not installed. Please install jq."
        exit 1
    fi
    
    # Run tests
    test_server || ((failed++))
    test_registration || ((failed++))
    test_login || ((failed++))
    
    if [ ! -z "$ACCESS_TOKEN" ]; then
        test_lessons || ((failed++))
        test_flashcards || ((failed++))
        test_quiz || ((failed++))
        test_level_test || ((failed++))
        test_user_progress || ((failed++))
    else
        log_error "Skipping authenticated endpoints due to login failure"
        ((failed++))
    fi
    
    # Summary
    echo "----------------------------------------"
    if [ $failed -eq 0 ]; then
        log_success "All tests passed"
        exit 0
    else
        log_error "$failed test(s) failed"
        exit 1
    fi
}

# Run the main function
main
