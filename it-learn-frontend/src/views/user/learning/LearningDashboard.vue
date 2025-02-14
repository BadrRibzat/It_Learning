<template>
  <div class="learning-dashboard">
    <h1>Learning Dashboard</h1>
    <LevelList @level-selected="onLevelSelected" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LevelList from '@/components/lessons/level/LevelList.vue';
import { useLessonsStore } from '@/stores/lessons';

export default defineComponent({
  components: { LevelList },
  setup() {
    const lessonsStore = useLessonsStore();
    return { lessonsStore };
  },
  methods: {
    async onLevelSelected(level: any) {
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
