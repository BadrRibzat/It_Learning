import { createStore, Store } from "vuex";
import auth from "./modules/auth";
import lessons from "./modules/lessons";
import progress from "./modules/progress";

export default createStore({
  modules: {
    auth,
    lessons,
    progress,
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
}) as Store<any>;
