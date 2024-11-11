import { reactive } from 'vue';

export default function createBaseStore(initialState) {
  const state = reactive(initialState);

  const setState = (newState) => {
    Object.assign(state, newState);
  };

  const resetState = () => {
    Object.assign(state, initialState);
  };

  return {
    state,
    setState,
    resetState,
  };
}
