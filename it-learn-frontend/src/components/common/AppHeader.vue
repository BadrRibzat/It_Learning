<template>
  <header class="bg-white shadow-sm">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <RouterLink to="/" class="flex items-center">
            <span class="sr-only">IT Learning</span>
            <img class="h-8 w-auto" src="@/assets/logo.png" alt="IT Learning" />
          </RouterLink>

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

        <div class="flex items-center">
          <div class="hidden lg:flex lg:items-center lg:space-x-6">
            <template v-if="isAuthenticated">
              <div class="relative">
                <Menu as="div" class="relative inline-block text-left">
                  <MenuButton
                    class="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary-600 focus:outline-none"
                  >
                    <span>{{ user?.full_name }}</span>
                    <ChevronDownIcon class="h-4 w-4" />
                  </MenuButton>
                  <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <MenuItems
                      class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <MenuItem v-slot="{ active }">
                        <RouterLink
                          to="/profile"
                          :class="[
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          ]"
                        >
                          Profile
                        </RouterLink>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <RouterLink
                          to="/profile/settings"
                          :class="[
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          ]"
                        >
                          Settings
                        </RouterLink>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="handleLogout"
                          :class="[
                            active ? 'bg-gray-100' : '',
                            'block w-full px-4 py-2 text-left text-sm text-gray-700'
                          ]"
                        >
                          Sign out
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
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

          <div class="flex lg:hidden">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              aria-controls="mobile-menu"
              :aria-expanded="mobileMenuOpen"
              @click="toggleMobileMenu"
            >
              <span class="sr-only">{{ mobileMenuOpen ? 'Close menu' : 'Open menu' }}</span>
              <Bars3Icon v-if="!mobileMenuOpen" class="h-6 w-6" aria-hidden="true" />
              <XMarkIcon v-else class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
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
              @click="closeMobileMenu"
            >
              {{ item.name }}
            </RouterLink>

            <template v-if="!isAuthenticated">
              <RouterLink
                to="/login"
                class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                @click="closeMobileMenu"
              >
                Sign in
              </RouterLink>
              <RouterLink
                to="/register"
                class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                @click="closeMobileMenu"
              >
                Get started
              </RouterLink>
            </template>
            <template v-else>
              <RouterLink
                to="/profile"
                class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                @click="closeMobileMenu"
              >
                Profile
              </RouterLink>
              <RouterLink
                to="/profile/settings"
                class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                @click="closeMobileMenu"
              >
                Settings
              </RouterLink>
              <button
                @click="handleLogout"
                class="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
              >
                Sign out
              </button>
            </template>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { useToast } from 'vue-toastification';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const toast = useToast();

const mobileMenuOpen = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const isCurrentRoute = (path: string) => route.path === path;

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    profileStore.resetState();
    closeMobileMenu();
    router.push('/login');
    toast.success('Successfully logged out');
  } catch (error) {
    toast.error('Failed to log out');
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('#mobile-menu') && !target.closest('button')) {
    closeMobileMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.router-link-active {
  @apply text-primary-600;
}

@media (max-width: 1024px) {
  .mobile-menu-enter-active,
  .mobile-menu-leave-active {
    transition: all 0.3s ease;
  }

  .mobile-menu-enter-from,
  .mobile-menu-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
