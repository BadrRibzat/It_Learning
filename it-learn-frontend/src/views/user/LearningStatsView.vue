<template>
  <div class="learning-stats-page container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <LoadingSpinner />
    </div>

    <div v-else class="space-y-8">
      <!-- Stats Overview -->
      <div class="bg-white rounded-lg shadow p-6">
        <h1 class="text-2xl font-bold text-gray-900">Learning Statistics</h1>
        <p class="text-gray-600 mt-2">
          Your learning progress since {{ formatDate(profile?.joined_date) }}
        </p>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <StatCard
            title="Total Points"
            :value="stats?.total_points || 0"
            icon="TrophyIcon"
            trend="up"
            :percent="10"
          />
          <StatCard
            title="Current Rank"
            :value="stats?.rank || 'Novice'"
            icon="ChartBarIcon"
            variant="info"
          />
          <StatCard
            title="Lessons Completed"
            :value="stats?.completed_lessons || 0"
            icon="BookOpenIcon"
            trend="up"
            :percent="5"
          />
          <StatCard
            title="Current Streak"
            :value="stats?.streak?.current_streak || 0"
            icon="FireIcon"
            variant="warning"
            suffix="days"
          />
        </div>
      </div>

      <!-- Progress Charts -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Points History -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Points History
          </h2>
          <LineChart
            v-if="chartData"
            :chart-data="chartData"
            :options="chartOptions"
          />
        </div>

        <!-- Accuracy & Performance -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Performance Metrics
          </h2>
          <div class="space-y-6">
            <MetricItem
              label="Quiz Average"
              :value="stats?.quiz_average"
              format="percentage"
            />
            <MetricItem
              label="Accuracy Rate"
              :value="stats?.accuracy_rate"
              format="percentage"
            />
            <MetricItem
              label="Time Spent Learning"
              :value="stats?.time_spent"
              format="time"
            />
          </div>
        </div>
      </div>

      <!-- Weekly Activity -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Weekly Activity
        </h2>
        <ActivityHeatmap
          :activities="weeklyActivities"
          :start-date="startOfWeek"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  TrophyIcon, 
  ChartBarIcon, 
  BookOpenIcon, 
  FireIcon 
} from '@heroicons/vue/24/outline';
import { useProfileStore } from '@/stores/profile';
import type { LearningStats, ProfileData } from '@/types/profile';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import StatCard from '@/components/stats/StatCard.vue';
import LineChart from '@/components/common/LineChart.vue';
import MetricItem from '@/components/stats/MetricItem.vue';
import ActivityHeatmap from '@/components/stats/ActivityHeatmap.vue';

const profileStore = useProfileStore();
const loading = ref(true);
const stats = ref<LearningStats | null>(null);
const profile = ref<ProfileData | null>(null);

// Chart data computation
const chartData = computed(() => {
  if (!stats.value?.points_history) return null;

  const labels = stats.value.points_history.map(entry => 
    formatDate(entry.timestamp, true)
  );
  const data = stats.value.points_history.map(entry => entry.amount);

  return {
    labels,
    datasets: [{
      label: 'Points Earned',
      data,
      borderColor: '#0284c7',
      backgroundColor: 'rgba(2, 132, 199, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};

// Weekly activities
const startOfWeek = computed(() => {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
});

const weeklyActivities = computed(() => {
  // Transform activities into heatmap data
  return profileStore.recentActivities?.map(activity => ({
    date: new Date(activity.timestamp),
    value: activity.points_earned || 0
  })) || [];
});

// Format date helper
const formatDate = (date: string | Date | undefined, showTime = false) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(showTime && {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
};

onMounted(async () => {
  try {
    await Promise.all([
      profileStore.fetchProfile(),
      profileStore.fetchStatistics()
    ]);
    stats.value = profileStore.learningStats;
    profile.value = profileStore.profile?.profile_data || null;
  } finally {
    loading.value = false;
  }
});
</script>
