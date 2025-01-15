<template>
  <div class="level-tests">
    <h1>Level Tests</h1>
    <div v-if="levelTests.length">
      <div v-for="levelTest in levelTests" :key="levelTest.id" class="level-test">
        <h2>{{ levelTest.title }}</h2>
        <button @click="startLevelTest(levelTest.id)">Start Level Test</button>
      </div>
    </div>
    <div v-else>
      <p>Loading level tests...</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'LevelTestsComponent',
  computed: {
    ...mapGetters(['levelTests']),
  },
  methods: {
    ...mapActions(['fetchLevelTests']),
    startLevelTest(levelTestId) {
      this.$router.push(`/level-tests/${levelTestId}`);
    },
  },
  async created() {
    await this.fetchLevelTests();
  },
};
</script>

<style scoped>
.level-tests {
  padding: 2rem;
}

.level-test {
  margin-bottom: 2rem;
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
