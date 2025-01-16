<template>
  <div class="verify-email-form">
    <form @submit.prevent="submit">
      <input
        type="text"
        v-model="token"
        placeholder="Enter verification token"
        required
        autocomplete="one-time-code"
      />
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Verifying...' : 'Verify Email' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'VerifyEmailForm',
  setup() {
    const store = useStore();
    const token = ref('');
    const isLoading = ref(false);

    const submit = async () => {
      isLoading.value = true;
      try {
        await store.dispatch('auth/verifyEmail', token.value);
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      token,
      isLoading,
      submit,
    };
  },
};
</script>
