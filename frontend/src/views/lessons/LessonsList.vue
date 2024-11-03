<template>
  <div class="lessons-list-view">
    <LessonsList :lessons="lessons" />
  </div>
</template>

<script>
import LessonsList from '../../components/lessons/LessonsList.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    LessonsList,
  },
  computed: {
    ...mapGetters('lessons', ['lessons']),
  },
  methods: {
    ...mapActions('lessons', ['fetchLessons']),
  },
  async created() {
    await this.fetchLessons();
  },
};
</script>

<style scoped>
.lessons-list-view {
  padding: 20px;
}
</style>
