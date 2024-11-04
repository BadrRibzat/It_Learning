<template>
  <div class="levels">
    <h1>Levels</h1>
    <div v-if="levels.length">
      <div v-for="level in levels" :key="level.id" class="level">
        <h2>{{ level.name }}</h2>
        <p>Progress: {{ getUserLevelProgress(level.id) }}%</p>
        <button @click="viewLevel(level.id)">View Level</button>
      </div>
    </div>
    <div v-else>
      <p>Loading levels...</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'LevelsComponent',
  computed: {
    ...mapGetters(['levels', 'userLevelProgress']),
  },
  methods: {
    ...mapActions(['fetchLevels', 'fetchUserLevelProgress']),
    viewLevel(levelId) {
      if (levelId === 1) {
        this.$router.push(`/lessons`);
      } else {
        this.$router.push(`/level-tests/${levelId}`);
      }
    },
    getUserLevelProgress(levelId) {
      const progress = this.userLevelProgress.find(p => p.level === levelId);
      return progress ? progress.progress : 0;
    },
  },
  async created() {
    await this.fetchLevels();
    await this.fetchUserLevelProgress();
  },
};
</script>

<style scoped>
.levels {
  padding: 2rem;
}

.level {
  margin-bottom: 2rem;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 4px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #35495e;
}
</style>
