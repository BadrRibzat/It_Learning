<template>
  <div class="container mx-auto px-4 py-8">
    <RouterView />
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Profile Info -->
      <div class="lg:col-span-4">
        <ProfileInfo 
          :profile="profileStore.profile?.profile_data"
          @update="handleProfileUpdate"
        />
      </div>
      
      <!-- Stats and Activities -->
      <div class="lg:col-span-8">
        <div class="space-y-8">
          <ProfileProgress :stats="profileStore.profile?.learning_stats" />
          <LearningStatistics :stats="profileStore.profile?.learning_stats" />
          <ActivityFeed :activities="profileStore.profile?.recent_activities" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useProfileStore } from '@/stores/profile';
import ProfileInfo from './ProfileInfo.vue';
import ProfileProgress from './ProfileProgress.vue';
import LearningStatistics from './LearningStatistics.vue';
import ActivityFeed from './ActivityFeed.vue';
import type { ProfileUpdateRequest } from '@/types/profile';

const profileStore = useProfileStore();

onMounted(async () => {
  await profileStore.fetchProfile();
});

const handleProfileUpdate = async (data: ProfileUpdateRequest) => {
  await profileStore.updateProfile(data);
};
</script>
