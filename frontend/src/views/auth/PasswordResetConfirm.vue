<template>
  <div class="password-reset-confirm-view">
    <form @submit.prevent="handleSubmit">
      <input v-model="newPassword" type="password" placeholder="New Password" required />
      <input v-model="confirmPassword" type="password" placeholder="Confirm New Password" required />
      <button type="submit">Confirm Password Reset</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
    };
  },
  methods: {
    ...mapActions('auth', ['confirmPasswordReset']),
    async handleSubmit() {
      if (this.newPassword !== this.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      try {
        await this.confirmPasswordReset({
          uidb64: this.$route.params.uidb64,
          token: this.$route.params.token,
          newPassword: this.newPassword,
        });
        alert('Password reset successful');
        this.$router.push('/login');
      } catch (error) {
        console.error('Password reset confirmation failed:', error);
      }
    },
  },
};
</script>

<style scoped>
.password-reset-confirm-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
