<template>
  <div class="modal-overlay" v-if="showModal">
    <div class="modal-content">
      <h3>Level Test</h3>
      <p>Passing Score: {{ test.passing_score * 100 }}%</p>
      <button @click="startTest">Start Test</button>
      <button @click="closeModal">Cancel</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useLessonsStore } from '@/stores/lessons';

export default defineComponent({
  props: {
    levelId: {
      type: String,
      required: true,
    },
  },
  setup() {
    const lessonsStore = useLessonsStore();
    return { lessonsStore };
  },
  data() {
    return {
      showModal: false,
      test: null as any,
    };
  },
  async mounted() {
    this.test = await this.lessonsStore.getLevelTest(this.levelId);
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    startTest() {
      this.closeModal();
      this.$router.push(`/levels/${this.levelId}/test`);
    },
  },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
}
</style>
