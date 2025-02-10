<template>
  <div>
    <form @submit.prevent="updateProfile">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input v-model="profile.name" class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="profile.email" type="email" class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        </div>
      </div>
      
      <div class="mt-6 flex justify-end">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type { UserProfile } from '@/types/profile';

const props = defineProps<{
  profile: UserProfile;
}>();

const emit = defineEmits(['updateProfile']);

const profile = reactive({ ...props.profile });

const updateProfile = () => {
  emit('updateProfile', profile);
};
</script>
