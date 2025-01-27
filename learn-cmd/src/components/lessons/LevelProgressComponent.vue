<template>
  <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Learning Progress</h2>
    
    <!-- Level Progress Display -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div 
        v-for="level in allLevels" 
        :key="level"
        class="relative"
      >
        <div 
          class="p-4 rounded-lg"
          :class="getLevelClasses(level)"
        >
          <h3 class="text-lg font-semibold capitalize">{{ level }}</h3>
          <p class="text-sm mt-1">
            {{ getLevelStatus(level) }}
          </p>
          
          <!-- Progress Indicator -->
          <div v-if="isCurrentLevel(level)" class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-primary h-2 rounded-full transition-all duration-300"
                :style="{ width: `${levelProgress}%` }"
              ></div>
            </div>
            <p class="text-xs mt-1 text-gray-600">
              {{ levelProgress }}% Complete
            </p>
          </div>

          <!-- Level Actions -->
          <div class="mt-4">
            <router-link
              v-if="isLevelAccessible(level)"
              :to="`/profile/lessons/${level}`"
              class="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm"
            >
              {{ isCurrentLevel(level) ? 'Continue Learning' : 'Start Learning' }}
            </router-link>
            <button
              v-else
              class="px-4 py-2 bg-gray-100 text-gray-500 rounded-md text-sm cursor-not-allowed"
              disabled
            >
              Locked
            </button>
          </div>
        </div>

        <!-- Connection Line -->
        <div 
          v-if="!isLastLevel(level)"
          class="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5"
          :class="getLevelConnectionClass(level)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'LevelProgressComponent',
  
  setup() {
    const store = useStore();
    
    const allLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    
    const currentLevel = computed(() => store.getters['lessons/currentLevel']);
    const unlockedLevels = computed(() => store.getters['lessons/unlockedLevels']);
    const levelProgress = computed(() => store.getters['lessons/levelProgress']);

    const isCurrentLevel = (level) => level === currentLevel.value;
    
    const isLevelAccessible = (level) => {
      if (level === 'beginner') return true;
      return unlockedLevels.value.includes(level);
    };

    const isLastLevel = (level) => {
      return allLevels.indexOf(level) === allLevels.length - 1;
    };

    const getLevelClasses = (level) => ({
      'bg-primary-50 border-primary': isCurrentLevel(level),
      'bg-green-50 border-green-500': isLevelAccessible(level) && !isCurrentLevel(level),
      'bg-gray-50 border-gray-200': !isLevelAccessible(level),
      'border-2': true
    });

    const getLevelStatus = (level) => {
      if (isCurrentLevel(level)) return 'Current Level';
      if (isLevelAccessible(level)) return 'Available';
      return 'Locked';
    };

    const getLevelConnectionClass = (level) => ({
      'bg-primary': isCurrentLevel(level),
      'bg-green-500': isLevelAccessible(level) && !isCurrentLevel(level),
      'bg-gray-200': !isLevelAccessible(level)
    });

    return {
      allLevels,
      currentLevel,
      unlockedLevels,
      levelProgress,
      isCurrentLevel,
      isLevelAccessible,
      isLastLevel,
      getLevelClasses,
      getLevelStatus,
      getLevelConnectionClass
    };
  }
};
</script>
