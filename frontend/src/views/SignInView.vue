<template>
  <div class="sign-in">
    <h1>Sign In</h1>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'SignInView',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    ...mapActions(['login']),
    async login() {
      await this.login({ email: this.email, password: this.password });
      this.$router.push('/dashboard');
    },
  },
};
</script>
