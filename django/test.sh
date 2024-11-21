#!/usr/bin/env bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:8000"
LOG_FILE="test_endpoints.log"

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE"
}

# Flag to track user creation
USER_CREATED=false

# Enhanced test endpoint function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    local auth_header=$5
    local file_path=$6

    echo -e "${YELLOW}Testing:${NC} $description"
    log "Testing: $description"

    # Curl command with verbose error handling
    local response
    local http_status

    if [ -n "$auth_header" ]; then
        if [ -n "$file_path" ]; then
            response=$(curl -s -w "%{http_code}" -X "$method" \
                -H "Authorization: Bearer $auth_header" \
                -F "profile_picture=@$file_path" \
                "${BASE_URL}${endpoint}")
        else
            response=$(curl -s -w "%{http_code}" -X "$method" \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $auth_header" \
                -d "$data" \
                "${BASE_URL}${endpoint}")
        fi
    else
        response=$(curl -s -w "%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "${BASE_URL}${endpoint}")
    fi

    http_status=${response: -3}
    response=${response:0:${#response}-3}

    if [[ "$http_status" == "200" || "$http_status" == "201" ]]; then
        echo -e "${GREEN}Success (Status $http_status):${NC}"
        echo "$response" | python3 -m json.tool
        log "Success: $description - Status $http_status"
    else
        echo -e "${RED}Failed (Status $http_status):${NC}"
        echo "$response"
        log "Failed: $description - Status $http_status"
    fi
}

# 1. Test User Registration (Conditional)
if [ "$USER_CREATED" == "false" ]; then # Only register if not already created
    echo -e "\n${BLUE}1. Testing User Registration${NC}"
    register_data='{
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "TestPass123!",
        "password_confirmation": "TestPass123!",
        "language": "en"
    }'
    test_endpoint "POST" "/accounts/register/" "$register_data" "User Registration"
    USER_CREATED=true # Set the flag
fi

# 2. Test Login
echo -e "\n${BLUE}2. Testing Login${NC}"
login_data='{
    "email": "testuser@example.com",
    "password": "TestPass123!"
}'
login_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "$login_data" \
    "${BASE_URL}/accounts/login/")

ACCESS_TOKEN=$(echo $login_response | python3 -c "import sys, json; print(json.load(sys.stdin)['access'])")
REFRESH_TOKEN=$(echo $login_response | python3 -c "import sys, json; print(json.load(sys.stdin)['refresh'])")

if [ -n "$ACCESS_TOKEN" ]; then
    echo -e "${GREEN}Login Successful - Token Received${NC}"
else
    echo -e "${RED}Login Failed${NC}"
    exit 1
fi

# 16. Test Intermediate Level Test Submission
# Test Intermediate Level Test
echo -e "\n${BLUE}Testing Intermediate Level Test${NC}"

# Get the intermediate level ID
intermediate_level_id=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
    "${BASE_URL}/lessons/levels/" | python3 -c "
import sys, json
data = json.load(sys)
for level in data:
    if level['name'] == 'Intermediate':
        print(level['id'])
        break
")

# Get the intermediate level test
level_test_response=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
    "${BASE_URL}/lessons/leveltests/?level=${intermediate_level_id}")

level_test_id=$(echo "$level_test_response" | python3 -c "
import sys, json
data = json.load(sys)
if data['results']:
    print(data['results'][0]['id'])
")

# Submit intermediate level test with correct answers
test_submission_data='{
    "answers": [
        {"question_id": 1, "answer": "Hello"},
        {"question_id": 2, "answer": "Goodbye"},
        {"question_id": 3, "answer": "Thank you"},
        {"question_id": 4, "answer": "Please"},
        {"question_id": 5, "answer": "Yes"},
        {"question_id": 6, "answer": "No"},
        {"question_id": 7, "answer": "Excuse me"},
        {"question_id": 8, "answer": "Sorry"},
        {"question_id": 9, "answer": "Welcome"},
        {"question_id": 10, "answer": "How are you"}
    ]
}'

echo -e "\n${BLUE}Submitting Intermediate Level Test${NC}"
test_endpoint "POST" "/lessons/levels/${intermediate_level_id}/submit-test/" "$test_submission_data" "Intermediate Level Test Submission" "$ACCESS_TOKEN"

