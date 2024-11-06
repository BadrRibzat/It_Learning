<template>
  <div :class="['bg-white shadow-lg rounded-lg', padding]">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    padding?: string;
  }>(),
  {
    padding: 'p-6',
  },
);
</script>
