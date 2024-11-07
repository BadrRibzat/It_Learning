<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <h1 class="text-3xl font-bold mb-8">Progress</h1>
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">User Progress</h2>
        <div v-for="levelProgress in userLevelProgress" :key="levelProgress.id" class="mb-8">
          <ProgressLevelProgress :levelProgress="levelProgress" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import ProgressLevelProgress from '@/components/dashboard/ProgressLevelProgress.vue' // Ensure this path is correct

const store = useStore()
const userLevelProgress = ref([])

onMounted(async () => {
  await store.dispatch('progress/fetchUserLevelProgress')
  userLevelProgress.value = store.state.progress.userLevelProgress
})
</script>
