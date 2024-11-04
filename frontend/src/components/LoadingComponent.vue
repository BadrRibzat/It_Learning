<template>
  <div>
    <LoadingComponent v-if="loading" />
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        await this.someAction();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
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
