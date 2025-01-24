<template>
  <div class="progress-circle">
    <svg width="100" height="100">
      <circle
        class="progress-circle-background"
        cx="50"
        cy="50"
        r="40"
        stroke-width="8"
      />
      <circle
        class="progress-circle-bar"
        cx="50"
        cy="50"
        r="40"
        stroke-width="8"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <div class="progress-text">{{ progress }}%</div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "ProgressCircle",
  props: {
    progress: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const circumference = computed(() => 2 * Math.PI * 40); // 2 * π * radius
    const dashOffset = computed(() => circumference.value * (1 - props.progress / 100));

    return {
      circumference,
      dashOffset,
    };
  },
};
</script>

<style scoped>
.progress-circle {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto;
}

.progress-circle-background {
  fill: none;
  stroke: #e0e0e0;
}

.progress-circle-bar {
  fill: none;
  stroke: #4caf50;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease-in-out;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  font-weight: bold;
  color: #4caf50;
}
</style>
