import { createStore } from 'vuex';
import auth from './modules/auth';
import profile from './modules/profile';
import chatbot from './modules/chatbot';

const store = createStore({
  modules: {
    auth,
    profile,
    chatbot,
  }
});

export default store;
