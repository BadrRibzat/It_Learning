<template>
  <div class="relative">
    <svg class="progress-ring" :width="size" :height="size">
      <circle
        class="progress-ring__circle-bg"
        :stroke-width="strokeWidth"
        :r="radius"
        :cx="center"
        :cy="center"
        fill="transparent"
        stroke="#e5e7eb"
      />
      <circle
        class="progress-ring__circle"
        :stroke-width="strokeWidth"
        :r="radius"
        :cx="center"
        :cy="center"
        fill="transparent"
        :stroke="color"
        :style="progressStyle"
      />
    </svg>
    <div 
      class="absolute inset-0 flex flex-col items-center justify-center text-center"
      :style="{ fontSize: `${size * 0.2}px` }"
    >
      <span class="font-bold">{{ percentage }}%</span>
      <span class="text-sm text-gray-600">{{ label }}</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ProgressCircle',
  props: {
    progress: {
      type: Number,
      required: true,
      validator: value => value >= 0 && value <= 100
    },
    size: {
      type: Number,
      default: 120
    },
    color: {
      type: String,
      default: '#4F46E5' // primary color
    },
    label: {
      type: String,
      default: 'Progress'
    }
  },
  setup(props) {
    const strokeWidth = computed(() => props.size * 0.1);
    const radius = computed(() => (props.size - strokeWidth.value) / 2);
    const center = computed(() => props.size / 2);
    const circumference = computed(() => 2 * Math.PI * radius.value);
    const percentage = computed(() => Math.round(props.progress));
    
    const progressStyle = computed(() => {
      const offset = circumference.value - (props.progress / 100) * circumference.value;
      return {
        strokeDasharray: `${circumference.value} ${circumference.value}`,
        strokeDashoffset: offset,
        transform: 'rotate(-90deg)',
        transformOrigin: '50% 50%'
      };
    });

    return {
      strokeWidth,
      radius,
      center,
      percentage,
      progressStyle
    };
  }
};
</script>

<style scoped>
.progress-ring__circle {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
</style>
