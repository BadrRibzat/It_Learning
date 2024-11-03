<template>
  <div class="dashboard-view">
    <HeaderComponent />
    <SidebarComponent />
    <DashboardComponent />
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
import DashboardComponent from '../components/DashboardComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';

export default {
  name: 'DashboardView',
  components: {
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    FooterComponent,
  },
};
</script>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
