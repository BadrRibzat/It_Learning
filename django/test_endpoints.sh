#!/bin/bash

# Set the base URL for the API
BASE_URL="http://127.0.0.1:8000/api"

# Function to print results
print_result() {
    echo "----------------------------------------"
    echo "Endpoint: $1"
    echo "Status Code: $2"
    echo "Response: $3"
    echo "----------------------------------------"
}

# Test Beginner Lessons
echo "Testing Beginner Lessons..."

# Get the list of beginner lessons
response=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/lessons/?level=1" -H "Content-Type: application/json")
print_result "Get Beginner Lessons" "$response"

# Get the flashcards for a beginner lesson (replace <lesson_id> with an actual lesson ID)
response=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/flashcards/?lesson=1" -H "Content-Type: application/json")
print_result "Get Flashcards for Beginner Lesson" "$response"

# Submit answers for a beginner lesson flashcard (replace <flashcard_id> with an actual flashcard ID)
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/flashcard-submit/1/" -H "Content-Type: application/json" -d '{"answer": "A"}')
print_result "Submit Answer for Beginner Lesson Flashcard" "$response"

# Get the quiz for a beginner lesson (replace <lesson_id> with an actual lesson ID)
response=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/quizzes/?lesson=1" -H "Content-Type: application/json")
print_result "Get Quiz for Beginner Lesson" "$response"

# Submit answers for a beginner lesson quiz (replace <quiz_id> with an actual quiz ID)
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/quiz-submit/1/" -H "Content-Type: application/json" -d '{"answers": [{"question_id": 1, "answer": "A"}]}')
print_result "Submit Answers for Beginner Lesson Quiz" "$response"

# Test Advanced Lessons
echo "Testing Advanced Lessons..."

# Get the list of advanced lessons
response=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/lessons/?level=3" -H "Content-Type: application/json")
print_result "Get Advanced Lessons" "$response"

# Get the level test for the advanced level
response=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/level-tests/?level=3" -H "Content-Type: application/json")
print_result "Get Level Test for Advanced Level" "$response"

# Submit answers for the advanced level test (replace <level_test_id> with an actual level test ID)
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/level-test-submit/3/" -H "Content-Type: application/json" -d '{"answers": [{"question_id": 72, "answer": "Break a leg"}]}')
print_result "Submit Answers for Advanced Level Test" "$response"
