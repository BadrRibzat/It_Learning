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
BASE_URL="http://127.0.0.1:8000/"
TIMESTAMP=$(date +%s)
USERNAME="testuser_${TIMESTAMP}"
EMAIL="${USERNAME}@example.com"
PASSWORD="ComplexTest123!@#Fill-In-Blank"  # Strong password with fill-in-the-blank hint

# Pre-test cleanup and setup
setup_test_environment() {
    log_info "Setting up test environment..."
    
    # Activate the virtual environment
    source env/bin/activate
    python manage.py clear_test_users
}

# User registration
test_registration() {
    log_info "Testing user registration..."

    local register_response=$(curl -s -X POST "$BASE_URL/register/" \
        -H "Content-Type: application/json" \
        -d "{
            \"username\": \"$USERNAME\",
            \"email\": \"$EMAIL\",
            \"password\": \"$PASSWORD\",
            \"password_confirmation\": \"$PASSWORD\",
            \"language\": \"en\"
        }")

    # Validate registration response
    if echo "$register_response" | jq -e '.id' > /dev/null; then
        log_success "Registration successful"
        return 0
    else
        log_error "Registration failed"
        echo "Response: $register_response"
        return 1
    fi
}

# Login the user
test_login() {
    log_info "Testing login..."

    local login_response=$(curl -s -X POST "$BASE_URL/login/" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$EMAIL\",
            \"password\": \"$PASSWORD\"
        }")

    # Extract tokens
    ACCESS_TOKEN=$(echo "$login_response" | jq -r '.access')
    REFRESH_TOKEN=$(echo "$login_response" | jq -r '.refresh')

    if [[ ! -z "$ACCESS_TOKEN" && "$ACCESS_TOKEN" != "null" ]]; then
        log_success "Login successful"
        export ACCESS_TOKEN
        export REFRESH_TOKEN
        return 0
    else
        log_error "Login failed"
        echo "Response: $login_response"
        return 1
    fi
}

# Advanced Flashcard Submission Test
test_flashcard_submission() {
    log_info "Testing advanced flashcard submission with flexible answers..."

    # Get first lesson
    local lessons=$(curl -s "$BASE_URL/lessons/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")

    local lesson_id=$(echo "$lessons" | jq -r '.results[0].id')
    local flashcards=$(curl -s "$BASE_URL/lessons/$lesson_id/flashcards/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")

    # Prepare flashcard answers with advanced variations
    local answers_payload="["
    local first_iteration=true

    echo "$flashcards" | jq -c '.[]' | while read -r flashcard; do
        local flashcard_id=$(echo "$flashcard" | jq -r '.id')
        local correct_word=$(echo "$flashcard" | jq -r '.word')
        
        # Create multiple answer variations
        local variations=(
            "$correct_word"
            "${correct_word^}"  # Capitalized
            " $correct_word "   # With spaces
            "$correct_word."    # With punctuation
            "$(echo "$correct_word" | tr '[:lower:]' '[:upper:]')"  # Uppercase
        )
        
        # Randomly select an answer variation
        local answer=$(printf '%s\n' "${variations[@]}" | shuf -n1)

        if [ "$first_iteration" = true ]; then
            answers_payload+="{\"flashcard_id\": $flashcard_id, \"answer\": \"$answer\"}"
            first_iteration=false
        else
            answers_payload+=",{\"flashcard_id\": $flashcard_id, \"answer\": \"$answer\"}"
        fi
    done
    answers_payload+="]"

    local flashcard_submission=$(curl -s -X POST "$BASE_URL/lessons/$lesson_id/submit-flashcards/" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"answers\": $answers_payload}")

    if echo "$flashcard_submission" | jq -e '.lesson_completed' > /dev/null; then
        log_success "Advanced Flashcard submission test passed"
        return 0
    else
        log_error "Advanced Flashcard submission test failed"
        echo "Response: $flashcard_submission"
        return 1
    fi
}

