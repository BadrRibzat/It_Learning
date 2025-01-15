<template>
  <div>
    <h1>{{ currentLesson.title }}</h1>
    <p>{{ currentLesson.content }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { key } from '@/store';

const store = useStore(key);
const route = useRoute();

const currentLesson = computed(() => store.state.lessons.currentLesson);

onMounted(async () => {
  await store.dispatch('lessons/fetchLessonById', route.params.id);
});
</script>
