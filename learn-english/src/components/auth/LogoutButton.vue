<template>
  <button
    @click="logout"
    class="text-gray-600 hover:text-primary transition-colors"
  >
    <i class="fas fa-sign-out-alt mr-2"></i>
    Logout
  </button>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { NotificationService } from '@/utils/NotificationService';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const logout = async () => {
      try {
        await store.dispatch('auth/logout');
        NotificationService.showSuccess('Logout successful!');
        router.push('/auth/login');
      } catch (error) {
        NotificationService.handleAuthError(error);
      }
    };

    return { logout };
  },
};
</script>
