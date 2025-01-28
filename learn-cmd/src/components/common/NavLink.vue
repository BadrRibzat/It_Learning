<template>
  <button
    class="flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200"
    :class="[
      'hover:bg-gray-100 dark:hover:bg-gray-700',
      { 'justify-center': !expanded },
      active ? 'bg-primary-50 text-primary dark:bg-gray-700 dark:text-primary' : 'text-gray-700 dark:text-gray-300'
    ]"
    @click="$emit('click')"
  >
    <font-awesome-icon :icon="icon" class="w-5 h-5" />
    <span v-if="expanded" class="ml-3">{{ text }}</span>
  </button>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  expanded: {
    type: Boolean,
    default: true
  },
  active: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>
