<template>
  <div class="level-tests-view">
    <HeaderComponent />
    <SidebarComponent />
    <LevelTestsComponent />
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
import LevelTestsComponent from '../components/LevelTestsComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';

export default {
  name: 'LevelTestsView',
  components: {
    HeaderComponent,
    SidebarComponent,
    LevelTestsComponent,
    FooterComponent,
  },
};
</script>

<style scoped>
.level-tests-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
