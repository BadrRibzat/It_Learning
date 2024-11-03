import { createStore } from 'vuex';
import auth from './modules/auth';
import profile from './modules/profile';
import lessons from './modules/lessons';
import flashcards from './modules/flashcards';
import quizzes from './modules/quizzes';
import levelTests from './modules/levelTests';
import notes from './modules/notes';
import chatbot from './modules/chatbot';

export default createStore({
  modules: {
    auth,
    profile,
    lessons,
    flashcards,
    quizzes,
    levelTests,
    notes,
    chatbot,
  },
});
