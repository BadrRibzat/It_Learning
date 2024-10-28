<template>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ $t('auth.forgotPassword') }}
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
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <font-awesome-icon
                :icon="['fas', 'envelope']"
                class="h-5 w-5 text-primary-dark group-hover:text-primary"
                aria-hidden="true"
              />
            </span>
            {{ loading ? $t('common.loading') : $t('auth.forgotPassword') }}
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
const { resetPassword, loading } = useAuth();
const { show } = useNotification();

const form = ref({
  email: '',
});

const handleSubmit = async () => {
  try {
    await resetPassword(form.value.email);
    show($t('auth.forgotPassword.success'), 'success');
    router.push('/auth/login');
  } catch (error) {
    show(error.message || $t('auth.forgotPassword.error'), 'error');
  }
};
</script>
