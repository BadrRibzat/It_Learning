<template>
  <div class="level-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <LevelCard
      v-for="level in levels"
      :key="level.id"
      :level="level"
      :progress="progress[level.id]"
      @select="selectLevel"
    />
  </div>
</template>

<script setup lang="ts">
import LevelCard from './LevelCard.vue';
import type { Level, LevelProgress } from '@/types/lessons';

const props = defineProps<{
  levels: Level[];
  progress: Record<string, LevelProgress>;
}>();

const selectLevel = (level: Level) => {
  emit('select-level', level);
};
</script>