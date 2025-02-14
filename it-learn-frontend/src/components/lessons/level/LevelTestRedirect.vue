<template>
  <div class="modal-overlay" v-if="showModal">
    <div class="modal-content">
      <h4>Level Test Required</h4>
      <p>You must pass the level test to access more content.</p>
      <button @click="startTest">Take Test</button>
      <button @click="closeModal">Cancel</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      showModal: false,
    };
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
  padding: 16px;
  border-radius: 8px;
}
</style>
