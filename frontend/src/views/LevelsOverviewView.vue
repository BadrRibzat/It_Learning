<template>
  <div class="levels-overview-view">
    <HeaderComponent />
    <SidebarComponent />
    <LevelsComponent />
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
import LevelsComponent from '../components/LevelsComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';

export default {
  name: 'LevelsOverviewView',
  components: {
    HeaderComponent,
    SidebarComponent,
    LevelsComponent,
    FooterComponent,
  },
};
</script>

<style scoped>
.levels-overview-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
