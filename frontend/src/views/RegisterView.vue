<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">{{ $t('register.title') }}</h1>
    <form @submit.prevent="register">
      <BaseInput
        v-model="username"
        type="text"
        :placeholder="$t('register.username')"
        class="mb-4"
      />
      <BaseInput v-model="email" type="email" :placeholder="$t('register.email')" class="mb-4" />
      <BaseInput
        v-model="password"
        type="password"
        :placeholder="$t('register.password')"
        class="mb-4"
      />
      <BaseInput
        v-model="passwordConfirmation"
        type="password"
        :placeholder="$t('register.passwordConfirmation')"
        class="mb-4"
      />
      <BaseButton type="submit" :disabled="loading">
        {{ $t('register.submit') }}
      </BaseButton>
    </form>
    <p v-if="error" class="text-red-500 text-sm mt-4">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import api from '@/api';

const router = useRouter();

const username = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const loading = ref(false);
const error = ref('');

const validateForm = () => {
  return username.value && email.value && password.value && passwordConfirmation.value;
};

const register = async () => {
  if (!validateForm()) {
    error.value = 'All fields are required.';
    return;
  }
  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match.';
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    const response = await api.post('/register/', {
      username: username.value,
      email: email.value,
      password: password.value,
    });
    console.log(response);
    router.push('/login');
  } catch (err) {
    error.value = err.response?.data?.detail || 'An error occurred';
  } finally {
    loading.value = false;
  }
};
</script>
