<template>
  <form @submit.prevent="submitForm">
    <input v-model="username" type="text" placeholder="Username" required />
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" autocomplete="new-password" class="w-full px-4 py-2 border rounded-lg" required />
    <input v-model="passwordConfirmation" type="password" autocomplete="new-password" class="w-full px-4 py-2 border rounded-lg" required />
    <button type="submit">Register</button>
    <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const username = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');

const error = computed(() => store.state.auth.error);

const emit = defineEmits(['submit']);

const submitForm = () => {
  if (password.value !== passwordConfirmation.value) {
    alert("Passwords don't match");
    return;
  }
  emit('submit', { username: username.value, email: email.value, password: password.value });
};
</script>
