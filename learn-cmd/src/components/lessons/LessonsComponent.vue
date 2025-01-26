<template>
  <div class="flex">
    <Sidebar :isSidebarOpen="isSidebarOpen" @toggle-sidebar="toggleSidebar" />

    <div
      :class="[
        isSidebarOpen ? 'ml-64' : 'ml-16',
        'flex-1 transition-all duration-300 ease-in-out p-6'
      ]"
    >
      <!-- Level Progression Overview -->
      <div class="mb-6 bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Your Learning Journey</h2>
        <div v-if="levelProgression" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-700">Current Level</h3>
            <p class="text-2xl font-bold text-primary mt-2">
              {{ levelProgression.current_level }}
            </p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-700">Next Level</h3>
            <p class="text-2xl font-bold text-primary mt-2">
              {{ levelProgression.next_level || 'Max Level Reached' }}
            </p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-700">Required Score</h3>
            <p class="text-2xl font-bold text-primary mt-2">
              {{ (levelProgression.required_score * 100) + '%' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Learning Sections -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Levels Section -->
        <div 
          v-for="level in ['beginner', 'intermediate', 'advanced']" 
          :key="level"
          class="bg-white rounded-lg shadow p-6"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-700 capitalize">{{ level }}</h3>
            <span 
              :class="[
                'px-2 py-1 rounded text-sm',
                isLevelUnlocked(level) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              ]"
            >
              {{ isLevelUnlocked(level) ? 'Unlocked' : 'Locked' }}
            </span>
          </div>
          
          <!-- Level Content -->
          <div class="space-y-4">
            <!-- Flashcards -->
            <router-link
              :to="`/lessons/${level}/flashcards`"
              class="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': !isLevelUnlocked(level) }"
            >
              <div class="flex items-center">
                <i class="fas fa-layer-group mr-2 text-primary"></i>
                <span>Flashcards</span>
              </div>
            </router-link>

            <!-- Quizzes -->
            <router-link
              :to="`/lessons/${level}/quizzes`"
              class="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': !isLevelUnlocked(level) || !isQuizUnlocked(level) }"
            >
              <div class="flex items-center">
                <i class="fas fa-question-circle mr-2 text-primary"></i>
                <span>Quizzes</span>
              </div>
            </router-link>

            <!-- Level Test -->
            <router-link
              v-if="level !== 'beginner'"
              :to="`/lessons/${level}/test`"
              class="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': !canTakeLevelTest(level) }"
            >
              <div class="flex items-center">
                <i class="fas fa-clipboard-check mr-2 text-primary"></i>
                <span>Level Test</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Router View for Nested Components -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Sidebar from '@/components/common/Sidebar.vue';
import { NotificationService } from '@/utils/NotificationService';

export default {
  name: 'LessonsComponent',
  components: {
    Sidebar
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isSidebarOpen = ref(true);
    const levelProgression = ref(null);
    const loading = ref(true);

    const fetchLevelProgression = async () => {
      try {
        const response = await store.dispatch('lessons/fetchLevelProgression');
        levelProgression.value = response;
      } catch (error) {
        NotificationService.showError('Failed to load level progression');
      } finally {
        loading.value = false;
      }
    };

    const isLevelUnlocked = (level) => {
      if (!levelProgression.value) return false;
      if (level === 'beginner') return true;
      return levelProgression.value.unlocked_levels.includes(level);
    };

    const isQuizUnlocked = (level) => {
      // This would need to be implemented based on your backend logic
      // For now, returning true if level is unlocked
      return isLevelUnlocked(level);
    };

    const canTakeLevelTest = (level) => {
      if (level === 'beginner') return false;
      // Add logic to determine if user can take level test
      // This might depend on completion of previous level
      return isLevelUnlocked(levelProgression.value?.current_level);
    };

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    onMounted(() => {
      fetchLevelProgression();
    });

    return {
      isSidebarOpen,
      levelProgression,
      loading,
      isLevelUnlocked,
      isQuizUnlocked,
      canTakeLevelTest,
      toggleSidebar
    };
  }
};
</script>
