<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>
      
      <div v-else>
        <h1 class="text-3xl font-bold mb-8">Welcome, {{ username }}</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Profile Summary -->
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="flex items-center space-x-4 mb-6">
              <img
                :src="profilePicture || '/default-avatar.png'"
                class="w-24 h-24 rounded-full object-cover"
                alt="Profile"
              />
              <div>
                <h2 class="text-xl font-semibold">{{ username }}</h2>
                <p class="text-gray-600">{{ email }}</p>
              </div>
            </div>
          </div>
          
          <!-- Quick Stats -->
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h2 class="text-xl font-bold mb-4">Your Progress</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-4 bg-gray-50 rounded">
                <p class="text-sm text-gray-600">Level</p>
                <p class="text-2xl font-bold text-primary">{{ userStats.level || 1 }}</p>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded">
                <p class="text-sm text-gray-600">Points</p>
                <p class="text-2xl font-bold text-primary">{{ userStats.total_points || 0 }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Sidebar from '@/components/dashboard/Sidebar.vue';

const store = useStore();
const loading = ref(false);
const error = ref(null);

const username = computed(() => store.state.auth.user?.username || '');
const email = computed(() => store.state.auth.user?.email || '');
const profilePicture = computed(() => store.state.profile.profile?.profile_picture);
const userStats = computed(() => store.state.profile.stats || {});

onMounted(async () => {
  try {
    loading.value = true;
    await Promise.all([
      store.dispatch('profile/fetchProfile'),
      store.dispatch('profile/fetchStats')
    ]);
  } catch (err) {
    error.value = 'Failed to load profile data';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
