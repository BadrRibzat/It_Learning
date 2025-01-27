<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <router-link to="/" class="flex items-center">
          <i class="fas fa-book-open text-2xl text-primary mr-2"></i>
          <span class="text-xl font-bold text-primary">Learn English</span>
        </router-link>

        <div class="hidden md:flex items-center space-x-8">
          <!-- Public Routes -->
          <template v-if="!isAuthenticated">
            <router-link
              v-for="link in publicLinks"
              :key="link.path"
              :to="link.path"
              class="text-gray-600 hover:text-primary transition-colors"
            >
              <i :class="link.icon" class="mr-2"></i>
              {{ link.name }}
            </router-link>
          </template>
        </div>

        <div class="flex items-center space-x-4">
          <language-switcher />

          <!-- Auth Buttons -->
          <template v-if="isAuthenticated">
            <router-link
              to="/profile"
              class="text-gray-600 hover:text-primary transition-colors"
            >
              <i class="fas fa-user mr-2"></i>
              Profile
            </router-link>
            <logout-button />
          </template>
          <template v-else>
            <router-link
              to="/auth/login"
              class="text-gray-600 hover:text-primary transition-colors"
            >
              <i class="fas fa-right-to-bracket mr-2"></i>
              Login
            </router-link>
            <router-link
              to="/auth/register"
              class="text-gray-600 hover:text-primary transition-colors"
            >
              <i class="fas fa-user-plus mr-2"></i>
              Register
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import LanguageSwitcher from './LanguageSwitcher.vue';
import LogoutButton from '../auth/LogoutButton.vue';

export default {
  name: 'Header',
  components: {
    LanguageSwitcher,
    LogoutButton
  },
  setup() {
    const store = useStore();
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);

    const publicLinks = [
      { name: 'Home', path: '/', icon: 'fas fa-home' },
      { name: 'About', path: '/about', icon: 'fas fa-info-circle' },
      { name: 'Features', path: '/features', icon: 'fas fa-star' },
      { name: 'Contact', path: '/contact', icon: 'fas fa-envelope' },
    ];

    return {
      isAuthenticated,
      publicLinks
    };
  }
};
</script>
