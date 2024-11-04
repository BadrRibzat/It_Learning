<template>
  <div class="lesson-detail-view">
    <HeaderComponent />
    <SidebarComponent />
    <div class="lesson-content" v-if="currentLesson">
      <h1>{{ currentLesson.title }}</h1>
      <div v-html="currentLesson.content"></div>
      <button @click="completeLesson" :disabled="lessonCompleted">
        {{ lessonCompleted ? 'Lesson Completed' : 'Mark as Completed' }}
      </button>
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
    ...mapGetters(['currentLesson', 'userProgress']),
    lessonCompleted() {
      return this.userProgress.some(progress => 
        progress.lesson === this.currentLesson.id && progress.completed
      );
    },
  },
  methods: {
    ...mapActions(['fetchLesson', 'fetchUserProgress', 'updateLessonProgress']),
    async completeLesson() {
      try {
        await this.updateLessonProgress({
          lessonId: this.currentLesson.id,
          completed: true,
        });
        alert('Lesson marked as completed!');
      } catch (error) {
        console.error('Failed to mark lesson as completed:', error);
        alert('Failed to mark lesson as completed. Please try again.');
      }
    },
  },
  async created() {
    const lessonId = this.$route.params.id;
    await this.fetchLesson(lessonId);
    await this.fetchUserProgress();
  },
};
</script>

<style scoped>
.lesson-detail-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.lesson-content {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #35495e;
}
</style>
