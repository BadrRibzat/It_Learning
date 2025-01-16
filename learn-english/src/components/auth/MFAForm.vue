<template>
  <div class="mfa-form">
    <form @submit.prevent="submit">
      <input
        type="text"
        v-model="code"
        placeholder="Enter MFA Code"
        required
        autocomplete="one-time-code"
      />
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Verifying...' : 'Verify' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'MFAForm',
  setup() {
    const store = useStore();
    const code = ref('');
    const isLoading = ref(false);

    const submit = async () => {
      isLoading.value = true;
      try {
        await store.dispatch('auth/verifyMFA', code.value);
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      code,
      isLoading,
      submit,
    };
  },
};
</script>
