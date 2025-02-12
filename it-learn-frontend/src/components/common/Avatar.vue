<template>
  <div class="avatar" :class="[size, { 'avatar-placeholder': !imgSrc }]">
    <img
      v-if="imgSrc"
      :src="imgSrc"
      :alt="name"
      @error="handleImageError"
      class="w-full h-full object-cover rounded-full"
    />
    <div v-else class="avatar-initials">{{ initials }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}>();

const hasError = ref(false);

const imgSrc = computed(() => {
  if (hasError.value || !props.src) return null;
  return props.src.startsWith('data:') ? props.src : `data:image/png;base64,${props.src}`;
});

const initials = computed(() => {
  return props.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const handleImageError = () => {
  hasError.value = true;
};
</script>

<style scoped>
.avatar {
  @apply relative overflow-hidden rounded-full bg-gray-200;
}

.avatar-placeholder {
  @apply flex items-center justify-center bg-primary-100 text-primary-600;
}

.avatar-initials {
  @apply text-lg font-semibold;
}

.sm { @apply w-8 h-8; }
.md { @apply w-12 h-12; }
.lg { @apply w-16 h-16; }
.xl { @apply w-32 h-32; }
</style>