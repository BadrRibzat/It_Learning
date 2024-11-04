<template>
  <div class="level-tests">
    <h1>Level Tests</h1>
    <div v-if="levelTests.length">
      <div v-for="levelTest in levelTests" :key="levelTest.id" class="level-test">
        <h2>{{ levelTest.title }}</h2>
        <button @click="startLevelTest(levelTest.id)" :disabled="!canTakeLevelTest(levelTest)">
          {{ levelTestButtonText(levelTest) }}
        </button>
      </div>
    </div>
    <div v-else>
      <p>No level tests available.</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'LevelTestsComponent',
  computed: {
    ...mapGetters(['levelTests', 'userLevelProgress']),
  },
  methods: {
    ...mapActions(['fetchLevelTests', 'fetchUserLevelProgress']),
    startLevelTest(levelTestId) {
      this.$router.push(`/level-tests/${levelTestId}`);
    },
    canTakeLevelTest(levelTest) {
      if (levelTest.level === 1) return true;
      const previousLevel = this.userLevelProgress.find(progress => progress.level === levelTest.level - 1);
      return previousLevel && previousLevel.completed;
    },
    levelTestButtonText(levelTest) {
      const progress = this.userLevelProgress.find(progress => progress.level === levelTest.level);
      if (progress && progress.completed) {
        return 'Retake Test';
      }
      return this.canTakeLevelTest(levelTest) ? 'Start Test' : 'Locked';
    },
  },
  async created() {
    try {
      await this.fetchLevelTests();
      await this.fetchUserLevelProgress();
    } catch (error) {
      console.error('Failed to fetch level tests:', error);
      alert('Failed to load level tests. Please try again later.');
    }
  },
};
</script>

<style scoped>
.level-tests {
  padding: 2rem;
}

.level-test {
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
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #35495e;
}
</style>
