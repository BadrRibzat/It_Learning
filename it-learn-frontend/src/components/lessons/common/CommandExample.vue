<template>
  <div class="command-example">
    <div class="bg-gray-900 rounded-lg p-4">
      <div class="flex items-center justify-between mb-2">
        <div class="flex space-x-2">
          <div class="w-3 h-3 rounded-full bg-red-500" />
          <div class="w-3 h-3 rounded-full bg-yellow-500" />
          <div class="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <button 
          v-if="canCopy"
          @click="copyToClipboard"
          class="text-gray-400 hover:text-white text-sm"
        >
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
      
      <div class="font-mono text-sm">
        <div class="flex items-start space-x-2">
          <span class="text-green-400">$</span>
          <code class="text-white">{{ command }}</code>
        </div>
        <div v-if="output" class="mt-2 text-gray-300">
          {{ output }}
        </div>
      </div>
    </div>
    
    <div v-if="description" class="mt-2 text-sm text-gray-600">
      {{ description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  command: string;
  output?: string;
  description?: string;
  canCopy?: boolean;
}>();

const copied = ref(false);

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.command);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy command:', err);
  }
};
</script>
