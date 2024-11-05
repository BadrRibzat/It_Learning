<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">{{ $t("levelTest.title") }}</h1>
    <!-- Implement level test UI here -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

onMounted(() => {
  const levelId = route.params.levelId;
  // Fetch level test questions based on levelId
  console.log(`Fetching level test for level ${levelId}`);
});
</script>
