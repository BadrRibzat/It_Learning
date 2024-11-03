<template>
  <div class="lessons-view">
    <HeaderComponent />
    <SidebarComponent />
    <LessonsComponent />
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
import LessonsComponent from '../components/LessonsComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';

export default {
  name: 'LessonsView',
  components: {
    HeaderComponent,
    SidebarComponent,
    LessonsComponent,
    FooterComponent,
  },
};
</script>

<style scoped>
.lessons-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
