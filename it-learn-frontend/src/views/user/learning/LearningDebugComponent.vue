<template>
  <div class="debug-component bg-gray-100 p-4 rounded-md">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-800">Learning Debug Information</h3>
      <button 
        @click="expanded = !expanded"
        class="text-sm text-gray-600 hover:text-gray-900"
      >
        {{ expanded ? 'Collapse' : 'Expand' }}
      </button>
    </div>
    
    <div v-if="expanded" class="space-y-4">
      <div v-for="(value, key) in debugData" :key="key" class="debug-section">
        <h4 class="text-md font-medium text-gray-700 mb-2">{{ formatKey(key) }}</h4>
        <pre class="text-sm text-gray-700 bg-white p-2 rounded">{{ formatValue(value) }}</pre>
      </div>
    </div>
    
    <div v-else class="text-sm text-gray-600">
      Click expand to see debug information
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  debugData: Record<string, any>;
}>();

const expanded = ref(false);

const formatKey = (key: string): string => {
  return key
    .split(/(?=[A-Z])/)
    .join(' ')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
};

const formatValue = (value: any): string => {
  try {
    return JSON.stringify(value, null, 2);
  } catch (e) {
    return String(value);
  }
};
</script>

<style scoped>
.debug-component {
  max-height: 600px;
  overflow-y: auto;
}

.debug-section {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
}

.debug-section:last-child {
  border-bottom: none;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>