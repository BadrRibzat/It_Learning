import axiosInstance from './axios';

const progressService = {
  getUserProgress: () => axiosInstance.get('/user-progress/'),
  getUserFlashcardProgress: () => axiosInstance.get('/user-flashcard-progress/'),
  getUserLevelProgress: () => axiosInstance.get('/user-level-progress/'),
  getUserQuizAttempts: () => axiosInstance.get('/user-quiz-attempts/'),
};

export default progressService;
