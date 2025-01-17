<template>
  <form @submit.prevent="submitForm">
    <div class="rounded-md shadow-sm space-y-4">
      <div>
        <label for="email" class="sr-only">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          autocomplete="email"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
          placeholder="Email"
        />
      </div>
      <div>
        <label for="password" class="sr-only">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          autocomplete="current-password"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
          placeholder="Password"
        />
      </div>
    </div>
    <div>
      <button
        type="submit"
        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Sign in
      </button>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { NotificationService } from '@/utils/NotificationService';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const form = ref({
      email: '',
      password: '',
    });

    const submitForm = async () => {
      try {
        await store.dispatch('auth/login', form.value);
        NotificationService.showSuccess('Login successful!');
        router.push('/profile');
      } catch (error) {
        NotificationService.handleAuthError(error);
      }
    };

    return { form, submitForm };
  },
};
</script>
