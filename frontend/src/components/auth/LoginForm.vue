<template>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ $t('auth.login.title') }}
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">{{ $t('auth.email') }}</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
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
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              :placeholder="$t('auth.password')"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              {{ $t('auth.rememberMe') }}
            </label>
          </div>

          <div class="text-sm">
            <router-link
              to="/auth/forgot-password"
              class="font-medium text-primary hover:text-primary-dark"
            >
              {{ $t('auth.forgotPassword') }}
            </router-link>
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
                :icon="['fas', 'lock']"
                class="h-5 w-5 text-primary-dark group-hover:text-primary"
                aria-hidden="true"
              />
            </span>
            {{ loading ? $t('common.loading') : $t('auth.login.submit') }}
          </button>
        </div>

        <div class="text-center">
          <span class="text-sm text-gray-600">{{ $t('auth.noAccount') }}</span>
          <router-link
            to="/auth/register"
            class="ml-1 font-medium text-primary hover:text-primary-dark"
          >
            {{ $t('auth.register.link') }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useNotification } from '@/composables/useNotification';

const store = useStore();
const router = useRouter();
const { show } = useNotification();

const form = ref({
  email: '',
  password: '',
  rememberMe: false,
});

const loading = ref(false);

const handleSubmit = async () => {
  try {
    loading.value = true;
    const success = await store.dispatch('auth/login', {
      email: form.value.email,
      password: form.value.password,
    });

    if (success) {
      show('Login successful', 'success');
      router.push('/dashboard');
    } else {
      show(store.state.auth.error || 'Login failed', 'error');
    }
  } catch (error) {
    show(error.message || 'Login failed', 'error');
  } finally {
    loading.value = false;
  }
};
</script>