# Test accessing intermediate lessons
echo -e "\n${BLUE}Testing Intermediate Lessons Access${NC}"
test_endpoint "GET" "/lessons/lessons/?level=${intermediate_level_id}" "" "Intermediate Lessons" "$ACCESS_TOKEN"

# Get first intermediate lesson
first_intermediate_lesson=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
    "${BASE_URL}/lessons/lessons/?level=${intermediate_level_id}" | python3 -c "
import sys, json
data = json.load(sys)
if data['results']:
    print(data['results'][0]['id'])
")

# Test intermediate lesson flashcards
echo -e "\n${BLUE}Testing Intermediate Lesson Flashcards${NC}"
test_endpoint "GET" "/lessons/flashcards/?lesson=${first_intermediate_lesson}" "" "Intermediate Flashcards" "$ACCESS_TOKEN"

# Test intermediate lesson quiz
echo -e "\n${BLUE}Testing Intermediate Lesson Quiz${NC}"
test_endpoint "GET" "/lessons/quizzes/?lesson=${first_intermediate_lesson}" "" "Intermediate Quiz" "$ACCESS_TOKEN"

# Submit flashcard answers for intermediate lesson
flashcard_submission_data='{
    "answers": [
        {"flashcard_id": 1, "answer": "is"},
        {"flashcard_id": 2, "answer": "am"},
        {"flashcard_id": 3, "answer": "are"},
        {"flashcard_id": 4, "answer": "was"},
        {"flashcard_id": 5, "answer": "were"}
    ]
}'

echo -e "\n${BLUE}Submitting Intermediate Lesson Flashcards${NC}"
test_endpoint "POST" "/lessons/lessons/${first_intermediate_lesson}/submit-flashcards/" "$flashcard_submission_data" "Intermediate Flashcards Submission" "$ACCESS_TOKEN"

# 17. Test Advanced Level Test Submission (Similar structure to Intermediate)
echo -e "\n${BLUE}17. Testing Advanced Level Test Submission${NC}"

# Fetch Advanced Level Test ID (assuming level ID is 3 for Advanced)
advanced_level_id=3 # Replace with the actual Advanced level ID if different

advanced_level_test=$(curl -s -w "%{http_code}" -X GET \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    "${BASE_URL}/lessons/leveltests/?level=${advanced_level_id}")

HTTP_STATUS=${advanced_level_test: -3}
advanced_level_test=${advanced_level_test:0:${#advanced_level_test}-3}

if [ "$HTTP_STATUS" != "200" ]; then
    echo -e "${RED}Failed to fetch Advanced Level Test data (Status $HTTP_STATUS)${NC}"
    exit 1
fi

# Fetch Advanced Level Test Questions using the corrected endpoint and test ID
advanced_level_test_id=$(echo "$advanced_level_test" | python3 -c "import sys, json; print(json.load(sys.stdin)['results'][0]['id'])")

advanced_level_test_questions=$(curl -s -w "%{http_code}" -X GET \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    "${BASE_URL}/lessons/leveltests/${advanced_level_test_id}/questions/")

HTTP_STATUS=${advanced_level_test_questions: -3}
advanced_level_test_questions=${advanced_level_test_questions:0:${#advanced_level_test_questions}-3}

if [ "$HTTP_STATUS" != "200" ]; then
    echo -e "${RED}Failed to fetch Advanced Level Test Questions (Status $HTTP_STATUS)${NC}"
    exit 1
fi

# Extract question IDs dynamically
advanced_question_ids=$(echo "$advanced_level_test_questions" | python3 -c "import sys, json; print(json.dumps([q['id'] for q in json.load(sys.stdin)]))")

# Prepare dynamic answers – provide correct answers for a valid submission
advanced_level_test_data=$(echo "$advanced_level_test_questions" | python3 -c '
import sys, json

questions = json.load(sys.stdin)
answers = []
for q in questions:
    answers.append({"question_id": q["id"], "answer": q["correct_answer"]})

print(json.dumps({"answers": answers}))
')

test_endpoint "POST" "/levels/${advanced_level_id}/submit-test/" "$advanced_level_test_data" "Advanced Level Test Submission" "$ACCESS_TOKEN"

echo -e "\n${GREEN}All tests completed!${NC}"
