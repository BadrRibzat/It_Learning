<template>
  <div class="relative">
    <button
      @click="toggleMenu"
      class="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
      ref="menuButton"
    >
      <Avatar
        :src="user?.profile_picture"
        :name="user?.full_name"
        size="sm"
        class="mr-2"
      />
      <span>{{ user?.full_name || 'User' }}</span>
      <ChevronDownIcon class="ml-2 h-5 w-5" aria-hidden="true" />
    </button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="isOpen"
        class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        ref="menuItems"
      >
        <RouterLink
          to="/profile"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          @click="closeMenu"
        >
          Profile
        </RouterLink>
        <RouterLink
          to="/profile/settings"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          @click="closeMenu"
        >
          Settings
        </RouterLink>
        <button
          @click="handleDeleteAccount"
          class="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
        >
          Delete Account
        </button>
        <button
          @click="handleLogout"
          class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        >
          Sign out
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import Avatar from './Avatar.vue';
import { useToast } from 'vue-toastification';

const props = defineProps<{
  user: any;
}>();

const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const toast = useToast();

const isOpen = ref(false);
const menuButton = ref<HTMLElement | null>(null);
const menuItems = ref<HTMLElement | null>(null);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    menuButton.value &&
    menuItems.value &&
    !menuButton.value.contains(event.target as Node) &&
    !menuItems.value.contains(event.target as Node)
  ) {
    closeMenu();
  }
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    closeMenu();
    router.push('/login');
    toast.success('Successfully logged out');
  } catch (error) {
    toast.error('Failed to log out');
  }
};

const handleDeleteAccount = async () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    try {
      await profileStore.deleteAccount();
      await authStore.logout();
      router.push('/');
      toast.success('Your account has been successfully deleted');
    } catch (error) {
      toast.error('Failed to delete account');
    }
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
