// src/components/levels/LevelCard.vue
<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h3 class="text-xl font-bold mb-4">{{ level.name }}</h3>
    <p class="text-gray-700 mb-4">Level Order: {{ level.level_order }}</p>
    
    <!-- Level status badge -->
    <div class="mb-4">
      <span 
        :class="levelStatusClass"
        class="px-2 py-1 rounded-full text-sm font-semibold"
      >
        {{ levelStatusText }}
      </span>
    </div>

    <!-- Action button -->
    <div class="mt-4">
      <!-- For beginner level -->
      <router-link 
        v-if="isBeginnerLevel"
        :to="{ name: 'Lessons', query: { level: level.id }}"
        class="bg-primary text-white px-4 py-2 rounded-lg inline-block"
      >
        Start Learning
      </router-link>

      <!-- For other levels - locked state -->
      <button
        v-else-if="isLocked"
        class="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed"
        disabled
      >
        Complete Previous Level
      </button>

      <!-- For other levels - unlocked state -->
      <router-link 
        v-else
        :to="`/dashboard/levels/${level.id}/test`"
        class="bg-primary text-white px-4 py-2 rounded-lg inline-block"
      >
        Take Level Test
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const props = defineProps({
  level: {
    type: Object,
    required: true,
  },
});

const isBeginnerLevel = computed(() => props.level.level_order === 1);
const userLevel = computed(() => store.state.auth.user?.level || 1);

const isLocked = computed(() => {
  if (isBeginnerLevel.value) return false;
  return props.level.level_order > userLevel.value;
});

const levelStatusClass = computed(() => {
  if (isBeginnerLevel.value) return 'bg-green-100 text-green-800';
  if (isLocked.value) return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
});

const levelStatusText = computed(() => {
  if (isBeginnerLevel.value) return 'Available';
  if (isLocked.value) return 'Locked';
  return 'Test Required';
});
</script>
