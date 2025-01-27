<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Header :key="isAuthenticated" />
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    <Footer />
    <Notification
      v-if="notificationState.show"
      :message="notificationState.message"
      :type="notificationState.type"
      :duration="notificationState.duration"
      :position="notificationState.position"
    />
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue';
import Footer from '@/components/common/Footer.vue';
import Notification from '@/components/common/Notification.vue';
import { notificationState } from '@/utils/NotificationService.js';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    Notification,
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
  },
  setup() {
    return {
      notificationState,
    };
  },
};
</script>
