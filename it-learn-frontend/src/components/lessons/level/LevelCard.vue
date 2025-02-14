<template>
  <div class="level-card" :class="{ unlocked: level.is_unlocked }">
    <h3>{{ level.name }}</h3>
    <p>{{ level.description }}</p>
    <button @click="startLearning">Start Learning</button>
    <button v-if="level.test_available" @click="startTest">Take Test</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Level } from '@/types/lessons';

export default defineComponent({
  props: {
    level: {
      type: Object as () => Level,
      required: true,
    },
  },
  emits: ['start-learning'],
  methods: {
    startLearning() {
      this.$emit('start-learning', this.level);
    },
    startTest() {
      this.$router.push(`/levels/${this.level.id}/test`);
    },
  },
});
</script>

<style scoped>
.level-card.unlocked {
  background-color: #f0fff0;
}
</style>
