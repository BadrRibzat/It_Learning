<template>
  <div class="sign-up">
    <h1>Sign Up</h1>
    <form @submit.prevent="handleRegister">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div>
        <label for="passwordConfirmation">Confirm Password:</label>
        <input type="password" id="passwordConfirmation" v-model="passwordConfirmation" required />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'SignUpView',
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
    async handleRegister() {
      if (this.password !== this.passwordConfirmation) {
        alert('Passwords do not match');
        return;
      }
      try {
        await this.register({
          username: this.username,
          email: this.email,
          password: this.password,
          password_confirmation: this.passwordConfirmation,
        });
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    },
  },
};
</script>

<style scoped>
.sign-up {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
}

form {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 2rem;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

label {
  margin-bottom: 0.5rem;
}

input {
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #35495e;
}
</style>
