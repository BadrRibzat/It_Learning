#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Base URL
BASE_URL="http://127.0.0.1:8000"

# Test user credentials
USERNAME="testuser"
EMAIL="test@example.com"
PASSWORD="TestPassword123!"

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
    echo "$response" | grep -o "\"$token_type\":\"[^\"]*\"" | cut -d'"' -f4
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
    ACCESS_TOKEN=$(echo "$login_response" | cut -d'|' -f2 | grep -o "\"access\":\"[^\"]*\"" | cut -d'"' -f4)
    REFRESH_TOKEN=$(echo "$login_response" | cut -d'|' -f2 | grep -o "\"refresh\":\"[^\"]*\"" | cut -d'"' -f4)
    print_result $([[ "$login_status" == "200" ]] && echo 0 || echo 1) "User Login"

    # Authentication check
    if [ -z "$ACCESS_TOKEN" ]; then
        echo -e "${RED}✗ Authentication Failed. Exiting tests.${NC}"
        exit 1
    fi

    # 3. Upload Profile Picture
    echo -e "\n${NC}3. Upload Profile Picture Test${NC}"
    upload_response=$(curl -s -w "%{http_code}" -X POST -H "Authorization: Bearer $ACCESS_TOKEN" -F "profile_picture=@test_image.jpg" "$BASE_URL/accounts/upload-profile-picture/")
    upload_status=$(echo "$upload_response" | cut -d'|' -f1)
    debug_print_response "$upload_response" "Upload Profile Picture"
    print_result $([[ "$upload_status" == "200" ]] && echo 0 || echo 1) "Upload Profile Picture"

    # 4. Delete Profile Picture
    echo -e "\n${NC}4. Delete Profile Picture Test${NC}"
    delete_response=$(api_request "DELETE" "/accounts/delete-profile-picture/" "" "$ACCESS_TOKEN")
    delete_status=$(echo "$delete_response" | cut -d'|' -f1)
    debug_print_response "$delete_response" "Delete Profile Picture"
    print_result $([[ "$delete_status" == "200" ]] && echo 0 || echo 1) "Delete Profile Picture"

    # 5. Reset Progress
    echo -e "\n${NC}5. Reset Progress Test${NC}"
    reset_response=$(api_request "POST" "/accounts/reset-progress/" "" "$ACCESS_TOKEN")
    reset_status=$(echo "$reset_response" | cut -d'|' -f1)
    debug_print_response "$reset_response" "Reset Progress"
    print_result $([[ "$reset_status" == "200" ]] && echo 0 || echo 1) "Reset Progress"

    # 6. Get User Profile
    echo -e "\n${NC}6. Get User Profile Test${NC}"
    profile_response=$(api_request "GET" "/accounts/profile/" "" "$ACCESS_TOKEN")
    profile_status=$(echo "$profile_response" | cut -d'|' -f1)
    debug_print_response "$profile_response" "Get User Profile"
    print_result $([[ "$profile_status" == "200" ]] && echo 0 || echo 1) "Get User Profile"

    # 7. Get User Statistics
    echo -e "\n${NC}7. Get User Statistics Test${NC}"
    stats_response=$(api_request "GET" "/accounts/statistics/" "" "$ACCESS_TOKEN")
    stats_status=$(echo "$stats_response" | cut -d'|' -f1)
    debug_print_response "$stats_response" "Get User Statistics"
    print_result $([[ "$stats_status" == "200" ]] && echo 0 || echo 1) "Get User Statistics"

    # 8. Get Recommended Lessons
    echo -e "\n${NC}8. Get Recommended Lessons Test${NC}"
    recommended_response=$(api_request "GET" "/accounts/recommended-lessons/" "" "$ACCESS_TOKEN")
    recommended_status=$(echo "$recommended_response" | cut -d'|' -f1)
    debug_print_response "$recommended_response" "Get Recommended Lessons"
    print_result $([[ "$recommended_status" == "200" ]] && echo 0 || echo 1) "Get Recommended Lessons"

    # 9. Get Levels
    echo -e "\n${NC}9. Get Levels Test${NC}"
    levels_response=$(api_request "GET" "/lessons/levels/" "" "$ACCESS_TOKEN")
    levels_status=$(echo "$levels_response" | cut -d'|' -f1)
    debug_print_response "$levels_response" "Get Levels"
    print_result $([[ "$levels_status" == "200" ]] && echo 0 || echo 1) "Get Levels"

    # 10. Get Lessons for a Level
    echo -e "\n${NC}10. Get Lessons for a Level Test${NC}"
    first_level_id=$(echo "$levels_response" | cut -d'|' -f2 | grep -o '"id":[0-9]*' | cut -d':' -f2 | head -n 1)
    lessons_response=$(api_request "GET" "/lessons/levels/$first_level_id/lessons/" "" "$ACCESS_TOKEN")
    lessons_status=$(echo "$lessons_response" | cut -d'|' -f1)
    debug_print_response "$lessons_response" "Get Lessons for a Level"
    print_result $([[ "$lessons_status" == "200" ]] && echo 0 || echo 1) "Get Lessons for a Level"

    # 11. Get Flashcards for a Lesson
    echo -e "\n${NC}11. Get Flashcards for a Lesson Test${NC}"
    first_lesson_id=$(echo "$lessons_response" | cut -d'|' -f2 | grep -o '"id":[0-9]*' | cut -d':' -f2 | head -n 1)
    flashcards_response=$(api_request "GET" "/lessons/lessons/$first_lesson_id/flashcards/" "" "$ACCESS_TOKEN")
    flashcards_status=$(echo "$flashcards_response" | cut -d'|' -f1)
    debug_print_response "$flashcards_response" "Get Flashcards for a Lesson"
    print_result $([[ "$flashcards_status" == "200" ]] && echo 0 || echo 1) "Get Flashcards for a Lesson"

    # 12. Submit Flashcard
    echo -e "\n${NC}12. Submit Flashcard Test${NC}"
    first_flashcard_id=$(echo "$flashcards_response" | cut -d'|' -f2 | grep -o '"id":[0-9]*' | cut -d':' -f2 | head -n 1)
    flashcard_response=$(api_request "POST" "/lessons/submissions/flashcards/" "{
        \"flashcard_id\": $first_flashcard_id,
        \"user_answer\": \"test\"
    }" "$ACCESS_TOKEN")
    flashcard_status=$(echo "$flashcard_response" | cut -d'|' -f1)
    debug_print_response "$flashcard_response" "Submit Flashcard"
    print_result $([[ "$flashcard_status" == "200" ]] && echo 0 || echo 1) "Submit Flashcard"

    # 13. Get Quiz for a Lesson
    echo -e "\n${NC}13. Get Quiz for a Lesson Test${NC}"
    quiz_response=$(api_request "GET" "/lessons/lessons/$first_lesson_id/quiz/" "" "$ACCESS_TOKEN")
    quiz_status=$(echo "$quiz_response" | cut -d'|' -f1)
    debug_print_response "$quiz_response" "Get Quiz for a Lesson"
    print_result $([[ "$quiz_status" == "200" ]] && echo 0 || echo 1) "Get Quiz for a Lesson"

    # 14. Get Quiz Questions
    echo -e "\n${NC}14. Get Quiz Questions Test${NC}"
    first_quiz_id=$(echo "$quiz_response" | cut -d'|' -f2 | grep -o '"id":[0-9]*' | cut -d':' -f2 | head -n 1)
    quiz_questions_response=$(api_request "GET" "/lessons/quizzes/$first_quiz_id/questions/" "" "$ACCESS_TOKEN")
    quiz_questions_status=$(echo "$quiz_questions_response" | cut -d'|' -f1)
    debug_print_response "$quiz_questions_response" "Get Quiz Questions"
    print_result $([[ "$quiz_questions_status" == "200" ]] && echo 0 || echo 1) "Get Quiz Questions"

    # 15. Submit Quiz
    echo -e "\n${NC}15. Submit Quiz Test${NC}"
    first_quiz_question_id=$(echo "$quiz_questions_response" | cut -d'|' -f2 | grep -o '"id":[0-9]*' | cut -d':' -f2 | head -n 1)
    quiz_submit_response=$(api_request "POST" "/lessons/submissions/quizzes/" "{
        \"quiz_id\": $first_quiz_id,
        \"answers\": [
            {
                \"question_id\": $first_quiz_question_id,
                \"user_answer\": \"test\"
            }
        ]
    }" "$ACCESS_TOKEN")
    quiz_submit_status=$(echo "$quiz_submit_response" | cut -d'|' -f1)
    debug_print_response "$quiz_submit_response" "Submit Quiz"
    print_result $([[ "$quiz_submit_status" == "200" ]] && echo 0 || echo 1) "Submit Quiz"

    # 16. Get Level Test Progress
    echo -e "\n${NC}16. Get Level Test Progress Test${NC}"
    level_test_progress_response=$(api_request "GET" "/lessons/level-tests/progress/" "" "$ACCESS_TOKEN")
    level_test_progress_status=$(echo "$level_test_progress_response" | cut -d'|' -f1)
    debug_print_response "$level_test_progress_response" "Get Level Test Progress"
    print_result $([[ "$level_test_progress_status" == "200" ]] && echo 0 || echo 1) "Get Level Test Progress"

    # 17. Submit Level Test
