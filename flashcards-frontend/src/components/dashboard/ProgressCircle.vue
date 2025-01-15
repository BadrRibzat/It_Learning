<template>
  <div class="relative w-24 h-24">
    <svg class="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" stroke-width="10" />
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#4F46E5"
        stroke-width="10"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="circumference - (progress / 100) * circumference"
        transform="rotate(-90 50 50)"
      />
    </svg>
    <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xl font-bold">
      {{ progress }}%
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    required: true,
  },
})

const circumference = computed(() => 2 * Math.PI * 45)
</script>
