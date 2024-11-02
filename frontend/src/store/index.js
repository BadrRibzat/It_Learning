import { createStore } from 'vuex';
import auth from './modules/auth';
import profile from './modules/profile';
import lessons from './modules/lessons';
import chat from './modules/chat';
import notes from './modules/notes';
import progress from './modules/progress';

export default createStore({
  modules: {
    auth,
    chat,
    lessons,
    notes,
    profile,
    progress,
  },
});