# Fill-in-the-Blank Specific Test
test_fill_in_the_blank_variations() {
    log_info "Testing fill-in-the-blank answer variations..."

    # Get first lesson
    local lessons=$(curl -s "$BASE_URL/lessons/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")

    local lesson_id=$(echo "$lessons" | jq -r '.results[0].id')
    local flashcards=$(curl -s "$BASE_URL/lessons/$lesson_id/flashcards/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")

    # Test multiple fill-in-the-blank answer styles
    local fill_in_blank_tests=(
        "exact match"
        "capitalized"
        "with whitespace"
        "with punctuation"
        "partial match"
    )

    local test_passed=true

    echo "$flashcards" | jq -c '.[]' | while read -r flashcard; do
        local flashcard_id=$(echo "$flashcard" | jq -r '.id')
        local correct_word=$(echo "$flashcard" | jq -r '.word')

        for test_type in "${fill_in_blank_tests[@]}"; do
            local test_answer=""
            case "$test_type" in
                "exact match")
                    test_answer="$correct_word"
                    ;;
                "capitalized")
                    test_answer="${correct_word^}"
                    ;;
                "with whitespace")
                    test_answer=" $correct_word "
                    ;;
                "with punctuation")
                    test_answer="$correct_word."
                    ;;
                "partial match")
                    test_answer="${correct_word:0:3}"
                    ;;
            esac

            local submission_payload="[{\"flashcard_id\": $flashcard_id, \"answer\": \"$test_answer\"}]"

            local submission_response=$(curl -s -X POST "$BASE_URL/lessons/$lesson_id/submit-flashcards/" \
                -H "Authorization: Bearer $ACCESS_TOKEN" \
                -H "Content-Type: application/json" \
                -d "{\"answers\": $submission_payload}")

            # Check if submission was successful or partially successful
            if ! echo "$submission_response" | jq -e '.total_flashcards' > /dev/null; then
                log_error "Fill-in-the-blank test failed for type: $test_type, answer: $test_answer"
                test_passed=false
                break
            fi
        done
    done

    if [ "$test_passed" = true ]; then
        log_success "Fill-in-the-Blank variations test passed"
        return 0
    else
        log_error "Fill-in-the-Blank variations test failed"
        return 1
    fi
}

# Quiz Submission with Fill-in-the-Blank
test_quiz_submission_with_variations() {
    log_info "Testing quiz submission with fill-in-the-blank variations..."

    # Get a lesson with quizzes
    local lessons=$(curl -s "$BASE_URL/lessons/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")

    local lesson_id=$(echo "$lessons" | jq -r '.results[0].id')

    # Get quizzes for the lesson
    local quizzes=$(curl -s "$BASE_URL/lessons/$lesson_id/quizzes/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")

    local quiz_id=$(echo "$quizzes" | jq -r '.[0].id')
    local questions=$(echo "$quizzes" | jq -c '.[0].questions')

    # Prepare quiz answers payload with variations
    local answers_payload="["
    local first_iteration=true

    echo "$questions" | jq -c '.[]' | while read -r question; do
        local question_id=$(echo "$question" | jq -r '.id')
        local correct_answer=$(echo "$question" | jq -r '.correct_answer')

        # Create answer variations
        local variations=(
            "$correct_answer"
            "${correct_answer^}"
            " $correct_answer "
            "$correct_answer."
            "$(echo "$correct_answer" | tr '[:lower:]' '[:upper:]')"
        )
        
        # Randomly select an answer variation
        local answer=$(printf '%s\n' "${variations[@]}" | shuf -n1)

        if [ "$first_iteration" = true ]; then
            answers_payload+="{\"question_id\": $question_id, \"answer\": \"$answer\"}"
            first_iteration=false
        else
            answers_payload+=",{\"question_id\": $question_id, \"answer\": \"$answer\"}"
        fi
    done
    answers_payload+="]"

    local quiz_submission=$(curl -s -X POST "$BASE_URL/quizzes/$quiz_id/submit/" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"answers\": $answers_payload}")

    if echo "$quiz_submission" | jq -e '.is_passed' > /dev/null; then
        log_success "Quiz submission with fill-in-the-blank variations test passed"
        return 0
    else
        log_error "Quiz submission with fill-in-the-blank variations test failed"
        echo "Response: $quiz_submission"
        return 1
    fi
}

# Main test runner (include new tests)
main() {
    local failed=0

    setup_test_environment || exit 1

    test_registration || ((failed++))
    test_login || ((failed++))

    # Lessons Application Tests with Fill-in-the-Blank Focus
    test_flashcard_submission || ((failed++))
    test_fill_in_the_blank_variations || ((failed++))
    test_quiz_submission_with_variations || ((failed++))

    # Add other existing tests...

    echo "----------------------------------------"
    if [[ $failed -eq 0 ]]; then
        log_success "All tests passed successfully!"
        exit 0
    else
        log_error "$failed test(s) failed"
        exit 1
    fi
}

# Run the main function
main
