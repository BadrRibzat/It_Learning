<template>
  <div class="profile-overview bg-white rounded-lg shadow p-6">
    <div class="flex items-center space-x-4">
      <Avatar
        :src="profile?.profile_picture"
        :name="profile?.full_name || 'User'"
        size="lg"
      />
      <div>
        <h2 class="text-xl font-bold text-gray-900">{{ profile?.full_name || 'User' }}</h2>
        <p class="text-sm text-gray-600">{{ profile?.email }}</p>
      </div>
    </div>
    <div class="mt-6 space-y-4">
      <ProgressCircle
        title="Overall Progress"
        :progress="profile?.overall_progress || 0"
        color="#4caf50"
      />
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuickStat
          title="Total Points"
          :label="'Total Points'"
          :value="profile?.total_points || 0"
          icon="TrophyIcon"
        />
        <QuickStat
          title="Current Streak"
          :label="'Current Streak'"
          :value="profile?.current_streak || 0"
          icon="FireIcon"
          suffix="days"
        />
        <QuickStat
          title="Achievements"
          :label="'Achievements'"
          :value="profile?.achievements.length || 0"
          icon="StarIcon"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, defineProps } from 'vue';
import Avatar from '@/components/common/Avatar.vue';
import ProgressCircle from '@/components/profile/ProgressCircle.vue';
import QuickStat from '@/components/profile/QuickStat.vue';
import type { ProfileResponse } from '@/types/profile';

const profile = inject<ProfileResponse | null>('profile');

defineProps<{}>();
</script>
