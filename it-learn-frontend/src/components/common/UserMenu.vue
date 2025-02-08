<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary-600 focus:outline-none"
      >
        <Avatar
          size="sm"
          :name="user?.full_name"
          class="flex-shrink-0"
        />
        <span class="hidden md:inline">{{ user?.full_name }}</span>
        <ChevronDownIcon class="h-4 w-4" />
      </MenuButton>
    </div>

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
            @click="$emit('delete-account')"
            :class="[
              active ? 'bg-gray-100' : '',
              'block w-full px-4 py-2 text-left text-sm text-red-600'
            ]"
          >
            Delete Account
          </button>
        </MenuItem>
        <MenuItem v-slot="{ active }">
          <button
            @click="$emit('logout')"
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
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import { RouterLink } from 'vue-router';
import Avatar from './Avatar.vue';

interface User {
  full_name: string;
}

defineProps<{
  user: User;
}>();

defineEmits<{
  (e: 'logout'): void;
  (e: 'delete-account'): void;
}>();
</script>
