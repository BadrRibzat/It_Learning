<template>
  <div class="forgot-password-view">
    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <button type="submit">Reset Password</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      email: '',
    };
  },
  methods: {
    ...mapActions('auth', ['resetPassword']),
    async handleSubmit() {
      try {
        await this.resetPassword(this.email);
        alert('Password reset email sent');
      } catch (error) {
        console.error('Password reset failed:', error);
      }
    },
  },
};
</script>

<style scoped>
.forgot-password-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
