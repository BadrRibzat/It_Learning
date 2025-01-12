#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Base URL
BASE_URL="http://localhost:8000"

# Test user credentials
USERNAME="PedroRibzat"
EMAIL="badrribzat003@gmail.com"
PASSWORD="PedroRibzat123@"

# Function to print colored output
print_result() {
    local status=$1
    local message=$2
    if [ $status -eq 0 ]; then
        echo -e "${GREEN}✓ $message${NC}"
    else
        echo -e "${RED}✗ $message${NC}"
    fi
}

# Function to make API requests
api_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4

    # Prepare headers
    local headers=("-H" "Content-Type: application/json")
    if [ -n "$token" ]; then
        headers+=("-H" "Authorization: Bearer $token")
    fi

    # Make request
    local response
    if [ -n "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X "$method" "${headers[@]}" -d "$data" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "%{http_code}" -X "$method" "${headers[@]}" "$BASE_URL$endpoint")
    fi

    # Split status code and response body
    local http_code=${response: -3}
    local body=${response:0:${#response}-3}

    echo "$http_code|$body"
}

# Function to extract token from response
extract_token() {
  local response="$1"
  local token_type="$2"
  # Use grep -i for case-insensitive matching of the token type
  echo "$response" | grep -io "\"$token_type\":\"[^\"]*\"" | cut -d'"' -f4
}

# Function to extract first ID from response
extract_first_id() {
    local response="$1"
    echo "$response" | grep -o '"id":[0-9]*' | cut -d':' -f2 | head -n 1
}

# Function to add debug printing
debug_print_response() {
    local response="$1"
    local message="$2"
    
    echo -e "${NC}Debug - $message:${NC}"
    echo "Status Code: $(echo "$response" | cut -d'|' -f1)"
    echo "Response Body: $(echo "$response" | cut -d'|' -f2)"
}

# Main test function
run_tests() {
    echo "Starting comprehensive API endpoint tests..."

    # 1. User Registration
    echo -e "\n${NC}1. User Registration Test${NC}"
    reg_response=$(api_request "POST" "/accounts/register/" "{
        \"username\": \"$USERNAME\",
        \"email\": \"$EMAIL\",
        \"password\": \"$PASSWORD\",
        \"password_confirmation\": \"$PASSWORD\",
        \"language\": \"en\"
    }")
    reg_status=$(echo "$reg_response" | cut -d'|' -f1)
    debug_print_response "$reg_response" "User Registration"
    print_result $([[ "$reg_status" == "201" ]] && echo 0 || echo 1) "User Registration"

    # 2. User Login
    echo -e "\n${NC}2. User Login Test${NC}"
    login_response=$(api_request "POST" "/accounts/login/" "{
        \"email\": \"$EMAIL\",
        \"password\": \"$PASSWORD\"
    }")
    login_status=$(echo "$login_response" | cut -d'|' -f1)
    debug_print_response "$login_response" "User Login"
    ACCESS_TOKEN=$(extract_token "$login_response" "access")
    REFRESH_TOKEN=$(extract_token "$login_response" "refresh")
    print_result $([[ "$login_status" == "200" ]] && echo 0 || echo 1) "User Login"

    # Authentication check
    if [ -z "$ACCESS_TOKEN" ]; then
        echo -e "${RED}✗ Authentication Failed. Exiting tests.${NC}"
        exit 1
    fi

    # 3. Multi-Factor Authentication Setup
    echo -e "\n${NC}3. Multi-Factor Authentication Setup Test${NC}"
    mfa_setup_response=$(api_request "POST" "/accounts/mfa/setup/" "" "$ACCESS_TOKEN")
    mfa_setup_status=$(echo "$mfa_setup_response" | cut -d'|' -f1)
    debug_print_response "$mfa_setup_response" "MFA Setup"
    print_result $([[ "$mfa_setup_status" == "200" ]] && echo 0 || echo 1) "MFA Setup"

    # 4. Upload Profile Picture
    echo -e "\n${NC}4. Upload Profile Picture Test${NC}"
    upload_response=$(curl -s -w "\n%{http_code}" -X POST -H "Authorization: Bearer $ACCESS_TOKEN" -F "profile_picture=@/home/badr/Downloads/test-image.jpeg" "$BASE_URL/accounts/upload-profile-picture/")
    upload_status=$(echo "$upload_response" | tail -n 1)
    upload_body=$(echo "$upload_response" | sed '$d')
    debug_print_response "$upload_status|$upload_body" "Upload Profile Picture"
    print_result $([[ "$upload_status" == "200" ]] && echo 0 || echo 1) "Upload Profile Picture"

    # 5. Delete Profile Picture
    echo -e "\n${NC}5. Delete Profile Picture Test${NC}"
    delete_response=$(api_request "DELETE" "/accounts/delete-profile-picture/" "" "$ACCESS_TOKEN")
    delete_status=$(echo "$delete_response" | cut -d'|' -f1)
    debug_print_response "$delete_response" "Delete Profile Picture"
    print_result $([[ "$delete_status" == "200" ]] && echo 0 || echo 1) "Delete Profile Picture"

    # 6. Reset Progress
    echo -e "\n${NC}6. Reset Progress Test${NC}"
    reset_response=$(api_request "POST" "/accounts/reset-progress/" "" "$ACCESS_TOKEN")
    reset_status=$(echo "$reset_response" | cut -d'|' -f1)
    debug_print_response "$reset_response" "Reset Progress"
    print_result $([[ "$reset_status" == "200" ]] && echo 0 || echo 1) "Reset Progress"

    # 7. Get Reset Progress Details
    echo -e "\n${NC}7. Get Reset Progress Details Test${NC}"
    reset_details_response=$(api_request "GET" "/accounts/reset-progress-details/" "" "$ACCESS_TOKEN")
    reset_details_status=$(echo "$reset_details_response" | cut -d'|' -f1)
    debug_print_response "$reset_details_response" "Get Reset Progress Details"
    print_result $([[ "$reset_details_status" == "200" ]] && echo 0 || echo 1) "Get Reset Progress Details"

    # 8. Get User Profile
    echo -e "\n${NC}8. Get User Profile Test${NC}"
    profile_response=$(api_request "GET" "/accounts/profile/$USERNAME/" "" "$ACCESS_TOKEN")
    profile_status=$(echo "$profile_response" | cut -d'|' -f1)
    debug_print_response "$profile_response" "Get User Profile"
    print_result $([[ "$profile_status" == "200" ]] && echo 0 || echo 1) "Get User Profile"

    # 9. Update User Profile
    echo -e "\n${NC}9. Update User Profile Test${NC}"
    update_profile_response=$(api_request "PUT" "/accounts/profile/$USERNAME/" "{
        \"username\": \"${USERNAME}_updated\",
         \"bio\": \"Test bio\"
    }" "$ACCESS_TOKEN")
    update_profile_status=$(echo "$update_profile_response" | cut -d'|' -f1)
    debug_print_response "$update_profile_response" "Update User Profile"
    print_result $([[ "$update_profile_status" == "200" ]] && echo 0 || echo 1) "Update User Profile"

    # Extract the updated username from the response
    UPDATED_USERNAME=$(echo "$update_profile_response" | cut -d'|' -f2 | grep -o '"username":"[^"]*"' | cut -d'"' -f4)

    # 10. Get User Statistics
    echo -e "\n${NC}10. Get User Statistics Test${NC}"
    stats_response=$(api_request "GET" "/accounts/statistics/$UPDATED_USERNAME/" "" "$ACCESS_TOKEN")
    stats_status=$(echo "$stats_response" | cut -d'|' -f1)
    debug_print_response "$stats_response" "Get User Statistics"
    print_result $([[ "$stats_status" == "200" ]] && echo 0 || echo 1) "Get User Statistics"

    # 11. Create Note
    echo -e "\n${NC}11. Create Note Test${NC}"
    create_note_response=$(api_request "POST" "/accounts/notes/" "{
        \"title\": \"Test Note\",
        \"content\": \"This is a test note content\",
        \"note_type\": \"general\"
    }" "$ACCESS_TOKEN")
    create_note_status=$(echo "$create_note_response" | cut -d'|' -f1)
    NOTE_ID=$(extract_first_id "$create_note_response")
    debug_print_response "$create_note_response" "Create Note"
    print_result $([[ "$create_note_status" == "201" ]] && echo 0 || echo 1) "Create Note"

    # 12. Get Notes
    echo -e "\n${NC}12. Get Notes Test${NC}"
    notes_response=$(api_request "GET" "/accounts/notes/" "" "$ACCESS_TOKEN")
    notes_status=$(echo "$notes_response" | cut -d'|' -f1)
    debug_print_response "$notes_response" "Get Notes"
    print_result $([[ "$notes_status" == "200" ]] && echo 0 || echo 1) "Get Notes"

    # 13. Update Note
    echo -e "\n${NC}13. Update Note Test${NC}"
    update_note_response=$(api_request "PUT" "/accounts/notes/$NOTE_ID/" "{
        \"title\": \"Updated Test Note\",
        \"content\": \"Updated test note content\",
        \"note_type\": \"vocabulary\"
    }" "$ACCESS_TOKEN")
    update_note_status=$(echo "$update_note_response" | cut -d'|' -f1)
    debug_print_response "$update_note_response" "Update Note"
    print_result $([[ "$update_note_status" == "200" ]] && echo 0 || echo 1) "Update Note"

    # 14. Delete Note
    echo -e "\n${NC}14. Delete Note Test${NC}"
    delete_note_response=$(api_request "DELETE" "/accounts/notes/$NOTE_ID/" "" "$ACCESS_TOKEN")
    delete_note_status=$(echo "$delete_note_response" | cut -d'|' -f1)
    debug_print_response "$delete_note_response" "Delete Note"
    print_result $([[ "$delete_note_status" == "204" ]] && echo 0 || echo 1) "Delete Note"

    # 15. Get Recommended Lessons
    echo -e "\n${NC}15. Get Recommended Lessons Test${NC}"
    recommended_response=$(api_request "GET" "/accounts/recommended-lessons/" "" "$ACCESS_TOKEN")
    recommended_status=$(echo "$recommended_response" | cut -d'|' -f1)
    debug_print_response "$recommended_response" "Get Recommended Lessons"
    print_result $([[ "$recommended_status" == "200" ]] && echo 0 || echo 1) "Get Recommended Lessons"

    # 16. Get Levels
    echo -e "\n${NC}16. Get Levels Test${NC}"
    levels_response=$(api_request "GET" "/lessons/levels/" "" "$ACCESS_TOKEN")
    levels_status=$(echo "$levels_response" | cut -d'|' -f1)
    debug_print_response "$levels_response" "Get Levels"
    print_result $([[ "$levels_status" == "200" ]] && echo 0 || echo 1) "Get Levels"

    # 17. Get Lessons for a Level
    echo -e "\n${NC}17. Get Lessons for a Level Test${NC}"
    first_level_id=$(extract_first_id "$levels_response")
    lessons_response=$(api_request "GET" "/lessons/levels/$first_level_id/lessons/" "" "$ACCESS_TOKEN")
    lessons_status=$(echo "$lessons_response" | cut -d'|' -f1)
    debug_print_response "$lessons_response" "Get Lessons for a Level"
    print_result $([[ "$lessons_status" == "200" ]] && echo 0 || echo 1) "Get Lessons for a Level"

    # 18. Get Flashcards for a Lesson
    echo -e "\n${NC}18. Get Flashcards for a Lesson Test${NC}"
    first_lesson_id=$(extract_first_id "$lessons_response")
    flashcards_response=$(api_request "GET" "/lessons/lessons/$first_lesson_id/flashcards/" "" "$ACCESS_TOKEN")
    flashcards_status=$(echo "$flashcards_response" | cut -d'|' -f1)
    debug_print_response "$flashcards_response" "Get Flashcards for a Lesson"
    print_result $([[ "$flashcards_status" == "200" ]] && echo 0 || echo 1) "Get Flashcards for a Lesson"

    # 19. Submit Flashcard
    echo -e "\n${NC}19. Submit Flashcard Test${NC}"
    first_flashcard_id=$(extract_first_id "$flashcards_response")
    flashcard_response=$(api_request "POST" "/lessons/flashcards/submit-answer/" "{
        \"flashcard_id\": $first_flashcard_id,
        \"user_answer\": \"test\"
    }" "$ACCESS_TOKEN")
    flashcard_status=$(echo "$flashcard_response" | cut -d'|' -f1)
    debug_print_response "$flashcard_response" "Submit Flashcard"
    print_result $([[ "$flashcard_status" == "200" ]] && echo 0 || echo 1) "Submit Flashcard"

    # 20. Get Quiz for a Lesson
    echo -e "\n${NC}20. Get Quiz for a Lesson Test${NC}"
    quiz_response=$(api_request "GET" "/lessons/lessons/$first_lesson_id/quiz/" "" "$ACCESS_TOKEN")
    quiz_status=$(echo "$quiz_response" | cut -d'|' -f1)
    debug_print_response "$quiz_response" "Get Quiz for a Lesson"
    print_result $([[ "$quiz_status" == "200" ]] && echo 0 || echo 1) "Get Quiz for a Lesson"

    # 21. Submit Quiz
    echo -e "\n${NC}21. Submit Quiz Test${NC}"
    first_quiz_id=$(extract_first_id "$quiz_response")
    quiz_submit_response=$(api_request "POST" "/lessons/quizzes/submit-quiz/" "{
        \"quiz_id\": $first_quiz_id,
        \"answers\": [{\"question_id\": 1, \"user_answer\": \"test\"}]
    }" "$ACCESS_TOKEN")
    quiz_submit_status=$(echo "$quiz_submit_response" | cut -d'|' -f1)
    debug_print_response "$quiz_submit_response" "Submit Quiz"
    print_result $([[ "$quiz_submit_status" == "200" ]] && echo 0 || echo 1) "Submit Quiz"

    # 22. Get Level Test Progress
    echo -e "\n${NC}22. Get Level Test Progress Test${NC}"
    level_test_progress_response=$(api_request "GET" "/lessons/level-tests/progress/" "" "$ACCESS_TOKEN")
    level_test_progress_status=$(echo "$level_test_progress_response" | cut -d'|' -f1)
    debug_print_response "$level_test_progress_response" "Get Level Test Progress"
    print_result $([[ "$level_test_progress_status" == "200" ]] && echo 0 || echo 1) "Get Level Test Progress"

    # 23. Submit Level Test
    echo -e "\n${NC}23. Submit Level Test Test${NC}"
    level_test_response=$(api_request "GET" "/lessons/level-tests/" "" "$ACCESS_TOKEN")
    first_level_test_id=$(extract_first_id "$level_test_response")
    level_test_submit_response=$(api_request "POST" "/lessons/level-tests/submit-test/" "{
        \"level_test_id\": $first_level_test_id,
        \"answers\": [{\"question_id\": 1, \"user_answer\": \"test\"}]
    }" "$ACCESS_TOKEN")
    level_test_submit_status=$(echo "$level_test_submit_response" | cut -d'|' -f1)
    debug_print_response "$level_test_submit_response" "Submit Level Test"
    print_result $([[ "$level_test_submit_status" == "200" ]] && echo 0 || echo 1) "Submit Level Test"

    # 24. Logout
    echo -e "\n${NC}24. Logout Test${NC}"
    logout_response=$(api_request "POST" "/accounts/logout/" "{
        \"refresh_token\": \"$REFRESH_TOKEN\"
    }" "$ACCESS_TOKEN")
    logout_status=$(echo "$logout_response" | cut -d'|' -f1)
    debug_print_response "$logout_response" "User Logout"
    print_result $([[ "$logout_status" == "200" ]] && echo 0 || echo 1) "User Logout"

    # 25. Get User Progress
    echo -e "\n${NC}25. Get User Progress Test${NC}"
    progress_response=$(api_request "GET" "/accounts/progress/" "" "$ACCESS_TOKEN")
    progress_status=$(echo "$progress_response" | cut -d'|' -f1)
    debug_print_response "$progress_response" "Get User Progress"
    print_result $([[ "$progress_status" == "200" ]] && echo 0 || echo 1) "Get User Progress"

    # 26. Get User Flashcard Progress
    echo -e "\n${NC}26. Get User Flashcard Progress Test${NC}"
    flashcard_progress_response=$(api_request "GET" "/accounts/flashcard-progress/" "" "$ACCESS_TOKEN")
    flashcard_progress_status=$(echo "$flashcard_progress_response" | cut -d'|' -f1)
    debug_print_response "$flashcard_progress_response" "Get User Flashcard Progress"
    print_result $([[ "$flashcard_progress_status" == "200" ]] && echo 0 || echo 1) "Get User Flashcard Progress"

    # 27. Get User Quiz Attempts
    echo -e "\n${NC}27. Get User Quiz Attempts Test${NC}"
    quiz_attempts_response=$(api_request "GET" "/accounts/quiz-attempts/" "" "$ACCESS_TOKEN")
    quiz_attempts_status=$(echo "$quiz_attempts_response" | cut -d'|' -f1)
    debug_print_response "$quiz_attempts_response" "Get User Quiz Attempts"
    print_result $([[ "$quiz_attempts_status" == "200" ]] && echo 0 || echo 1) "Get User Quiz Attempts"

    # 28. Get Level Test Details
    echo -e "\n${NC}28. Get Level Test Details Test${NC}"
    level_test_response=$(api_request "GET" "/lessons/level-tests/1/" "" "$ACCESS_TOKEN") # Replace 1 with a valid level test ID
    level_test_status=$(echo "$level_test_response" | cut -d'|' -f1)
    debug_print_response "$level_test_response" "Get Level Test Details"
    print_result $([[ "$level_test_status" == "200" ]] && echo 0 || echo 1) "Get Level Test Details"

    # 29. Get User's Completed Lessons
    echo -e "\n${NC}29. Get User's Completed Lessons Test${NC}"
    completed_lessons_response=$(api_request "GET" "/accounts/completed-lessons/" "" "$ACCESS_TOKEN")
    completed_lessons_status=$(echo "$completed_lessons_response" | cut -d'|' -f1)
    debug_print_response "$completed_lessons_response" "Get User's Completed Lessons"
    print_result $([[ "$completed_lessons_status" == "200" ]] && echo 0 || echo 1) "Get User's Completed Lessons"

    # 30. Chatbot Response
    echo -e "\n${NC}25. Chatbot Response Test${NC}"
    chatbot_response=$(api_request "POST" "/chatbot/chatbot/" "{
        \"input\": \"Hello\"
    }")
    chatbot_status=$(echo "$chatbot_response" | cut -d'|' -f1)
    debug_print_response "$chatbot_response" "Chatbot Response"
    print_result $([[ "$chatbot_status" == "200" ]] && echo 0 || echo 1) "Chatbot Response"

    echo -e "\n${GREEN}All endpoint tests completed!${NC}"
}

# Run tests and capture overall success
run_tests
RESULT=$?

exit $RESULT
