<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-md',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      variant === 'primary' && 'bg-primary text-white hover:bg-primary-dark',
      variant === 'secondary' && 'bg-secondary text-white hover:bg-secondary-dark',
      size === 'sm' && 'px-3 py-1.5 text-sm',
      size === 'md' && 'px-4 py-2 text-base',
      size === 'lg' && 'px-6 py-3 text-lg',
      disabled && 'opacity-50 cursor-not-allowed',
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['click']);
</script>
