<template>
  <form @submit.prevent="submitForm">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Login</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const emit = defineEmits(['submit']);

const submitForm = () => {
  emit('submit', { email: email.value, password: password.value });
};
</script>
