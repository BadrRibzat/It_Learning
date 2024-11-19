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
    elif [[ "$http_status" == "302" ]]; then
        echo -e "${GREEN}Redirect (Status $http_status):${NC}"
        echo "$response"
        log "Redirect: $description - Status $http_status"
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

# 3. Test Email Verification Request
echo -e "\n${BLUE}3. Testing Email Verification Request${NC}"
test_endpoint "POST" "/accounts/resend-verification/" "" "Email Verification Request" "$ACCESS_TOKEN"

# 4. Test Password Reset Request
echo -e "\n${BLUE}4. Testing Password Reset Request${NC}"
reset_data='{"email": "testuser@example.com"}'
test_endpoint "POST" "/accounts/password-reset/" "$reset_data" "Password Reset Request"

# 5. Test Profile Retrieval
echo -e "\n${BLUE}5. Testing Profile Retrieval${NC}"
test_endpoint "GET" "/accounts/profile/" "" "Profile Retrieval" "$ACCESS_TOKEN"

# 6. Test User Statistics
echo -e "\n${BLUE}6. Testing User Statistics${NC}"
test_endpoint "GET" "/accounts/statistics/" "" "User Statistics" "$ACCESS_TOKEN"

# 7. Test MFA Setup
echo -e "\n${BLUE}7. Testing MFA Setup${NC}"
test_endpoint "POST" "/accounts/mfa/setup/" "" "MFA Setup" "$ACCESS_TOKEN"

# 8. Test Recommended Lessons
echo -e "\n${BLUE}8. Testing Recommended Lessons${NC}"
test_endpoint "GET" "/accounts/recommended-lessons/" "" "Recommended Lessons" "$ACCESS_TOKEN"

# 9. Test Note Creation
# Test Create Note
echo -e "\n${BLUE}1. Testing Note Creation${NC}"
create_note_data='{
    "title": "My First Learning Note",
    "content": "Today I learned some important English grammar rules about verb tenses.",
    "note_type": "grammar"
}'
create_response=$(curl -s -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d "$create_note_data" \
    "${BASE_URL}/accounts/notes/")

