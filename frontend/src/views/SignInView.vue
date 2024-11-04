<template>
  <div class="sign-in">
    <h1>Sign In</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Sign In</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
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
      error: null,
    };
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      try {
        this.error = null;
        await this.login({
          email: this.email,
          password: this.password,
        });
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
        this.error = 'Login failed. Please check your credentials.';
      }
    },
  },
};
</script>

<style scoped>
.sign-in {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f1f2;
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
  background-color: #blue;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #blue;
}

.error-message {
  color: red;
  margin-top: 1rem;
}

</style>
