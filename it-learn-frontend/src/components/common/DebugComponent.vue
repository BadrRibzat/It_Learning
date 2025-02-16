<template>
  <div class="debug-component bg-gray-100 p-4 rounded-md">
    <h3 class="text-lg font-medium text-gray-800 mb-4">Debug Information</h3>
    <pre class="text-sm text-gray-700">{{ formattedDebugInfo }}</pre>
    <pre v-if="profile">Profile Data: {{ formattedProfile }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import type { Level, Lesson, StoreState, ProfileResponse } from '@/types/lessons';

export default defineComponent({
  props: {
    level: {
      type: Object as PropType<Level>,
      required: true,
    },
    lessons: {
      type: Array as PropType<Lesson[]>,
      required: true,
    },
    storeState: {
      type: Object as PropType<StoreState>,
      required: true,
    },
    profile: {
      type: Object as PropType<ProfileResponse | null>,
      required: false,
    },
  },
  setup(props) {
    const formattedDebugInfo = computed(() => ({
      level: JSON.stringify(props.level, null, 2),
      lessons: JSON.stringify(props.lessons, null, 2),
      storeState: JSON.stringify(props.storeState, null, 2),
    }));

    const formattedProfile = computed(() => {
      if (props.profile) {
        return JSON.stringify(props.profile, null, 2);
      }
      return 'No profile data available.';
    });

    return { formattedDebugInfo, formattedProfile };
  },
});
</script>

<style scoped>
.debug-component {
  max-height: 400px;
  overflow-y: auto;
}
</style>
