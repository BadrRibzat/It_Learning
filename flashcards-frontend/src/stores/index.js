import { createStore } from 'vuex';
import auth from './auth';
import flashcards from './flashcards';
import lessons from './lessons';
import levels from './levels';
import notes from './notes';
import profile from './profile';
import progress from './progress';
import quizzes from './quizzes';

export default createStore({
  modules: {
    auth,
    flashcards,
    lessons,
    levels,
    notes,
    profile,
    progress,
    quizzes,
  },
});
