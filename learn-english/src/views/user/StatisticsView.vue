<template>
  <div>
    <h1>Statistics</h1>
    <Chart :data="chartData" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('profile', ['statistics']),
    chartData() {
      return {
        labels: ['Completed Lessons', 'Total Points', 'Correct Flashcards'],
        datasets: [
          {
            label: 'Statistics',
            data: [
              this.statistics.completed_lessons,
              this.statistics.total_points,
              this.statistics.correct_flashcards,
            ],
            backgroundColor: ['#4F46E5', '#10B981', '#3B82F6'],
          },
        ],
      };
    },
  },
};
</script>
