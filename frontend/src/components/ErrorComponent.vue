<template>
  <div class="error">
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: 'ErrorComponent',
  props: {
    errorMessage: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 0, 0, 0.5);
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}
</style>
