<template>
  <div class="space-y-6">
    <h2 class="text-3xl font-extrabold text-gray-900 text-center">Create your account</h2>
    <form @submit.prevent="handleSignUp" class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
        <div class="mt-1">
          <input 
            id="username" 
            v-model="signUpForm.username" 
            type="text" 
            required 
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
        </div>
      </div>

      <div>
        <label for="signup-email" class="block text-sm font-medium text-gray-700">Email</label>
        <div class="mt-1">
          <input 
            id="signup-email" 
            v-model="signUpForm.email" 
            type="email" 
            required 
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
        </div>
      </div>

      <div>
        <label for="signup-password" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="mt-1 relative">
          <input 
            id="signup-password" 
            v-model="signUpForm.password" 
            :type="showSignUpPassword ? 'text' : 'password'" 
            required 
            autocomplete="new-password"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
          <button 
            type="button"
            @click="showSignUpPassword = !showSignUpPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <font-awesome-icon v-if="!showSignUpPassword" :icon="['fas', 'eye']" class="h-5 w-5 text-gray-400" />
            <font-awesome-icon v-else :icon="['fas', 'eye-slash']" class="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div>
        <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
        <div class="mt-1 relative">
          <input 
            id="confirm-password" 
            v-model="signUpForm.confirmPassword" 
            :type="showConfirmPassword ? 'text' : 'password'" 
            required 
            autocomplete="new-password"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
          <button 
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <font-awesome-icon v-if="!showConfirmPassword" :icon="['fas', 'eye']" class="h-5 w-5 text-gray-400" />
            <font-awesome-icon v-else :icon="['fas', 'eye-slash']" class="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div>
        <label for="language" class="block text-sm font-medium text-gray-700">Preferred Language</label>
        <select
          id="language"
          v-model="signUpForm.language"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
        >
          <option value="">Select a language</option>
          <option value="en">English</option>
          <option value="ar">Arabic</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="zh">Chinese</option>
        </select>
      </div>

      <div class="flex items-center justify-between">
        <div class="text-sm">
          <router-link to="/signin" class="font-medium text-blue-600 hover:text-blue-500">Already have an account? Sign In</router-link>
        </div>
      </div>

      <button 
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Sign Up
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const signUpForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  language: '',
});
const showSignUpPassword = ref(false);
const showConfirmPassword = ref(false);

const handleSignUp = async () => {
  if (signUpForm.value.password !== signUpForm.value.confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  try {
    const registrationData = {
      username: signUpForm.value.username,
      email: signUpForm.value.email,
      password: signUpForm.value.password,
      password_confirmation: signUpForm.value.confirmPassword,
      language: signUpForm.value.language,
    };
    await store.dispatch('auth/register', registrationData);
    router.push('/profile');
  } catch (error) {
    alert('Registration failed: ' + error.message);
  }
};
</script>
