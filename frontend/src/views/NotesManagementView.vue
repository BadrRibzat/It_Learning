<template>
  <div class="notes-management-view">
    <HeaderComponent />
    <SidebarComponent />
    <NotesManagementComponent />
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
import NotesManagementComponent from '../components/NotesManagementComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';

export default {
  name: 'NotesManagementView',
  components: {
    HeaderComponent,
    SidebarComponent,
    NotesManagementComponent,
    FooterComponent,
  },
};
</script>

<style scoped>
.notes-management-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
