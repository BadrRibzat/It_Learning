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

# 1. Test User Registration
echo -e "\n${BLUE}1. Testing User Registration${NC}"
register_data='{
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "TestPass123!",
    "password_confirmation": "TestPass123!",
    "language": "en"
}'
test_endpoint "POST" "/accounts/register/" "$register_data" "User Registration"

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
reset_data='{
    "email": "testuser@example.com"
}'
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
echo -e "\n${BLUE}9. Testing Note Creation${NC}"
note_data='{
    "title": "Test Note",
    "content": "This is a test note content",
    "note_type": "general"
}'
test_endpoint "POST" "/accounts/notes/" "$note_data" "Note Creation" "$ACCESS_TOKEN"

# 10. Test Token Refresh
echo -e "\n${BLUE}10. Testing Token Refresh${NC}"
refresh_data="{\"refresh\":\"$REFRESH_TOKEN\"}"
test_endpoint "POST" "/accounts/token/refresh/" "$refresh_data" "Token Refresh"

# 11. Test Upload Profile Picture
echo -e "\n${BLUE}11. Testing Upload Profile Picture${NC}"
test_endpoint "POST" "/accounts/upload-profile-picture/" "" "Upload Profile Picture" "$ACCESS_TOKEN" "/home/badr/Downloads/avatar.jpg"

# 12. Test Reset Progress
echo -e "\n${BLUE}12. Testing Reset Progress${NC}"
test_endpoint "POST" "/accounts/reset-progress/" "" "Reset Progress" "$ACCESS_TOKEN"

# 13. Test Delete Profile Picture
echo -e "\n${BLUE}13. Testing Delete Profile Picture${NC}"
test_endpoint "DELETE" "/accounts/delete-profile-picture/" "" "Delete Profile Picture" "$ACCESS_TOKEN"

# 14. Test Levels
echo -e "\n${BLUE}14. Testing Levels${NC}"
test_endpoint "GET" "/lessons/levels/" "" "Levels" "$ACCESS_TOKEN"

# 15. Test Lessons
echo -e "\n${BLUE}15. Testing Lessons${NC}"
test_endpoint "GET" "/lessons/lessons/" "" "Lessons" "$ACCESS_TOKEN"

# 16. Test Flashcards
echo -e "\n${BLUE}16. Testing Flashcards${NC}"
test_endpoint "GET" "/lessons/flashcards/" "" "Flashcards" "$ACCESS_TOKEN"

# 17. Test Quizzes
echo -e "\n${BLUE}17. Testing Quizzes${NC}"
test_endpoint "GET" "/lessons/quizzes/" "" "Quizzes" "$ACCESS_TOKEN"

# 18. Test User Progress
echo -e "\n${BLUE}18. Testing User Progress${NC}"
test_endpoint "GET" "/lessons/progress/" "" "User Progress" "$ACCESS_TOKEN"

# 19. Test Learning Metrics
echo -e "\n${BLUE}19. Testing Learning Metrics${NC}"
test_endpoint "GET" "/lessons/progress/learning-metrics/" "" "Learning Metrics" "$ACCESS_TOKEN"

# 20. Test Comprehensive Learning Report
echo -e "\n${BLUE}20. Testing Comprehensive Learning Report${NC}"
test_endpoint "GET" "/lessons/progress/comprehensive-learning-report/" "" "Comprehensive Learning Report" "$ACCESS_TOKEN"

# 21. Test Logout
echo -e "\n${BLUE}21. Testing Logout${NC}"
logout_data="{\"refresh\":\"$REFRESH_TOKEN\"}"
test_endpoint "POST" "/accounts/logout/" "$logout_data" "Logout" "$ACCESS_TOKEN"

echo -e "\n${GREEN}All tests completed!${NC}"
