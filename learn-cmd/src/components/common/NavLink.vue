<template>
  <router-link
    :to="to"
    :class="[
      'flex items-center px-3 py-2 rounded-lg transition-colors duration-200',
      'hover:bg-gray-100 dark:hover:bg-gray-700',
      { 'justify-center': !expanded },
      isActive ? 'bg-primary-50 text-primary dark:bg-gray-700 dark:text-primary' : 'text-gray-700 dark:text-gray-300'
    ]"
  >
    <font-awesome-icon :icon="icon" class="w-5 h-5" />
    <span v-if="expanded" class="ml-3">{{ text }}</span>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  to: {
    type: [String, Object],
    required: true
  },
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
  }
});

const route = useRoute();
const isActive = computed(() => route.path.startsWith(props.to.toString()));
</script>
