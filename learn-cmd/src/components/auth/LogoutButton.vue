<template>
  <button
    @click="handleLogout"
    class="text-gray-600 hover:text-primary transition-colors flex items-center"
    :disabled="loading"
  >
    <i class="fas fa-sign-out-alt mr-2"></i>
    {{ loading ? 'Logging out...' : 'Logout' }}
  </button>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { NotificationService } from '@/utils/NotificationService';

export default {
  name: 'LogoutButton',
  setup() {
    const store = useStore();
    const router = useRouter();
    const loading = ref(false);

    const handleLogout = async () => {
      loading.value = true;
      try {
        await store.dispatch('auth/logout');
        NotificationService.showSuccess('Logged out successfully');
        router.push('/auth/login');
      } catch (error) {
        NotificationService.handleAuthError(error);
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      handleLogout
    };
  }
};
</script>
