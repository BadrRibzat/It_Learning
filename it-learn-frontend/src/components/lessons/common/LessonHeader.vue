<template>
  <header class="lesson-header">
    <h1 class="text-3xl font-bold mb-4">{{ lesson.title }}</h1>
    <p class="text-gray-600">{{ lesson.description }}</p>
  </header>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { Lesson } from '@/types/lessons';

const props = defineProps<{
  lesson: Lesson;
}>();
</script>

<style scoped>
.lesson-header {
  margin-bottom: 2rem;
}
</style>
