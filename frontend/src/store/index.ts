import { createStore, Store } from 'vuex';
import { InjectionKey } from 'vue';
import auth, { AuthState } from './modules/auth';
import lessons, { LessonsState } from './modules/lessons';
import progress, { ProgressState } from './modules/progress';
import levels, { LevelsState } from './modules/levels';
import notes, { NotesState } from './modules/notes';

export interface RootState {
  loading: boolean;
  error: string | null;
}

export interface State extends RootState {
  auth: AuthState;
  lessons: LessonsState;
  progress: ProgressState;
  levels: LevelsState;
  notes: NotesState;
}

export const key: InjectionKey<Store<State>> = Symbol();

export default createStore<State>({
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
    auth: auth.state as AuthState,
    lessons: lessons.state as LessonsState,
    progress: progress.state as ProgressState,
    levels: levels.state as LevelsState,
    notes: notes.state as NotesState,
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
      commit('SET_LOADING', loading);
    },
    setError({ commit }, error: string | null) {
      commit('SET_ERROR', error);
    },
  },
});
