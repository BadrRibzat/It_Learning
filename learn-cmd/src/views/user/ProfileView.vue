<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex">
      <Sidebar :isSidebarOpen="isSidebarOpen" @toggle-sidebar="toggleSidebar" />
      
      <div :class="[isSidebarOpen ? 'ml-64' : 'ml-16', 'flex-1 p-6']">
        <router-view v-slot="{ Component }">
          <Suspense>
            <template #default>
              <component :is="Component" />
            </template>
            <template #fallback>
              <div class="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" label="Loading..." />
              </div>
            </template>
          </Suspense>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from '@/components/common/Sidebar.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const isSidebarOpen = ref(true);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>
