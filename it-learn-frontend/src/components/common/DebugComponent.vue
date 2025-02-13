<template>
  <div class="debug-component bg-gray-100 p-4 rounded-md">
    <h3 class="text-lg font-medium text-gray-800 mb-4">Debug Information</h3>
    <pre class="text-sm text-gray-700">{{ debugInfo }}</pre>
  </div>
</template>

const { level, lessons, storeState } = defineProps({
  level: {
    type: Object,
    required: true,
  },
  lessons: {
    type: Array,
    required: true,
  },
  storeState: {
    type: Object,
    required: true,
  },
});

const debugInfo = computed(() => ({
  level: JSON.stringify(level, null, 2),
  lessons: JSON.stringify(lessons, null, 2),
  storeState: JSON.stringify(storeState, null, 2),
  profile: profileStore.profile,
  loading: profileStore.loading,
}));
</script>

<style scoped>
.debug-component {
  max-height: 400px;
  overflow-y: auto;
}
</style>
