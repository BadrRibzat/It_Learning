<template>
  <div class="page-container p-10">
    <h1 class="text-4xl font-bold text-center text-primary mb-8">
      Statistics
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white shadow-lg rounded-lg p-6 text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-2">Completed Flashcards</h3>
        <p class="text-3xl font-bold text-primary">{{ completedFlashcards }}</p>
      </div>
      <div class="bg-white shadow-lg rounded-lg p-6 text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-2">Completed Quizzes</h3>
        <p class="text-3xl font-bold text-primary">{{ completedQuizzes }}</p>
      </div>
      <div class="bg-white shadow-lg rounded-lg p-6 text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-2">Completed Lessons</h3>
        <p class="text-3xl font-bold text-primary">{{ completedLessons }}</p>
      </div>
      <div class="bg-white shadow-lg rounded-lg p-6 text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-2">Completed Levels</h3>
        <p class="text-3xl font-bold text-primary">{{ completedLevels }}</p>
      </div>
      <div class="bg-white shadow-lg rounded-lg p-6 text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-2">Level Tests Passed</h3>
        <p class="text-3xl font-bold text-primary">{{ levelTestsPassed }}</p>
      </div>
    </div>

    <!-- Bar Chart -->
    <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Progress Overview</h2>
      <Chart
        v-if="barChartData"
        type="bar"
        :data="barChartData"
        :options="barChartOptions"
      />
    </div>

    <!-- Pie Chart -->
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Lesson Completion</h2>
      <Chart
        v-if="pieChartData"
        type="pie"
        :data="pieChartData"
        :options="pieChartOptions"
      />
    </div>
  </div>
</template>

<script>
import Chart from "@/components/common/Chart.vue";
import { ref, onMounted } from "vue";

export default {
  name: "StatisticsView",
  components: {
    Chart,
  },
  setup() {
    const barChartData = ref(null);
    const pieChartData = ref(null);

    // Mock data for statistics
    const completedFlashcards = ref(50);
    const completedQuizzes = ref(10);
    const completedLessons = ref(5);
    const completedLevels = ref(1);
    const levelTestsPassed = ref(0);

    const barChartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    };

    const pieChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    };

    // Mock data for statistics
    const fetchStatistics = () => {
      barChartData.value = {
        labels: ["Beginner", "Intermediate", "Advanced"],
        datasets: [
          {
            label: "Progress (%)",
            data: [80, 50, 30], // Example data
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(255, 99, 132, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };

      pieChartData.value = {
        labels: ["Completed", "In Progress", "Not Started"],
        datasets: [
          {
            label: "Lessons",
            data: [40, 30, 30], // Example data
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(255, 99, 132, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };
    };

    onMounted(() => {
      fetchStatistics();
    });

    return {
      barChartData,
      pieChartData,
      barChartOptions,
      pieChartOptions,
      completedFlashcards,
      completedQuizzes,
      completedLessons,
      completedLevels,
      levelTestsPassed,
    };
  },
};
</script>

<style scoped>
.page-container {
  max-width: 600px;
  margin: 0 auto;
}
</style>
