<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="text-lg font-semibold">{{ title }}</h3>
    <p class="text-3xl font-bold">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  value: string | number;
}>();
</script>
