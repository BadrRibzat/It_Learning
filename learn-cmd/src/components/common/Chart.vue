<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "ChartComponent",
  props: {
    type: {
      type: String,
      default: "bar", // Default chart type
    },
    data: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    const renderChart = () => {
      if (chartCanvas.value) {
        if (chartInstance) {
          chartInstance.destroy(); // Destroy existing chart before rendering a new one
        }
        chartInstance = new Chart(chartCanvas.value, {
          type: props.type,
          data: props.data,
          options: props.options,
        });
      }
    };

    onMounted(() => {
      renderChart();
    });

    onBeforeUnmount(() => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    });

    // Watch for changes in props.data and re-render the chart
    watch(
      () => props.data,
      () => {
        renderChart();
      },
      { deep: true }
    );

    return {
      chartCanvas,
    };
  },
};
</script>

<style scoped>
.chart-container {
  width: 70%;
  max-width: 600px;
  margin: 0 auto;
}
</style>
