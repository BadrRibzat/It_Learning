<template>
  <form @submit.prevent="submitForm">
    <input v-model="username" type="text" placeholder="Username" required />
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Register</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const username = ref('');
const email = ref('');
const password = ref('');

const emit = defineEmits(['submit']);

const submitForm = () => {
  emit('submit', { username: username.value, email: email.value, password: password.value });
};
</script>
