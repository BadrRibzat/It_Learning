<template>
  <nav class="bg-blue-500 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div>
        <router-link to="/" class="text-white mr-4">Home</router-link>
        <router-link to="/about" class="text-white mr-4">About</router-link>
        <router-link to="/contact" class="text-white mr-4">Contact</router-link>
        <router-link v-if="isAuthenticated" to="/profile" class="text-white mr-4">Profile</router-link>
      </div>
      <div>
        <router-link v-if="!isAuthenticated" to="/signin" class="text-white mr-4">Sign In</router-link>
        <router-link v-if="!isAuthenticated" to="/signup" class="text-white mr-4">Sign Up</router-link>
        <button v-if="isAuthenticated" @click="handleLogout" class="text-white">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const isAuthenticated = computed(() => store.getters.isAuthenticated);

    const handleLogout = () => {
      store.dispatch('logout').then(() => {
        router.push('/');
      });
    };

    return {
      isAuthenticated,
      handleLogout,
    };
  },
};
</script>
