<template>
  <div class="avatar" :class="[size, { 'avatar-placeholder': !src }]">
    <template v-if="src">
      <img
        :src="src"
        :alt="alt"
        @error="handleImageError"
        class="w-full h-full object-cover rounded-full"
      />
    </template>
    <template v-else>
      <div class="avatar-initials">
        {{ initials }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}>();

const imageError = ref(false);

const initials = computed(() => {
  if (!props.name) return '?';
  return props.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const handleImageError = () => {
  imageError.value = true;
};
</script>

<style scoped>
.avatar {
  @apply relative overflow-hidden bg-gray-200;
  border-radius: 50%;
}

.avatar-placeholder {
  @apply flex items-center justify-center bg-gray-200;
}

.avatar-initials {
  @apply text-gray-600 font-medium;
}

.sm {
  @apply w-8 h-8;
  .avatar-initials {
    @apply text-sm;
  }
}

.md {
  @apply w-12 h-12;
  .avatar-initials {
    @apply text-base;
  }
}

.lg {
  @apply w-16 h-16;
  .avatar-initials {
    @apply text-lg;
  }
}

.xl {
  @apply w-32 h-32;
  .avatar-initials {
    @apply text-2xl;
  }
}
</style>
