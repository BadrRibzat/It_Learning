<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h3 class="text-xl font-bold mb-4">{{ lesson.title }}</h3>
    <p class="text-gray-700 mb-4">{{ lesson.content }}</p>
    <router-link :to="`/dashboard/lessons/${lesson.id}`" class="bg-primary text-white px-4 py-2 rounded-lg">Start Lesson</router-link>
  </div>
</template>

<script setup>
defineProps({
  lesson: {
    type: Object,
    required: true,
  },
});
</script>
