<template>
  <div class="flashcards-view">
    <HeaderComponent />
    <SidebarComponent />
    <FlashcardsComponent />
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
import FlashcardsComponent from '../components/FlashcardsComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';

export default {
  name: 'FlashcardsView',
  components: {
    HeaderComponent,
    SidebarComponent,
    FlashcardsComponent,
    FooterComponent,
  },
};
</script>

<style scoped>
.flashcards-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
