<template>
  <div class="level-list">
    <h2 class="text-3xl font-bold mb-8">Levels</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LevelCard
        v-for="level in levels"
        :key="level.id"
        :level="level"
        :progress="levelProgressMap[level.id]"
        @select-level="onSelectLevel(level)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import LevelCard from './LevelCard.vue';
import type { Level, LevelProgress } from '@/types/lessons';

const props = defineProps<{
  levels: Level[];
  levelProgressMap: Record<string, LevelProgress>;
}>();

const emit = defineEmits(['select-level']);

const onSelectLevel = (level: Level) => {
  emit('select-level', level);
};
</script>

<style scoped>
.level-list {
  padding: 2rem;
}
</style>
