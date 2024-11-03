<template>
  <div class="profile-view">
    <HeaderComponent />
    <SidebarComponent />
    <ProfileComponent />
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
import ProfileComponent from '../components/ProfileComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';

export default {
  name: 'ProfileView',
  components: {
    HeaderComponent,
    SidebarComponent,
    ProfileComponent,
    FooterComponent,
  },
};
</script>

<style scoped>
.profile-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
