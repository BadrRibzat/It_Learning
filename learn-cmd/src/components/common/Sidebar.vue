<template>
  <aside
    :class="[
      isSidebarOpen ? 'w-64' : 'w-16',
      'sidebar bg-white dark:bg-gray-800 shadow-lg fixed transition-all duration-300 ease-in-out z-30',
      'md:translate-x-0',
      !isSidebarOpen && '-translate-x-full md:translate-x-0'
    ]"
  >
    <div class="h-full flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div class="flex items-center space-x-2">
          <img src="@/assets/logo.svg" alt="Logo" class="h-8 w-8" v-if="isSidebarOpen" />
          <span class="font-bold text-lg text-primary dark:text-white" v-if="isSidebarOpen">
            IT Learn
          </span>
        </div>
        <button
          @click="$emit('toggle-sidebar')"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          :aria-label="isSidebarOpen ? 'Close sidebar' : 'Open sidebar'"
        >
          <font-awesome-icon
            :icon="isSidebarOpen ? 'times' : 'bars'"
            class="text-gray-500 dark:text-gray-400"
          />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto p-4">
        <div class="space-y-6">
          <!-- User Section -->
          <div v-if="profile" class="pb-4 border-b dark:border-gray-700">
            <div class="flex items-center space-x-3 mb-3">
              <div class="relative">
                <img
                  :src="profile.profile_picture || '/default-avatar.png'"
                  alt="Profile"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div
                  class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"
                ></div>
              </div>
              <div v-if="isSidebarOpen">
                <h3 class="font-medium text-gray-900 dark:text-white">
                  {{ profile.user?.full_name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ currentLevel }}
                </p>
              </div>
            </div>

            <!-- Level Progress -->
            <div v-if="isSidebarOpen" class="mb-4">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600 dark:text-gray-400">Level Progress</span>
                <span class="text-primary">{{ levelProgress }}%</span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                  class="h-full bg-primary rounded-full transition-all duration-300"
                  :style="{ width: `${levelProgress}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="space-y-2">
            <!-- Main Navigation -->
            <nav-section title="Main" :expanded="isSidebarOpen">
		  <nav-link
		    to="/profile"
		    icon="gauge"
		    text="Dashboard"
		    :expanded="isSidebarOpen"
		  />
		  <nav-link
		    to="/profile/settings"
 		   icon="cog"
		    text="Settings"
		    :expanded="isSidebarOpen"
		  />
		</nav-section>

		<nav-section title="Learning" :expanded="isSidebarOpen">
		  <nav-link
		    to="/profile/lessons"
		    icon="book"
		    text="Lessons"
		    :expanded="isSidebarOpen"
		  />
		  <nav-link
		    to="/profile/flashcards"
		    icon="layer-group"
		    text="Flashcards"
		    :expanded="isSidebarOpen"
		  />
		  <nav-link
		    to="/profile/statistics"
		    icon="chart-bar"
		    text="Statistics"
		    :expanded="isSidebarOpen"
		  />
		</nav-section>

		<nav-section title="Tools" :expanded="isSidebarOpen">
		  <nav-link
		    to="/profile/notes"
		    icon="sticky-note"
		    text="Notes"
		    :expanded="isSidebarOpen"
		  />
		</nav-section>
          </div>
        </div>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t dark:border-gray-700">
        <div class="flex items-center justify-between">
          <theme-switcher v-if="isSidebarOpen" />
          <logout-button :expanded="isSidebarOpen" />
        </div>
      </div>
    </div>
  </aside>

  <!-- Overlay -->
  <div
    v-if="isSidebarOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
    @click="$emit('toggle-sidebar')"
  ></div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import NavSection from './NavSection.vue';
import NavLink from './NavLink.vue';
import ThemeSwitcher from './ThemeSwitcher.vue';
import LogoutButton from '../auth/LogoutButton.vue';

const props = defineProps({
  isSidebarOpen: {
    type: Boolean,
    required: true,
  },
});

const store = useStore();
const route = useRoute();

const profile = computed(() => store.getters['profile/profile']);
const levelProgression = computed(() => store.getters['lessons/levelProgression']);
const currentLevel = computed(() => store.getters['lessons/currentLevel']);
const levelProgress = computed(() => store.getters['lessons/levelProgress']);

const availableLevels = ['beginner', 'intermediate', 'advanced', 'expert'];

const isLevelAccessible = (level) => {
  if (level === 'beginner') return true;
  return store.getters['lessons/isLevelUnlocked'](level);
};

const getLevelIcon = (level) => {
  const icons = {
    beginner: 'star',
    intermediate: 'star-half-alt',
    advanced: 'star',
    expert: 'crown'
  };
  return icons[level] || 'star';
};

onMounted(async () => {
  if (!levelProgression.value) {
    await store.dispatch('lessons/fetchLevelProgression');
  }
});
</script>

<style scoped>
.sidebar {
  height: 100vh;
  top: 0;
}

@media (min-width: 768px) {
  .sidebar {
    height: calc(100vh - 4rem);
    top: 4rem;
  }
}

/* Custom scrollbar */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.400') theme('colors.gray.100');
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: theme('colors.gray.100');
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.400');
  border-radius: 2px;
}
</style>
