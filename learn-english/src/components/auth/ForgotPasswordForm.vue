<template>
  <div class="forgot-password-form">
    <form @submit.prevent="submit">
      <input
        type="email"
        v-model="email"
        placeholder="Enter your email"
        required
        autocomplete="email"
      />
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ForgotPasswordForm',
  setup() {
    const store = useStore();
    const email = ref('');
    const isLoading = ref(false);

    const submit = async () => {
      isLoading.value = true;
      try {
        await store.dispatch('auth/forgotPassword', email.value);
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      isLoading,
      submit,
    };
  },
};
</script>
