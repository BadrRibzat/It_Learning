<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import { RouterLink } from 'vue-router';
import { logUserActivity } from '@/utils/logger';
import { useProfileStore } from '@/stores/profile';
import { useNotificationStore } from '@/stores/notification';
import Avatar from './Avatar.vue';

const TIMESTAMP = '2025-02-09 14:56:43';
const USER_LOGIN = 'BadrRibzat';

interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: string;
  last_active?: string;
}

interface MenuAction {
  label: string;
  icon?: any;
  href?: string;
  action?: () => void;
  danger?: boolean;
}

const props = defineProps<{
  user: User;
  customActions?: MenuAction[];
}>();

const emit = defineEmits<{
  (e: 'logout'): void;
  (e: 'delete-account'): void;
  (e: 'menu-action', action: string): void;
}>();

const profileStore = useProfileStore();
const notificationStore = useNotificationStore();
const menuOpen = ref(false);

const defaultMenuItems: MenuAction[] = [
  {
    label: 'Profile',
    href: '/profile'
  },
  {
    label: 'Settings',
    href: '/profile/settings'
  },
  {
    label: 'Learning Progress',
    href: '/profile/progress'
  },
  {
    label: 'Achievements',
    href: '/profile/achievements'
  }
];

const handleMenuAction = async (action: MenuAction) => {
  try {
    await logUserActivity('menu_action_clicked', {
      action: action.label,
      timestamp: TIMESTAMP,
      user: USER_LOGIN
    });

    if (action.action) {
      action.action();
    }
    emit('menu-action', action.label);
  } catch (error) {
    console.error('Menu action error:', error);
    notificationStore.error('Failed to perform action');
  }
};

const handleLogout = async () => {
  try {
    await logUserActivity('user_logout', {
      timestamp: TIMESTAMP,
      user: USER_LOGIN
    });
    
    await profileStore.updateLastActive(TIMESTAMP);
    emit('logout');
  } catch (error) {
    console.error('Logout error:', error);
    notificationStore.error('Failed to logout. Please try again.');
  }
};

const handleDeleteAccount = async () => {
  try {
    await logUserActivity('account_deletion_initiated', {
      timestamp: TIMESTAMP,
      user: USER_LOGIN
    });
    emit('delete-account');
  } catch (error) {
    console.error('Delete account error:', error);
    notificationStore.error('Failed to initiate account deletion');
  }
};

onMounted(() => {
  logUserActivity('user_menu_mounted', {
    timestamp: TIMESTAMP,
    user: USER_LOGIN
  });
});
</script>

<template>
  <Menu as="div" class="relative inline-block text-left z-50">
    <MenuButton
      class="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full p-1"
      @click="menuOpen = !menuOpen"
    >
      <Avatar
        :size="32"
        :name="user.full_name"
        :src="user.avatar_url"
        class="flex-shrink-0"
      />
      <span class="hidden md:inline font-medium">
        {{ user.full_name }}
      </span>
      <ChevronDownIcon 
        class="h-4 w-4 transition-transform duration-200"
        :class="{ 'rotate-180': menuOpen }"
      />
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
        class="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100"
      >
        <div class="px-4 py-3">
          <p class="text-sm">Signed in as</p>
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ user.email }}
          </p>
        </div>

        <div class="py-1">
          <MenuItem v-for="item in defaultMenuItems" :key="item.label" v-slot="{ active }">
            <RouterLink
              v-if="item.href"
              :to="item.href"
              :class="[
                active ? 'bg-gray-100' : '',
                'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
              ]"
              @click="handleMenuAction(item)"
            >
              {{ item.label }}
            </RouterLink>
          </MenuItem>
        </div>

        <div v-if="customActions?.length" class="py-1">
          <MenuItem v-for="action in customActions" :key="action.label" v-slot="{ active }">
            <button
              type="button"
              :class="[
                active ? 'bg-gray-100' : '',
                'block w-full text-left px-4 py-2 text-sm',
                action.danger ? 'text-red-600' : 'text-gray-700'
              ]"
              @click="handleMenuAction(action)"
            >
              {{ action.label }}
            </button>
          </MenuItem>
        </div>

        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <button
              type="button"
              :class="[
                active ? 'bg-gray-100' : '',
                'block w-full text-left px-4 py-2 text-sm text-red-600'
              ]"
              @click="handleDeleteAccount"
            >
              Delete Account
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              type="button"
              :class="[
                active ? 'bg-gray-100' : '',
                'block w-full text-left px-4 py-2 text-sm text-gray-700'
              ]"
              @click="handleLogout"
            >
              Sign out
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: all 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.router-link-active {
  @apply bg-primary-50 text-primary-600;
}
</style>
