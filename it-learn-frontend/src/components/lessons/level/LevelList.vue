<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <LevelCard
      v-for="level in levels"
      :key="level.id"
      :level="level"
      :progress="getLevelProgress(level.id)"
      @select="$emit('select-level', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Level, LevelProgress } from '@/types/lessons';
import { useLessonsStore } from '@/stores/lessons';
import LevelCard from './LevelCard.vue';

const props = defineProps<{
  levels: Level[];
}>();

defineEmits<{
  (e: 'select-level', level: Level): void;
}>();

const lessonsStore = useLessonsStore();

const getLevelProgress = (levelId: string) => {
  return lessonsStore.levelProgress;
};
</script>