echo -e "\n${NC}17. Submit Level Test Test${NC}"

	# Fetch the Intermediate level
	intermediate_level_response=$(api_request "GET" "/lessons/levels/?difficulty=intermediate" "" "$ACCESS_TOKEN")
	intermediate_level_status=$(echo "$intermediate_level_response" | cut -d'|' -f1)
	debug_print_response "$intermediate_level_response" "Get Intermediate Level"

	if [ "$intermediate_level_status" == "200" ]; then
	    intermediate_level_id=$(echo "$intermediate_level_response" | cut -d'|' -f2 | grep -o '"id":[0-9]*' | cut -d':' -f2 | head -n 1)

	    if [ -z "$intermediate_level_id" ]; then
	        echo -e "${RED}✗ Submit Level Test: No valid Intermediate level ID found.${NC}"
	    else
        # Fetch the level test for the Intermediate level
        level_test_response=$(api_request "GET" "/lessons/level-tests/?level=$intermediate_level_id" "" "$ACCESS_TOKEN")
        level_test_status=$(echo "$level_test_response" | cut -d'|' -f1)
        debug_print_response "$level_test_response" "Get Level Test for Intermediate Level"

        if [ "$level_test_status" == "200" ]; then
            first_level_test_id=$(echo "$level_test_response" | cut -d'|' -f2 | grep -o '"id":[0-9]*' | cut -d':' -f2 | head -n 1)

            if [ -z "$first_level_test_id" ]; then
                echo -e "${RED}✗ Submit Level Test: No valid level test ID found for Intermediate level.${NC}"
            else
                # Fetch all questions for the level test
                level_test_questions_response=$(api_request "GET" "/lessons/level-tests/$first_level_test_id/questions/" "" "$ACCESS_TOKEN")
                level_test_questions_status=$(echo "$level_test_questions_response" | cut -d'|' -f1)
                debug_print_response "$level_test_questions_response" "Get Level Test Questions"

                if [ "$level_test_questions_status" == "200" ]; then
                    # Extract all question IDs and construct the answers payload
                    question_ids=$(echo "$level_test_questions_response" | cut -d'|' -f2 | grep -o '"id":[0-9]*' | cut -d':' -f2)
                    answers_payload="["
                    for question_id in $question_ids; do
                        answers_payload+="{\"question_id\":$question_id,\"user_answer\":\"test\"},"
                    done
                    answers_payload="${answers_payload%,}]"

                    level_test_submit_response=$(api_request "POST" "/lessons/submissions/level-tests/" "{
                        \"level_test_id\": $first_level_test_id,
                        \"answers\": $answers_payload
                    }" "$ACCESS_TOKEN")
                    level_test_submit_status=$(echo "$level_test_submit_response" | cut -d'|' -f1)
                    debug_print_response "$level_test_submit_response" "Submit Level Test"
                    print_result $([[ "$level_test_submit_status" == "200" ]] && echo 0 || echo 1) "Submit Level Test"
                else
                    echo -e "${RED}✗ Submit Level Test: Failed to fetch level test questions.${NC}"
                fi
            fi
        else
            echo -e "${RED}✗ Submit Level Test: Failed to fetch level test for Intermediate level.${NC}"
        fi
    fi
else
    echo -e "${RED}✗ Submit Level Test: Failed to fetch Intermediate level.${NC}"
fi
    # 18. Chatbot Response
    echo -e "\n${NC}18. Chatbot Response Test${NC}"
    chatbot_response=$(api_request "POST" "/chatbot/chatbot/" "{
        \"input\": \"Hello\"
    }")
    chatbot_status=$(echo "$chatbot_response" | cut -d'|' -f1)
    debug_print_response "$chatbot_response" "Chatbot Response"
    print_result $([[ "$chatbot_status" == "200" ]] && echo 0 || echo 1) "Chatbot Response"

    # 19. Logout
    echo -e "\n${NC}19. Logout Test${NC}"
    logout_response=$(api_request "POST" "/accounts/logout/" "{
        \"refresh_token\": \"$REFRESH_TOKEN\"
    }" "$ACCESS_TOKEN")
    logout_status=$(echo "$logout_response" | cut -d'|' -f1)
    debug_print_response "$logout_response" "User Logout"
    print_result $([[ "$logout_status" == "200" ]] && echo 0 || echo 1) "User Logout"

    echo -e "\n${GREEN}All endpoint tests completed!${NC}"
}

# Run tests and capture overall success
run_tests
RESULT=$?

exit $RESULT
