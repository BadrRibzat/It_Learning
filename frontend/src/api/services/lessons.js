import axios from '../axios';

export const lessonService = {
  getLevels: () => axios.get('/api/levels/'),
  getLessons: (levelId) => axios.get(`/api/lessons/${levelId ? `?level=${levelId}` : ''}`),
  getLesson: (lessonId) => axios.get(`/api/lessons/${lessonId}/`),
  getFlashcards: (lessonId) => axios.get(`/api/flashcards/?lesson=${lessonId}`),
  getQuizzes: (lessonId) => axios.get(`/api/quizzes/?lesson=${lessonId}`),
  submitFlashcard: (flashcardId, answer) => axios.post(`/api/flashcard-submit/${flashcardId}/`, { answer }),
  submitQuiz: (quizId, answers) => axios.post(`/api/quizzes/${quizId}/submit/`, { answers }),
  getLevelTests: () => axios.get('/api/level-tests/'),
  getLevelTest: (testId) => axios.get(`/api/level-tests/${testId}/`),
  submitLevelTest: (testId, score) => axios.post(`/api/level-test-submit/${testId}/`, { score }),
  getUserProgress: () => axios.get('/api/user-progress/'),
  getRecommendedLessons: () => axios.get('/api/recommended-lessons/'),
  updateCurrentLesson: (lessonId) => axios.post('/api/update-current-lesson/', { lesson_id: lessonId }),
};
