<template>
  <form @submit.prevent="submitForm">
    <div class="rounded-md shadow-sm space-y-4">
      <div>
        <label for="username" class="sr-only">Username</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          required
          autocomplete="username"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
          placeholder="Username"
        />
      </div>
      <div>
        <label for="email" class="sr-only">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          autocomplete="email"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
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
          autocomplete="new-password"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
          placeholder="Password"
        />
      </div>
      <div>
        <label for="password_confirmation" class="sr-only">Confirm Password</label>
        <input
          id="password_confirmation"
          v-model="form.password_confirmation"
          type="password"
          required
          autocomplete="new-password"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
          placeholder="Confirm Password"
        />
      </div>
      <div>
        <LanguageSwitcher v-model="form.language" />
      </div>
      <div>
        <label for="date_of_birth" class="sr-only">Date of Birth</label>
        <input
          id="date_of_birth"
          v-model="form.date_of_birth"
          type="date"
          required
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
          placeholder="Date of Birth"
        />
      </div>
    </div>
    <div>
      <button
        type="submit"
        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Register
      </button>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import { NotificationService } from '@/utils/NotificationService';

export default {
  components: { LanguageSwitcher },
  setup() {
    const store = useStore();
    const router = useRouter();
    const form = ref({
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      language: 'en',
      date_of_birth: '',
    });

    const submitForm = async () => {
      if (form.value.password !== form.value.password_confirmation) {
        NotificationService.showError('Passwords do not match!');
        return;
      }
      try {
        await store.dispatch('auth/register', form.value);
        NotificationService.showSuccess('Registration successful!');
        router.push('/auth/login');
      } catch (error) {
        NotificationService.handleAuthError(error);
      }
    };

    return { form, submitForm };
  },
};
</script>
