<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      </div>
      <LoginForm />
      <div class="text-center">
        <router-link
          to="/auth/register"
          class="text-sm text-primary hover:text-primary-dark"
        >
          Don't have an account? Register
        </router-link>
        <span class="mx-2 text-gray-500">|</span>
        <router-link
          to="/auth/forgot-password"
          class="text-sm text-primary hover:text-primary-dark"
        >
          Forgot Password?
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/auth/LoginForm.vue';

export default {
  components: { LoginForm },
};
</script>
