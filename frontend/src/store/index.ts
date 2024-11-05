import { createStore } from "vuex";
import auth from "./modules/auth";
import lessons from "./modules/lessons";
import progress from "./modules/progress";
import levels from "./modules/levels";
import notes from "./modules/notes";

export interface RootState {
  loading: boolean;
  error: string | null;
}

export default createStore<RootState>({
  modules: {
    auth,
    lessons,
    progress,
    levels,
    notes,
  },
  state: {
    loading: false,
    error: null,
  },
  mutations: {
    SET_LOADING(state, loading: boolean) {
      state.loading = loading;
    },
    SET_ERROR(state, error: string | null) {
      state.error = error;
    },
  },
  actions: {
    setLoading({ commit }, loading: boolean) {
      commit("SET_LOADING", loading);
    },
    setError({ commit }, error: string | null) {
      commit("SET_ERROR", error);
    },
  },
});
