<template>
  <div :class="['bg-white shadow-lg rounded-lg', padding]">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  padding?: string;
}

withDefaults(defineProps<Props>(), {
  padding: 'p-6',
});
</script>
