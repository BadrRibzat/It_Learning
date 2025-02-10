<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-6">Profile Info</h2>
    
    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>
    
    <div v-else>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <div class="mt-1">
            <p class="text-lg font-semibold">{{ profile?.name || '-' }}</p>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <div class="mt-1">
            <p class="text-lg font-semibold">{{ profile?.email || '-' }}</p>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Member Since</label>
          <div class="mt-1">
            <p class="text-lg font-semibold">{{ profile?.member_since || '-' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UserProfile } from '@/types/profile';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const props = defineProps<{
  profile?: UserProfile;
  loading?: boolean;
}>();
</script>
