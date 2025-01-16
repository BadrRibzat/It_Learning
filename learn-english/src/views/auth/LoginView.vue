<template>
  <div class="login">
    <div class="flex justify-center items-center py-16">
      <div class="w-full max-w-md">
        <div class="card">
          <h1 class="text-3xl font-bold text-center mb-6">Login</h1>

          <form @submit.prevent="login">
            <div class="mb-4">
              <label for="email" class="block text-gray-700 font-bold mb-2">Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                required
                autocomplete="email"
                class="border border-gray-400 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-primary"
              />
            </div>

            <div class="mb-4">
              <label for="password" class="block text-gray-700 font-bold mb-2">Password</label>
              <input
                type="password"
                id="password"
                v-model="password"
                required
                autocomplete="current-password"
                class="border border-gray-400 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-primary"
              />
            </div>

            <button type="submit" class="btn-primary w-full px-4 py-2 text-lg" :disabled="isLoading">
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>

            <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
          </form>

          <div class="mt-6 text-center">
            <p class="text-gray-600">
              Don't have an account?
              <router-link to="/auth/register" class="text-primary hover:underline">Register</router-link>
            </p>
            <p class="text-gray-600 mt-2">
              <router-link to="/auth/forgot-password" class="text-primary hover:underline">Forgot Password?</router-link>
            </p>
            <p class="text-gray-600 mt-2">
              <router-link to="/auth/mfa" class="text-primary hover:underline">Setup MFA</router-link>
            </p>
            <p class="text-gray-600 mt-2">
              <router-link to="/auth/verify-email" class="text-primary hover:underline">Verify Email</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '@/services/api/AuthService';

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const error = ref(null);
    const isLoading = ref(false);

    const login = async () => {
      isLoading.value = true;
      error.value = null;

      try {
        const response = await AuthService.login({
          email: email.value,
          password: password.value,
        });

        // Store tokens in localStorage or Vuex store
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);

        // Redirect to dashboard
        router.push('/profile');
      } catch (err) {
        error.value = err.message || 'Login failed';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      password,
      error,
      isLoading,
      login,
    };
  },
};
</script>