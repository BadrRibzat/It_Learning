<template>
  <div class="register">
    <h1>Sign-Up</h1>
    <form @submit.prevent="register">
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <input type="password" v-model="passwordConfirmation" placeholder="Confirm Password" required />
      <button type="submit">Sign-Up</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'RegisterView',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    };
  },
  methods: {
    ...mapActions(['register']),
    async register() {
      if (this.password !== this.passwordConfirmation) {
        alert('Passwords do not match');
        return;
      }
      await this.register({
        username: this.username,
        email: this.email,
        password: this.password,
      });
      this.$router.push('/dashboard');
    },
  },
};
</script>
