<template>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ $t('auth.register.title') }}
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">{{ $t('auth.name') }}</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              :placeholder="$t('auth.name')"
            />
          </div>
          <div>
            <label for="email" class="sr-only">{{ $t('auth.email') }}</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              :placeholder="$t('auth.email')"
            />
          </div>
          <div>
            <label for="password" class="sr-only">{{ $t('auth.password') }}</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              :placeholder="$t('auth.password')"
            />
          </div>
          <div>
            <label for="password_confirmation" class="sr-only">{{ $t('auth.confirmPassword') }}</label>
            <input
              id="password_confirmation"
              v-model="form.passwordConfirmation"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              :placeholder="$t('auth.confirmPassword')"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <font-awesome-icon
                :icon="['fas', 'user-plus']"
                class="h-5 w-5 text-primary-dark group-hover:text-primary"
                aria-hidden="true"
              />
            </span>
            {{ loading ? $t('common.loading') : $t('auth.register.submit') }}
          </button>
        </div>

        <div class="text-center">
          <span class="text-sm text-gray-600">{{ $t('auth.hasAccount') }}</span>
          <router-link
            to="/auth/login"
            class="ml-1 font-medium text-primary hover:text-primary-dark"
          >
            {{ $t('auth.login.link') }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useNotification } from '@/composables/useNotification';
import { useRouter } from 'vue-router';

const router = useRouter();
const { register, loading } = useAuth();
const { show } = useNotification();

const form = ref({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
});

const handleSubmit = async () => {
  if (form.value.password !== form.value.passwordConfirmation) {
    show($t('auth.register.passwordMismatch'), 'error');
    return;
  }

  try {
    const success = await register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.passwordConfirmation,
    });

    if (success) {
      show($t('auth.register.success'), 'success');
      router.push('/dashboard');
    }
  } catch (error) {
    show(error.message || $t('auth.register.error'), 'error');
  }
};
</script>
