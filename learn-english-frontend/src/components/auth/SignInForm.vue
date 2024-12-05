<template>
  <div class="space-y-6">
    <h2 class="text-3xl font-extrabold text-gray-900 text-center">Sign in to your account</h2>
    <form @submit.prevent="handleSignIn" class="space-y-4">
      <div>
        <label for="signin-email" class="block text-sm font-medium text-gray-700">Email</label>
        <div class="mt-1">
          <input 
            id="signin-email" 
            v-model="signInForm.email" 
            type="email" 
            required 
            autocomplete="email"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
        </div>
      </div>

      <div>
        <label for="signin-password" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="mt-1 relative">
          <input 
            id="signin-password" 
            v-model="signInForm.password" 
            :type="showSignInPassword ? 'text' : 'password'" 
            required 
            autocomplete="current-password"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
          <button 
            type="button"
            @click="showSignInPassword = !showSignInPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <font-awesome-icon v-if="!showSignInPassword" :icon="['fas', 'eye']" class="h-5 w-5 text-gray-400" />
            <font-awesome-icon v-else :icon="['fas', 'eye-slash']" class="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="text-sm">
          <a href="#" class="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</a>
        </div>
        <div class="text-sm">
          <router-link to="/signup" class="font-medium text-blue-600 hover:text-blue-500">Don't have an account? Sign Up</router-link>
        </div>
      </div>

      <button 
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Sign In
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

const signInForm = ref({
  email: '',
  password: '',
});
const showSignInPassword = ref(false);

const handleSignIn = () => {
  store.dispatch('auth/login', signInForm.value).then(() => {
    router.push('/profile');
  });
};
</script>
