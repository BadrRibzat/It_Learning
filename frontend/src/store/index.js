import { createStore } from 'vuex';
import auth from './modules/auth';
import profile from './modules/profile';
import lessons from './modules/lessons';
import chat from './modules/chat';
import notes from './modules/notes';

export default createStore({
  modules: {
    auth,
    profile,
    lessons,
    chat,
    notes,
  },
});
