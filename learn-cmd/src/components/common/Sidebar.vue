<template>
  <aside
    :class="[
      isSidebarOpen ? 'w-64' : 'w-16',
      'sidebar bg-gray-100 p-6 shadow-md h-[calc(100vh-8rem)] fixed overflow-y-auto transition-all duration-300 ease-in-out',
    ]"
  >
    <div class="sidebar-sticky">
      <!-- Toggle Button -->
      <button
        @click="$emit('toggle-sidebar')"
        class="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
      >
        <font-awesome-icon :icon="isSidebarOpen ? 'times' : 'bars'" />
      </button>

      <!-- Sidebar Links -->
      <ul class="space-y-2 mt-12">
        <!-- Profile Dashboard -->
        <li>
          <router-link
            to="/profile"
            class="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
            :class="{ 'bg-gray-200': isActive('/profile') }"
          >
            <font-awesome-icon icon="user" class="w-6 text-center" />
            <span v-if="isSidebarOpen" class="ml-3">Dashboard</span>
          </router-link>
        </li>

        <!-- Lessons Section -->
        <li>
          <router-link
            to="/profile/lessons"
            class="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
            :class="{ 'bg-gray-200': isActive('/profile/lessons') }"
          >
            <font-awesome-icon icon="book" class="w-6 text-center" />
            <span v-if="isSidebarOpen" class="ml-3">Lessons</span>
          </router-link>
        </li>

        <!-- Flashcards -->
        <li>
          <router-link
            to="/profile/flashcards"
            class="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
            :class="{ 'bg-gray-200': isActive('/profile/flashcards') }"
          >
            <font-awesome-icon icon="layer-group" class="w-6 text-center" />
            <span v-if="isSidebarOpen" class="ml-3">Flashcards</span>
          </router-link>
        </li>

        <!-- Statistics -->
        <li>
          <router-link
            to="/profile/statistics"
            class="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
            :class="{ 'bg-gray-200': isActive('/profile/statistics') }"
          >
            <font-awesome-icon icon="chart-bar" class="w-6 text-center" />
            <span v-if="isSidebarOpen" class="ml-3">Statistics</span>
          </router-link>
        </li>

        <!-- Notes -->
        <li>
          <router-link
            to="/profile/notes"
            class="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
            :class="{ 'bg-gray-200': isActive('/profile/notes') }"
          >
            <font-awesome-icon icon="sticky-note" class="w-6 text-center" />
            <span v-if="isSidebarOpen" class="ml-3">Notes</span>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
import { useRoute } from "vue-router";

export default {
  name: "Sidebar",
  props: {
    isSidebarOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const route = useRoute();

    const isActive = (path) => {
      return route.path.startsWith(path);
    };

    return {
      isActive,
    };
  },
};
</script>

<style scoped>
.sidebar {
  top: 4rem;
  bottom: 10rem;
}
</style>
