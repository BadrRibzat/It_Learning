<template>
  <div class="register">
    <div class="flex justify-center items-center py-16">
      <div class="w-full max-w-md">
        <div class="card">
          <h1 class="text-3xl font-bold text-center mb-6">Register</h1>

          <!-- Use the RegisterForm component -->
          <RegisterForm @submit="register" />

          <!-- Links section -->
          <div class="mt-6 text-center">
            <p class="text-gray-600">
              Already have an account?
              <router-link to="/auth/login" class="text-primary hover:underline">Login</router-link>
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
import RegisterForm from '@/components/auth/RegisterForm.vue';

export default {
  name: 'RegisterView',
  components: {
    RegisterForm, 
  },
  setup() {
    const router = useRouter();
    const error = ref(null);
    const isLoading = ref(false);

    const register = async (userData) => {
      isLoading.value = true;
      error.value = null;

      if (userData.password !== userData.password_confirmation) {
        error.value = 'Passwords do not match';
        isLoading.value = false;
        return;
      }

      try {
        await AuthService.register(userData);

        // Redirect to login after successful registration
        router.push('/auth/login');
      } catch (err) {
        error.value = err.message || 'Registration failed';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      error,
      isLoading,
      register,
    };
  },
};
</script>