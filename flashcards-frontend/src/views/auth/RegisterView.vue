<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-3xl font-bold mb-8">{{ $t('auth.signUp') }}</h1>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-gray-700">{{ $t('auth.username') }}</label>
          <input
            v-model="username"
            type="text"
            class="w-full px-4 py-2 border rounded-lg"
            autocomplete="username"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">{{ $t('auth.email') }}</label>
          <input
            v-model="email"
            type="email"
            class="w-full px-4 py-2 border rounded-lg"
            autocomplete="email"
            required
          />
        </div>
        <div class="mb-4 relative">
          <label class="block text-gray-700">{{ $t('auth.password') }}</label>
          <div class="flex items-center">
            <input
              v-model="password"
              :type="passwordType"
              class="w-full px-4 py-2 border rounded-lg pr-10"
              autocomplete="new-password"
              required
            />
            <button 
              type="button" 
              @click="togglePasswordVisibility" 
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <font-awesome-icon :icon="isPasswordVisible ? 'eye-slash' : 'eye'" />
            </button>
          </div>
        </div>
        <div class="mb-4 relative">
          <label class="block text-gray-700">{{ $t('auth.confirmPassword') }}</label>
          <div class="flex items-center">
            <input
              v-model="passwordConfirmation"
              :type="confirmPasswordType"
              class="w-full px-4 py-2 border rounded-lg pr-10"
              autocomplete="new-password"
              required
            />
            <button 
              type="button" 
              @click="toggleConfirmPasswordVisibility" 
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <font-awesome-icon :icon="isConfirmPasswordVisible ? 'eye-slash' : 'eye'" />
            </button>
          </div>
        </div>
        <button
          type="submit"
          class="bg-primary text-white px-4 py-2 rounded-lg w-full"
          :disabled="isLoading"
        >
          {{ isLoading ? $t('auth.signingUp') : $t('auth.signUp') }}
        </button>
        <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { 
  validateEmail, 
  validatePassword, 
  validateUsername 
} from '@/utils/validation';
import { usePasswordToggle } from '@/utils/passwordToggle';

const store = useStore();
const router = useRouter();

// Password visibility for password
const { 
  isPasswordVisible, 
  passwordType, 
  togglePasswordVisibility 
} = usePasswordToggle();

// Password visibility for confirm password
const {
  isPasswordVisible: isConfirmPasswordVisible,
  passwordType: confirmPasswordType,
  togglePasswordVisibility: toggleConfirmPasswordVisibility
} = usePasswordToggle();

const validateForm = () => {
  if (!validateUsername(username.value)) {
    store.dispatch('app/showNotification', {
      message: 'Username must be 3-20 characters',
      type: 'error'
    });
    return false;
  }

  if (!validateEmail(email.value)) {
    store.dispatch('app/showNotification', {
      message: 'Invalid email format',
      type: 'error'
    });
    return false;
  }

  if (!validatePassword(password.value)) {
    store.dispatch('app/showNotification', {
      message: 'Password must be at least 8 characters with uppercase, lowercase, and number',
      type: 'error'
    });
    return false;
  }

  return true;
};

const username = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const error = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  if (!validateForm()) return;

  if (password.value !== passwordConfirmation.value) {
    store.dispatch('app/showNotification', {
      message: 'Passwords do not match',
      type: 'error'
    });
    return;
  }

  try {
    store.dispatch('app/startLoading');
    await store.dispatch('auth/register', {
      username: username.value,
      email: email.value,
      password: password.value
    });
    
    store.dispatch('app/showNotification', {
      message: 'Registration successful!',
      type: 'success'
    });
    
    router.push('/login');
  } catch (error) {
    // Error handling is now done in axios interceptor
  } finally {
    store.dispatch('app/stopLoading');
  }
};
</script>
