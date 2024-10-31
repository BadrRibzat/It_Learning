<template>
<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Lessons List</h1>
    <div v-if="loading">Loading lessons...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LessonCard v-for="lesson in lessons" :key="lesson.id" :lesson="lesson" />
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import LessonCard from '@/components/lessons/LessonCard.vue';

const store = useStore();
const lessons = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    try {
        await store.dispatch('lessons/fetchLessons');
        lessons.value = store.getters['lessons/allLessons'];
    } catch (err) {
        error.value = 'Failed to load lessons. Please try again.';
    } finally {
        loading.value = false;
    }
});
</script>
