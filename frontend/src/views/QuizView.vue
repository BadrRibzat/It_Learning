<template>
  <div class="quizzes-view">
    <HeaderComponent />
    <SidebarComponent />
    <QuizzesComponent />
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
import QuizzesComponent from '../components/QuizzesComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';

export default {
  name: 'QuizzesView',
  components: {
    HeaderComponent,
    SidebarComponent,
    QuizzesComponent,
    FooterComponent,
  },
};
</script>

<style scoped>
.quizzes-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
