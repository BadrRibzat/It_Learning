<template>
  <canvas ref="chartRef"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps<{
  chartData: any;
  options: any;
}>();

const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

onMounted(() => {
  if (chartRef.value) {
    chart = new Chart(chartRef.value, {
      type: 'line',
      data: props.chartData,
      options: props.options
    });
  }
});

watch(() => props.chartData, (newData) => {
  if (chart) {
    chart.data = newData;
    chart.update();
  }
}, { deep: true });

watch(() => props.options, (newOptions) => {
  if (chart) {
    chart.options = newOptions;
    chart.update();
  }
}, { deep: true });
</script>
