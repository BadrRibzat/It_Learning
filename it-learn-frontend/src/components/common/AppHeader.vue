<template>
  <header class="bg-white shadow-sm">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo and Main Navigation -->
        <div class="flex items-center">
          <RouterLink to="/" class="flex items-center">
            <span class="sr-only">IT Learning</span>
            <img class="h-8 w-auto" src="@/assets/logo.svg" alt="IT Learning" />
          </RouterLink>
          
          <!-- Main Navigation - Desktop -->
          <div class="ml-10 hidden space-x-8 lg:block">
            <RouterLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="text-sm font-medium text-gray-700 hover:text-primary-600"
              :class="{ 'text-primary-600': isCurrentRoute(item.href) }"
            >
              {{ item.name }}
            </RouterLink>
          </div>
        </div>

        <!-- Right Navigation -->
        <div class="flex items-center">
          <!-- Auth Buttons - Desktop -->
          <div class="hidden lg:flex lg:items-center lg:space-x-6">
            <template v-if="isAuthenticated">
              <button
                @click="openUserMenu"
                class="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                <span>{{ user?.full_name || 'User' }}</span>
                <ChevronDownIcon class="ml-2 h-5 w-5" aria-hidden="true" />
              </button>
            </template>
            <template v-else>
              <RouterLink
                to="/login"
                class="text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                Sign in
              </RouterLink>
              <RouterLink
                to="/register"
                class="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-500"
              >
                Get started
              </RouterLink>
            </template>
          </div>

          <!-- Mobile menu button -->
          <div class="flex lg:hidden">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              aria-controls="mobile-menu"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!mobileMenuOpen" class="h-6 w-6" aria-hidden="true" />
              <XMarkIcon v-else class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div
        v-show="mobileMenuOpen"
        class="lg:hidden"
        id="mobile-menu"
      >
        <div class="space-y-1 px-2 pb-3 pt-2">
          <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
            :class="{ 'bg-gray-50 text-primary-600': isCurrentRoute(item.href) }"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </RouterLink>
          
          <!-- Mobile Auth Links -->
          <template v-if="!isAuthenticated">
            <RouterLink
              to="/login"
              class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
              @click="mobileMenuOpen = false"
            >
              Sign in
            </RouterLink>
            <RouterLink
              to="/register"
              class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
              @click="mobileMenuOpen = false"
            >
              Get started
            </RouterLink>
          </template>
          <template v-else>
            <button
              @click="handleLogout"
              class="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
            >
              Sign out
            </button>
          </template>
        </div>
      </div>
    </nav>

    <!-- User Menu Dropdown -->
    <div v-if="showUserMenu" class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <RouterLink
        to="/profile"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        @click="showUserMenu = false"
      >
        Your Profile
      </RouterLink>
      <RouterLink
        to="/dashboard"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        @click="showUserMenu = false"
      >
        Dashboard
      </RouterLink>
      <button
        @click="handleLogout"
        class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
      >
        Sign out
      </button>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default defineComponent({
  name: 'AppHeader',
  components: {
    RouterLink,
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    
    const mobileMenuOpen = ref(false);
    const showUserMenu = ref(false);

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const user = computed(() => authStore.user);

    const isCurrentRoute = (path: string) => route.path === path;

    const openUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
    };

    const handleLogout = async () => {
      try {
        await authStore.logout();
        showUserMenu.value = false;
        mobileMenuOpen.value = false;
        router.push('/');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    // Close menus when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu') && !target.closest('.mobile-menu')) {
        showUserMenu.value = false;
        mobileMenuOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      navigation,
      mobileMenuOpen,
      showUserMenu,
      isAuthenticated,
      user,
      isCurrentRoute,
      openUserMenu,
      handleLogout,
    };
  },
});
</script>