NOTE_ID=$(echo "${create_response:0:${#create_response}-3}" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
HTTP_STATUS=${create_response: -3}

if [ "$HTTP_STATUS" == "201" ]; then
    echo -e "${GREEN}Note Created Successfully with ID: $NOTE_ID${NC}"
else
    echo -e "${RED}Note Creation Failed${NC}"
    exit 1
fi

# Test Read (List) Notes
echo -e "\n${BLUE}2. Testing Note Listing${NC}"
list_response=$(curl -s -w "%{http_code}" -X GET \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    "${BASE_URL}/accounts/notes/")

HTTP_STATUS=${list_response: -3}
RESPONSE_BODY=${list_response:0:${#list_response}-3}

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN}Notes Retrieved Successfully:${NC}"
    echo "$RESPONSE_BODY" | python3 -m json.tool
else
    echo -e "${RED}Note Listing Failed${NC}"
fi

# Test Read (Retrieve Single Note)
echo -e "\n${BLUE}3. Testing Single Note Retrieval${NC}"
retrieve_response=$(curl -s -w "%{http_code}" -X GET \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    "${BASE_URL}/accounts/notes/$NOTE_ID/")

HTTP_STATUS=${retrieve_response: -3}
RESPONSE_BODY=${retrieve_response:0:${#retrieve_response}-3}

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN}Note Retrieved Successfully:${NC}"
    echo "$RESPONSE_BODY" | python3 -m json.tool
else
    echo -e "${RED}Note Retrieval Failed${NC}"
fi

# Test Update Note
echo -e "\n${BLUE}4. Testing Note Update${NC}"
update_note_data='{
    "title": "Updated Learning Note",
    "content": "I have expanded my understanding of English grammar rules.",
    "note_type": "grammar"
}'
update_response=$(curl -s -w "%{http_code}" -X PUT \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d "$update_note_data" \
    "${BASE_URL}/accounts/notes/$NOTE_ID/")

HTTP_STATUS=${update_response: -3}
RESPONSE_BODY=${update_response:0:${#update_response}-3}

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN}Note Updated Successfully:${NC}"
    echo "$RESPONSE_BODY" | python3 -m json.tool
else
    echo -e "${RED}Note Update Failed${NC}"
fi

# Test Partial Update (Patch) Note Type
echo -e "\n${BLUE}5. Testing Note Type Change${NC}"
change_type_data='{
    "note_type": "vocabulary"
}'
change_type_response=$(curl -s -w "%{http_code}" -X PATCH \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d "$change_type_data" \
    "${BASE_URL}/accounts/notes/$NOTE_ID/change-type/")

HTTP_STATUS=${change_type_response: -3}
RESPONSE_BODY=${change_type_response:0:${#change_type_response}-3}

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN}Note Type Changed Successfully:${NC}"
    echo "$RESPONSE_BODY" | python3 -m json.tool
else
    echo -e "${RED}Note Type Change Failed${NC}"
fi

# Test Note Search
echo -e "\n${BLUE}6. Testing Note Search${NC}"
search_response=$(curl -s -w "%{http_code}" -X GET \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    "${BASE_URL}/accounts/notes/search/?q=grammar")

HTTP_STATUS=${search_response: -3}
RESPONSE_BODY=${search_response:0:${#search_response}-3}

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN}Note Search Successful:${NC}"
    echo "$RESPONSE_BODY" | python3 -m json.tool
else
    echo -e "${RED}Note Search Failed${NC}"
fi

# Test Delete Note
echo -e "\n${BLUE}7. Testing Note Deletion${NC}"
delete_response=$(curl -s -w "%{http_code}" -X DELETE \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    "${BASE_URL}/accounts/notes/$NOTE_ID/")

HTTP_STATUS=${delete_response: -3}

if [ "$HTTP_STATUS" == "204" ]; then
    echo -e "${GREEN}Note Deleted Successfully${NC}"
else
    echo -e "${RED}Note Deletion Failed${NC}"
fi

echo -e "\n${GREEN}All Note CRUD Tests Completed!${NC}"

# 12. Test Token Refresh
echo -e "\n${BLUE}10. Testing Token Refresh${NC}"
refresh_data="{\"refresh\":\"$REFRESH_TOKEN\"}"
test_endpoint "POST" "/accounts/token/refresh/" "$refresh_data" "Token Refresh"

# 13. Test Upload Profile Picture
echo -e "\n${BLUE}11. Testing Upload Profile Picture${NC}"
test_endpoint "POST" "/accounts/upload-profile-picture/" "" "Upload Profile Picture" "$ACCESS_TOKEN" "/home/badr/Downloads/avatar.jpg"

# 14. Test Reset Progress
echo -e "\n${BLUE}12. Testing Reset Progress${NC}"
test_endpoint "POST" "/accounts/reset-progress/" "" "Reset Progress" "$ACCESS_TOKEN"

# 15. Test Reset Progress Details
echo -e "\n${BLUE}22. Testing Reset Progress Details${NC}"
test_endpoint "GET" "/accounts/reset-progress-details/" "" "Reset Progress Details" "$ACCESS_TOKEN"

# 16. Test Delete Profile Picture
echo -e "\n${BLUE}13. Testing Delete Profile Picture${NC}"
test_endpoint "DELETE" "/accounts/delete-profile-picture/" "" "Delete Profile Picture" "$ACCESS_TOKEN"

# 17. Test Levels
echo -e "\n${BLUE}14. Testing Levels${NC}"
test_endpoint "GET" "/lessons/levels/" "" "Levels" "$ACCESS_TOKEN"

# 18. Test Access to Beginner Level
echo -e "\n${BLUE}15. Testing Access to Beginner Level${NC}"
test_endpoint "GET" "/lessons/levels/1/access/" "" "Access to Beginner Level" "$ACCESS_TOKEN"

# 19. Test Access to Intermediate Level (should redirect to level test)
echo -e "\n${BLUE}16. Testing Access to Intermediate Level${NC}"
test_endpoint "GET" "/lessons/levels/2/access/" "" "Access to Intermediate Level" "$ACCESS_TOKEN"

# 20. Test Access to Advanced Level (should redirect to level test)
echo -e "\n${BLUE}17. Testing Access to Advanced Level${NC}"
test_endpoint "GET" "/lessons/levels/3/access/" "" "Access to Advanced Level" "$ACCESS_TOKEN"

# 21. Test Lessons
echo -e "\n${BLUE}18. Testing Lessons${NC}"
test_endpoint "GET" "/lessons/lessons/" "" "Lessons" "$ACCESS_TOKEN"

# 22. Test Flashcards
echo -e "\n${BLUE}19. Testing Flashcards${NC}"
test_endpoint "GET" "/lessons/flashcards/" "" "Flashcards" "$ACCESS_TOKEN"

# 23. Test Quizzes
echo -e "\n${BLUE}20. Testing Quizzes${NC}"
test_endpoint "GET" "/lessons/quizzes/" "" "Quizzes" "$ACCESS_TOKEN"

# 24. Test User Progress
echo -e "\n${BLUE}21. Testing User Progress${NC}"
test_endpoint "GET" "/lessons/progress/learning_progress/" "" "User Progress" "$ACCESS_TOKEN"

# 25. Test Learning Metrics
echo -e "\n${BLUE}22. Testing Learning Metrics${NC}"
test_endpoint "GET" "/lessons/progress/learning-metrics/" "" "Learning Metrics" "$ACCESS_TOKEN"

# 26. Test Comprehensive Learning Report
echo -e "\n${BLUE}23. Testing Comprehensive Learning Report${NC}"
test_endpoint "GET" "/lessons/progress/comprehensive-learning-report/" "" "Comprehensive Learning Report" "$ACCESS_TOKEN"

# 27. Test Submit Intermediate Level Test
echo -e "\n${BLUE}24. Testing Submit Intermediate Level Test${NC}"
intermediate_level_test_id=$(curl -s -X GET \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    "${BASE_URL}/lessons/levels/2/tests/" | python3 -c "import sys, json; print(json.load(sys.stdin)[0]['id'])")

if [ -n "$intermediate_level_test_id" ]; then
    echo -e "${GREEN}Intermediate Level Test ID Found: $intermediate_level_test_id${NC}"
    intermediate_test_answers=$(curl -s -X GET \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        "${BASE_URL}/lessons/tests/${intermediate_level_test_id}/questions/" | python3 -c "import sys, json; print(json.dumps([{ 'question_id': q['id'], 'answer': q['correct_answer'] } for q in json.load(sys.stdin)]))")

    submit_intermediate_test_data="{
        \"answers\": $intermediate_test_answers
    }"
    test_endpoint "POST" "/lessons/tests/${intermediate_level_test_id}/submit/" "$submit_intermediate_test_data" "Submit Intermediate Level Test" "$ACCESS_TOKEN"
else
    echo -e "${RED}Intermediate Level Test ID Not Found${NC}"
    exit 1
fi

# 28. Test Access to Intermediate Level After Passing Test
echo -e "\n${BLUE}25. Testing Access to Intermediate Level After Passing Test${NC}"
test_endpoint "GET" "/lessons/levels/2/access/" "" "Access to Intermediate Level After Passing Test" "$ACCESS_TOKEN"

# 29. Test Submit Advanced Level Test
echo -e "\n${BLUE}26. Testing Submit Advanced Level Test${NC}"
advanced_level_test_id=$(curl -s -X GET \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    "${BASE_URL}/lessons/levels/3/tests/" | python3 -c "import sys, json; print(json.load(sys.stdin)[0]['id'])")

if [ -n "$advanced_level_test_id" ]; then
    echo -e "${GREEN}Advanced Level Test ID Found: $advanced_level_test_id${NC}"
    advanced_test_answers=$(curl -s -X GET \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        "${BASE_URL}/lessons/tests/${advanced_level_test_id}/questions/" | python3 -c "import sys, json; print(json.dumps([{ 'question_id': q['id'], 'answer': q['correct_answer'] } for q in json.load(sys.stdin)]))")

    submit_advanced_test_data="{
        \"answers\": $advanced_test_answers
    }"
    test_endpoint "POST" "/lessons/tests/${advanced_level_test_id}/submit/" "$submit_advanced_test_data" "Submit Advanced Level Test" "$ACCESS_TOKEN"
else
    echo -e "${RED}Advanced Level Test ID Not Found${NC}"
    exit 1
fi

# 30. Test Access to Advanced Level After Passing Test
echo -e "\n${BLUE}27. Testing Access to Advanced Level After Passing Test${NC}"
test_endpoint "GET" "/lessons/levels/3/access/" "" "Access to Advanced Level After Passing Test" "$ACCESS_TOKEN"

# 31. Test Lessons After Passing Advanced Test
echo -e "\n${BLUE}28. Testing Lessons After Passing Advanced Test${NC}"
test_endpoint "GET" "/lessons/lessons/" "" "Lessons After Passing Advanced Test" "$ACCESS_TOKEN"

# 32. Test Logout
echo -e "\n${BLUE}29. Testing Logout${NC}"
logout_data="{\"refresh\":\"$REFRESH_TOKEN\"}"
test_endpoint "POST" "/accounts/logout/" "$logout_data" "Logout" "$ACCESS_TOKEN"

echo -e "\n${GREEN}All tests completed!${NC}"
