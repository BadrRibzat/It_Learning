<template>
  <button
    :class="['button', { 'button--primary': primary, 'button--secondary': secondary }]"
    @click="onClick"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  primary: {
    type: Boolean,
    default: false,
  },
  secondary: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);

const onClick = () => {
  emit('click');
};
</script>

<style scoped>
.button {
  @apply px-4 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.button--primary {
  @apply text-white bg-primary hover:bg-primary-dark focus:ring-primary;
}

.button--secondary {
  @apply text-primary bg-white border border-primary hover:bg-primary-50 focus:ring-primary;
}
</style>
