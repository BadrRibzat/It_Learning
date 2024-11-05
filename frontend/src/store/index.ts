import { createStore } from "vuex";
import auth from "./modules/auth";
import lessons from "./modules/lessons";
import progress from "./modules/progress";
import levels from "./modules/levels";

interface RootState {
  loading: boolean;
  error: string | null;
}

export default createStore<RootState>({
  modules: {
    auth,
    lessons,
    progress,
    levels,
  },
  state: {
    loading: false,
    error: null,
  },
  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    setLoading({ commit }, loading) {
      commit("SET_LOADING", loading);
    },
    setError({ commit }, error) {
      commit("SET_ERROR", error);
    },
  },
});
