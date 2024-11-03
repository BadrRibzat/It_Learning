<template>
  <div class="loading">
    <p>Loading...</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingComponent',
};
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}
</style>
