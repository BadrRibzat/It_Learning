import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default {
  register(user) {
    return apiClient.post('/register/', user)
  },
  login(credentials) {
    return apiClient.post('/login/', credentials)
  },
  logout() {
    return apiClient.post('/logout/')
  },
  getProfile() {
    return apiClient.get('/profile/')
  },
  getLessons() {
    return apiClient.get('/lessons/')
  },
  getFlashcards() {
    return apiClient.get('/flashcards/')
  },
  getQuizzes() {
    return apiClient.get('/quizzes/')
  },
  getLevelTests() {
    return apiClient.get('/level-tests/')
  },
  getUserProgress() {
    return apiClient.get('/user-progress/')
  },
  getRecommendedLessons() {
    return apiClient.get('/recommended-lessons/')
  },
  getChatbotResponse(input) {
    return apiClient.post('/chat/', { input })
  },
}
