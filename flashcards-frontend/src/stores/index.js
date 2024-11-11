import { createStore } from 'vuex';
import app from './app';
import auth from './auth';
import flashcards from './flashcards';
import lessons from './lessons';
import levels from './levels';
import notes from './notes';
import profile from './profile';
import statistics from './statistics';
import progress from './progress';
import quizzes from './quizzes';
import chatbot from './chatbot';

export default createStore({
  modules: {
    app,
    auth,
    flashcards,
    lessons,
    levels,
    notes,
    profile,
    statistics,
    progress,
    quizzes,
    chatbot,
  },
});
