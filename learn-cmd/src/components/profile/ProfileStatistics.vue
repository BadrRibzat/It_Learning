<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-2xl font-bold mb-6">Learning Statistics</h2>
    <StatisticsChart />
  </div>
</template>

<script>
import StatisticsChart from '@/components/progress/StatisticsChart.vue';

export default {
  name: 'ProfileStatistics',
  components: {
    StatisticsChart
  }
};
</script>
