import { createStore } from 'vuex';
import auth from './modules/auth';
import profile from './modules/profile';
import lessons from './modules/lessons';
import progress from './modules/progress';

export default createStore({
  modules: {
    auth,
    profile,
    lessons,
    progress
  }
});
