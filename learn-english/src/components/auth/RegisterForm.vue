<template>
  <div class="register-form">
    <form @submit.prevent="submit">
      <input
        type="text"
        v-model="username"
        placeholder="Username"
        required
        autocomplete="username"
      />
      <input
        type="email"
        v-model="email"
        placeholder="Email"
        required
        autocomplete="email"
      />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
        autocomplete="new-password"
      />
      <input
        type="password"
        v-model="passwordConfirmation"
        placeholder="Confirm Password"
        required
        autocomplete="new-password"
      />
      <LanguageSwitcher v-model:selectedLanguage="language" />

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Registering...' : 'Register' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';

export default {
  name: 'RegisterForm',
  components: {
    LanguageSwitcher,
  },
  setup() {
    const store = useStore();
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const passwordConfirmation = ref('');
    const language = ref('en'); 
    const isLoading = ref(false);

    const submit = async () => {
      isLoading.value = true;
      try {
        await store.dispatch('auth/register', {
          username: username.value,
          email: email.value,
          password: password.value,
          password_confirmation: passwordConfirmation.value,
          language: language.value, // Pass the selected language
        });
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      username,
      email,
      password,
      passwordConfirmation,
      language,
      isLoading,
      submit,
    };
  },
};
</script>