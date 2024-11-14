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
    
    if echo "$register_response" | jq -e '(.id or .username)' > /dev/null; then
        log_success "Registration successful"
        return 0
    else
        log_error "Registration failed"
        echo "Response: $register_response"
        return 1
    fi
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
    
    ACCESS_TOKEN=$(echo "$login_response" | jq -r '.access')
    
    if [ ! -z "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
        log_success "Login successful"
        export ACCESS_TOKEN
        return 0
    else
        log_error "Login failed"
        echo "Response: $login_response"
        return 1
    fi
}

# Test server availability
test_server() {
    log_info "Testing server availability..."
    
    local server_response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
    
    if [ "$server_response" -eq 200 ] || [ "$server_response" -eq 404 ] || [ "$server_response" -eq 401 ]; then
        log_success "Server is running (HTTP $server_response)"
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
        FIRST_LESSON_FLASHCARDS=$(echo "$lessons_response" | jq -r '.results[0].flashcards')
        export FIRST_LESSON_ID
        export FIRST_LESSON_FLASHCARDS
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
    
    # Simulate completing flashcards
    local first_flashcard_id=$(echo "$FIRST_LESSON_FLASHCARDS" | jq -r '.[0].id')
    
    local flashcard_answer_response=$(curl -s -X POST "$BASE_URL/flashcards/$first_flashcard_id/check-answer/" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"answer\": \"$(echo "$FIRST_LESSON_FLASHCARDS" | jq -r '.[0].word')\"}")
    
    if echo "$flashcard_answer_response" | jq -e '.is_correct' > /dev/null; then
        log_success "Flashcards endpoint test passed"
        return 0
    else
        log_error "Flashcards endpoint test failed"
        echo "Response: $flashcard_answer_response"
        return 1
    fi
}

# Test quiz endpoints
test_quiz() {
    log_info "Testing quiz endpoints..."
    
    # Get quiz for first lesson
    local quiz_response=$(curl -s "$BASE_URL/lessons/$FIRST_LESSON_ID/quizzes/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    local first_quiz_question_id=$(echo "$quiz_response" | jq -r '.[0].questions[0].id')
    local first_quiz_id=$(echo "$quiz_response" | jq -r '.[0].id')
    
    # Submit quiz answers
    local submit_quiz_response=$(curl -s -X POST "$BASE_URL/quizzes/$first_quiz_id/submit/" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"answers\": [{
                \"question_id\": $first_quiz_question_id,
                \"answer\": \"$(echo "$quiz_response" | jq -r '.[0].questions[0].correct_answer')\"
            }]
        }")
    
    if echo "$submit_quiz_response" | jq -e '.is_passed' > /dev/null; then
        log_success "Quiz endpoints test passed"
        return 0
    else
        log_error "Quiz submission failed"
        echo "Response: $submit_quiz_response"
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
    
    # Get level test
    local test_response=$(curl -s "$BASE_URL/levels/$first_level_id/test/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    # Prepare answers for all questions
    local questions=$(echo "$test_response" | jq -c '.questions[]')
    local answers_payload="["
    local first_iteration=true
    
    echo "$questions" | while read -r question; do
        local question_id=$(echo "$question" | jq -r '.id')
        local correct_answer=$(echo "$question" | jq -r '.correct_answer')
        
        if [ "$first_iteration" = true ]; then
            answers_payload+="{\"question_id\": $question_id, \"answer\": \"$correct_answer\"}"
            first_iteration=false
        else
            answers_payload+=",{\"question_id\": $question_id, \"answer\": \"$correct_answer\"}"
        fi
    done
    answers_payload+="]"
    
    # Submit level test
    local submit_test_response=$(curl -s -X POST "$BASE_URL/levels/$first_level_id/test/submit/" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$answers_payload")
    
    if echo "$submit_test_response" | jq -e '.is_passed' > /dev/null; then
        log_success "Level test endpoints test passed"
        return 0
    else
        log_error "Level test submission failed"
        echo "Response: $submit_test_response"
        return 1
    fi
}

# Test user progress endpoints
test_user_progress() {
    log_info "Testing user progress endpoints..."
    
    # Test progress endpoint
    local progress_response=$(curl -s "$BASE_URL/progress/learning/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if echo "$progress_response" | jq -e '.level_name' > /dev/null; then
        log_success "Progress endpoint test passed"
        return 0
    else
        log_error "Progress endpoint test failed"
        echo "Response: $progress_response"
        return 1
    fi
}

# Test profile endpoints
test_profile() {
    log_info "Testing profile endpoints..."
    
    # Get profile
    local profile_response=$(curl -s "$BASE_URL/profile/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if echo "$profile_response" | jq -e '.username' > /dev/null; then
        log_success "Profile endpoint test passed"
        return 0
    else
        log_error "Profile endpoint test failed"
        echo "Response: $profile_response"
        return 1
    fi
}

# Test statistics endpoints
test_statistics() {
    log_info "Testing statistics endpoints..."
    
    # Get statistics
    local statistics_response=$(curl -s "$BASE_URL/statistics/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if echo "$statistics_response" | jq -e '.points' > /dev/null; then
        log_success "Statistics endpoint test passed"
        return 0
    else
        log_error "Statistics endpoint test failed"
        echo "Response: $statistics_response"
        return 1
    fi
}

# Test recommended lessons endpoints
test_recommended_lessons() {
    log_info "Testing recommended lessons endpoints..."
    
    # Get recommended lessons
    local recommended_lessons_response=$(curl -s "$BASE_URL/recommended-lessons/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if echo "$recommended_lessons_response" | jq -e '.[]' > /dev/null; then
        log_success "Recommended lessons endpoint test passed"
        return 0
    else
        log_error "Recommended lessons endpoint test failed"
        echo "Response: $recommended_lessons_response"
        return 1
    fi
}

# Test email verification endpoints
test_email_verification() {
    log_info "Testing email verification endpoints..."
    
    # Resend verification email
    local resend_verification_response=$(curl -s -X POST "$BASE_URL/resend-verification/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if echo "$resend_verification_response" | jq -e '.detail' > /dev/null; then
        log_success "Resend verification email endpoint test passed"
        return 0
    else
        log_error "Resend verification email endpoint test failed"
        echo "Response: $resend_verification_response"
        return 1
    fi
}

# Test password reset endpoints
test_password_reset() {
    log_info "Testing password reset endpoints..."
    
    # Request password reset
    local password_reset_request_response=$(curl -s -X POST "$BASE_URL/password-reset/" \
        -H "Content-Type: application/json" \
        -d "{\"email\": \"$USERNAME\"}")
    
    if echo "$password_reset_request_response" | jq -e '.detail' > /dev/null; then
        log_success "Password reset request endpoint test passed"
        return 0
    else
        log_error "Password reset request endpoint test failed"
        echo "Response: $password_reset_request_response"
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
        test_profile || ((failed++))
        test_statistics || ((failed++))
        test_recommended_lessons || ((failed++))
        test_email_verification || ((failed++))
        test_password_reset || ((failed++))
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
