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
        <li v-for="item in sidebarItems" :key="item.name">
          <router-link
            :to="item.path"
            class="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
            :class="{ 'bg-gray-200': isActive(item.path) }"
          >
            <font-awesome-icon :icon="item.icon" class="w-6 text-center" />
            <span v-if="isSidebarOpen" class="ml-3">{{ item.name }}</span>
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

    const sidebarItems = [
      { name: "Profile", path: "/profile", icon: "user" },
      { name: "Statistics", path: "/profile/statistics", icon: "chart-bar" },
      { name: "Recommended", path: "/profile/recommended", icon: "thumbs-up" },
      { name: "Beginner", path: "/profile/beginner", icon: "level-up-alt" },
      { name: "Intermediate", path: "/profile/intermediate", icon: "level-up-alt" },
      { name: "Level-Test", path: "/profile/Test", icon: "clipboard-check" },
      { name: "Advanced", path: "/profile/advanced", icon: "level-up-alt" },
      { name: "Flashcards", path: "/profile/flashcards", icon: "layer-group" },
      { name: "Quizzes", path: "/profile/quizzes", icon: "question-circle" },
      { name: "Notes", path: "/profile/notes", icon: "sticky-note" },
    ];

    const isActive = (path) => {
      return route.path === path;
    };

    return {
      sidebarItems,
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
