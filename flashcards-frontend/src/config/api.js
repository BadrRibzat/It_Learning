// src/config/api.js
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    PROFILE: '/auth/profile/',
  },
  LEVELS: {
    LIST: '/levels/',
    DETAIL: (id) => `/levels/${id}/`,
    TEST: (id) => `/levels/${id}/test/`,
  },
  LESSONS: {
    LIST: (levelId) => `/levels/${levelId}/lessons/`,
    DETAIL: (id) => `/lessons/${id}/`,
  },
  FLASHCARDS: {
    LIST: (lessonId) => `/lessons/${lessonId}/flashcards/`,
    DETAIL: (id) => `/flashcards/${id}/`,
    ANSWER: (id) => `/flashcards/${id}/answer/`,
  },
}
