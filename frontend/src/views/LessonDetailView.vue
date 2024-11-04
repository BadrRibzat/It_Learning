<template>
  <div class="lesson-detail-view">
    <HeaderComponent />
    <SidebarComponent />
    <div v-if="currentLesson">
      <h1>{{ currentLesson.title }}</h1>
      <p>{{ currentLesson.content }}</p>
    </div>
    <div v-else>
      <p>Loading lesson details...</p>
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import HeaderComponent from '../components/HeaderComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';

export default {
  name: 'LessonDetailView',
  components: {
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
  },
  computed: {
    ...mapGetters(['currentLesson']),
  },
  methods: {
    ...mapActions(['fetchLesson']),
  },
  async created() {
    const lessonId = this.$route.params.id;
    await this.fetchLesson(lessonId);
  },
};
</script>

<style scoped>
.lesson-detail-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
