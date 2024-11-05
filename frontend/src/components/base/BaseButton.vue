<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-md',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      variantClasses,
      sizeClasses,
      disabled && 'opacity-50 cursor-not-allowed',
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary text-white hover:bg-primary-dark';
    case 'secondary':
      return 'bg-secondary text-white hover:bg-secondary-dark';
    default:
      return '';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm';
    case 'md':
      return 'px-4 py-2 text-base';
    case 'lg':
      return 'px-6 py-3 text-lg';
    default:
      return '';
  }
});

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>
