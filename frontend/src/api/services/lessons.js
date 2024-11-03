import axios from '../axios';

export default {
  getLessons() {
    return axios.get('/lessons/');
  },
  getLesson(lessonId) {
    return axios.get(`/lessons/${lessonId}/`);
  },
  getFlashcards(lessonId) {
    return axios.get(`/flashcards/?lesson=${lessonId}`);
  },
  getQuizzes(lessonId) {
    return axios.get(`/quizzes/?lesson=${lessonId}`);
  },
  submitFlashcard(flashcardId, answer) {
    return axios.post(`/flashcard-submit/${flashcardId}/`, { answer });
  },
  submitQuiz(quizId, answers) {
    return axios.post(`/quiz-submit/${quizId}/`, { answers });
  },
  recommendNextLesson() {
    return axios.get('/recommend-next-lesson/');
  },
};

