<template>
  <div class="min-h-screen bg-gray-50">
    <ProfileComponent />
  </div>
</template>

<script>
import ProfileComponent from '@/components/profile/ProfileComponent.vue';

export default {
  name: 'ProfileView',
  components: {
    ProfileComponent
  }
};
</script>
