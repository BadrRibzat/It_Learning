<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
      </div>
      <RegisterForm />
      <div class="text-center">
        <router-link
          to="/auth/login"
          class="text-sm text-primary hover:text-primary-dark"
        >
          Already have an account? Sign in
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterForm from '@/components/auth/RegisterForm.vue';

export default {
  components: { RegisterForm },
};
</script>
