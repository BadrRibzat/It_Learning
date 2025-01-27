<template>
  <div class="mb-4">
    <h3 
      v-if="expanded" 
      class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
    >
      {{ title }}
    </h3>
    <div class="mt-2 space-y-1">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  expanded: {
    type: Boolean,
    default: true
  }
});
</script>
