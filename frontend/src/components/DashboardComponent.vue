<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Welcome to your dashboard!</p>
    <div class="dashboard-stats">
      <div class="stat">
        <h3>Completed Lessons</h3>
        <p>{{ completedLessons }}</p>
      </div>
      <div class="stat">
        <h3>Total Points</h3>
        <p>{{ totalPoints }}</p>
      </div>
      <div class="stat">
        <h3>Current Level</h3>
        <p>{{ currentLevel }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'DashboardComponent',
  computed: {
    ...mapGetters(['completedLessons', 'totalPoints', 'currentLevel']),
  },
  methods: {
    ...mapActions(['fetchProfile', 'fetchProgress', 'fetchStatistics']),
  },
  async created() {
    await this.fetchProfile();
    await this.fetchProgress();
    await this.fetchStatistics();
  },
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}

.dashboard-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
}

.stat {
  background-color: #42b983;
  color: white;
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
}
</style>
