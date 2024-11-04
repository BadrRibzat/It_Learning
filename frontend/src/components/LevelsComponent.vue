<template>
  <div class="levels">
    <h1>Levels</h1>
    <div v-if="levels.length">
      <div v-for="level in levels" :key="level.id" class="level">
        <h2>{{ level.name }}</h2>
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
    ...mapGetters(['levels']),
  },
  methods: {
    ...mapActions(['fetchLevels']),
    viewLevel(levelId) {
      this.$router.push(`/levels/${levelId}`);
    },
  },
  async created() {
    await this.fetchLevels();
  },
};
</script>

<style scoped>
.levels {
  padding: 2rem;
}

.level {
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
