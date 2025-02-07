<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-6">Learning Statistics</h2>

    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner />
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Points & Rank -->
        <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-4 text-white">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-primary-100">Total Points</p>
              <p class="text-2xl font-bold">{{ stats?.total_points || 0 }}</p>
            </div>
            <TrophyIcon class="w-8 h-8 text-primary-200" />
          </div>
          <div class="mt-4">
            <p class="text-primary-100">Current Rank</p>
            <p class="text-lg font-semibold">{{ stats?.rank || 'Novice' }}</p>
          </div>
        </div>

        <!-- Learning Progress -->
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="space-y-4">
            <StatItem
              label="Completed Lessons"
              :value="stats?.completed_lessons"
              format="number"
            />
            <StatItem
              label="Accuracy Rate"
              :value="stats?.accuracy_rate"
              format="percentage"
            />
            <StatItem
              label="Quiz Average"
              :value="stats?.quiz_average"
              format="percentage"
            />
          </div>
        </div>

        <!-- Time & Streak -->
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="space-y-4">
            <StatItem
              label="Time Spent Learning"
              :value="stats?.time_spent"
              format="time"
            />
            <StatItem
              label="Longest Streak"
              :value="stats?.streak?.longest_streak"
              format="days"
            />
            <StatItem
              label="Next Milestone"
              :value="stats?.streak?.next_milestone"
              format="points"
            />
          </div>
        </div>
      </div>

      <!-- Achievements -->
      <div v-if="stats?.achievements?.length" class="mt-8">
        <h3 class="text-lg font-semibold mb-4">Recent Achievements</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Achievement
            v-for="achievement in stats.achievements"
            :key="achievement.id"
            :achievement="achievement"
          />
        </div>
      </div>

      <!-- Lessons & Accuracy -->
      <div class="bg-white border border-gray-200 rounded-lg p-4 mt-8">
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-600">Completed Lessons</p>
            <p class="text-xl font-semibold">{{ stats?.completed_lessons || 0 }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Accuracy Rate</p>
            <p class="text-xl font-semibold">
              {{ ((stats?.accuracy_rate || 0) * 100).toFixed(1) }}%
            </p>
          </div>
        </div>
      </div>

      <!-- Points History Chart -->
      <div class="mt-8">
        <h3 class="text-lg font-semibold mb-4">Points History</h3>
        <div class="h-64">
          <LineChart
            v-if="chartData"
            :chart-data="chartData"
            :options="chartOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TrophyIcon } from '@heroicons/vue/24/outline';
import type { LearningStats } from '@/types/profile';
import LineChart from '@/components/common/LineChart.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import StatItem from '@/components/stats/StatItem.vue';
import Achievement from '@/components/achievements/Achievement.vue';

const props = defineProps<{
  stats?: LearningStats;
  loading?: boolean;
}>();

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

const chartData = computed(() => {
  if (!props.stats?.points_history) return null;

  const labels = props.stats.points_history.map(entry => 
    new Date(entry.timestamp).toLocaleDateString()
  );
  const data = props.stats.points_history.map(entry => entry.amount);

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
</script>
