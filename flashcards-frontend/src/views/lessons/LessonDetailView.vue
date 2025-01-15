<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <h1 class="text-3xl font-bold mb-8">Lesson Detail</h1>
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">{{ lesson.title }}</h2>
        <p class="text-gray-700 mb-4">{{ lesson.content }}</p>
        <button @click="startLesson" class="bg-primary text-white px-4 py-2 rounded-lg">Start Lesson</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import Sidebar from '@/components/dashboard/Sidebar.vue';

const store = useStore();
const route = useRoute();
const router = useRouter();
const lesson = ref({});

onMounted(async () => {
  const lessonId = route.params.id;
  await store.dispatch('lessons/fetchLesson', lessonId);
  lesson.value = store.state.lessons.currentLesson;
});

const startLesson = async () => {
  await store.dispatch('lessons/updateCurrentLesson', lesson.value.id);
  await store.dispatch('flashcards/fetchFlashcards', { lessonId: lesson.value.id });
  router.push('/dashboard/flashcards');
};

const showQuiz = computed(() => {
  return lessonProgress.value?.completed;
});
</script>
