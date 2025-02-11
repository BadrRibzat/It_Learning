<template>
  <div 
    class="chart-container relative"
    :style="{ height: `${height || 300}px`, width: `${width || '100%'}` }"
  >
    <canvas 
      ref="chartRef"
      :aria-label="chartData.datasets[0]?.label || 'Chart'"
      role="img"
    />
    
    <div 
      v-if="!chartData.datasets[0]?.data.length"
      class="absolute inset-0 flex items-center justify-center bg-gray-50"
    >
      <p class="text-gray-500 text-sm">
        No data available
      </p>
    </div>

    <div class="chart-overlay absolute top-2 right-2 space-x-2">
      <slot name="controls" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import Chart from 'chart.js/auto';
import { useNotificationStore } from '@/stores/notification';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
}

interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  animation?: boolean;
  plugins?: Record<string, any>;
  scales?: Record<string, any>;
}

const props = defineProps<{
  chartData: ChartData;
  options?: ChartOptions;
  height?: number;
  width?: number;
  chartId?: string;
}>();

const emit = defineEmits<{
  (e: 'chart-click', value: any): void;
  (e: 'chart-hover', value: any): void;
  (e: 'chart-ready'): void;
}>();

const chartRef = ref<HTMLCanvasElement | null>(null);
const chart = ref<Chart | null>(null);
const notificationStore = useNotificationStore();

const defaultOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const initChart = () => {
  if (!chartRef.value) return;

  try {
    chart.value = new Chart(chartRef.value, {
      type: 'line',
      data: props.chartData,
      options: {
        ...defaultOptions,
        ...props.options,
        onClick: (event, elements) => {
          emit('chart-click', { event, elements });
        },
        onHover: (event, elements) => {
          emit('chart-hover', { event, elements });
        },
      },
    });

    chart.value.data = {
      chartId: props.chartId,
      dataPoints: props.chartData.datasets.reduce((acc, dataset) => acc + dataset.data.length, 0),
    };

    emit('chart-ready');
  } catch (error) {
    console.error('Chart initialization error:', error);
    notificationStore.error('Failed to initialize chart. Please try again.');
  }
};

const updateChart = () => {
  if (!chart.value) return;

  try {
    chart.value.data = props.chartData;
    chart.value.update('active');
  } catch (error) {
    console.error('Chart update error:', error);
    notificationStore.error('Failed to update chart data.');
  }
};

watch(() => props.chartData, updateChart, { deep: true });

watch(() => props.options, (newOptions) => {
  if (chart.value) {
    chart.value.options = { ...defaultOptions, ...newOptions };
    chart.value.update('none');
  }
}, { deep: true });

onMounted(() => {
  initChart();
});

onBeforeUnmount(() => {
  if (chart.value) {
    chart.value.destroy();
  }
});
</script>

<style scoped>
.chart-container {
  position: relative;
  margin: auto;
}

.chart-container canvas {
  max-width: 100%;
}

.chart-overlay {
  z-index: 1;
}

@media (max-width: 640px) {
  .chart-container {
    height: 200px !important;
  }
}

@keyframes chartFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.chart-container {
  animation: chartFadeIn 0.3s ease-out;
}
</style>
