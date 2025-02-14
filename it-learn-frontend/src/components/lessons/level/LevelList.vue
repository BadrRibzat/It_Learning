<template>
  <div class="level-list">
    <LevelCard 
      v-for="level in levels" 
      :key="level.id" 
      :level="level" 
      @start-learning="onStartLearning(level)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LevelCard from './LevelCard.vue';
import { useLessonsStore } from '@/stores/lessons';

export default defineComponent({
  components: { LevelCard },
  setup() {
    const lessonsStore = useLessonsStore();
    return { lessonsStore };
  },
  data() {
    return {
      levels: [] as any[],
    };
  },
  async mounted() {
    this.levels = await this.lessonsStore.getLevels();
  },
  methods: {
    async onStartLearning(level: any) {
      const redirectToTest = await this.lessonsStore.redirectToLevelTest(level.id);
      if (redirectToTest) {
          this.$router.push(redirectToTest);
      } else {
          this.$router.push(`/levels/${level.id}/lessons`);
      }
    },
  },
});
</script>
