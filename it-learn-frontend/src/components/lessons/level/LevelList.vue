<template>
  <div class="level-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <LevelCard
      v-for="level in levels"
      :key="level.id"
      :level="level"
      :progress="progress?.[level.id]"
      @select="handleLevelSelect(level)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LevelCard from './LevelCard.vue';
import type { Level, LevelProgress } from '@/types/lessons';

const props = defineProps<{
  levels: Level[];
  progress?: Record<string, LevelProgress>;
}>();

const emit = defineEmits<{
  (e: 'select-level', level: Level): void;
}>();

const handleLevelSelect = (level: Level) => {
  emit('select-level', level);
};
</script>

<style scoped>
.level-list {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .level-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .level-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
