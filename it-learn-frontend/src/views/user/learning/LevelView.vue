<template>
  <div class="level-view">
    <h2>{{ currentLevel.name }} Level</h2>
    <p>{{ currentLevel.description }}</p>
    <button @click="startLearning">Start Learning</button>
    <LevelTestRedirect v-if="requiresTest" :testId="testId" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useLessonsStore } from '@/stores/lessons';
import LevelTestRedirect from '@/components/lessons/level/LevelTestRedirect.vue';

export default defineComponent({
  components: { LevelTestRedirect },
  props: ['levelId'],
  setup() {
    const lessonsStore = useLessonsStore();
    return { lessonsStore };
  },
  data() {
    return {
      currentLevel: null as any,
      requiresTest: false,
      testId: null as string | null,
    };
  },
  async mounted() {
    this.currentLevel = await this.lessonsStore.getCurrentLevel();
    const accessInfo = await this.lessonsStore.checkLevelAccess(this.levelId);
    this.requiresTest = accessInfo.requiresTest;
    this.testId = accessInfo.testId;
  },
  methods: {
    async startLearning() {
      if (this.requiresTest) {
        this.$router.push(`/levels/${this.levelId}/test`);
      } else {
        this.$router.push(`/levels/${this.levelId}/lessons`);
      }
    },
  },
});
</script>
