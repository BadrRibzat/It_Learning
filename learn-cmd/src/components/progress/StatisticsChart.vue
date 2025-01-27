<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
    
    <!-- Progress Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <ProgressCircle
        :progress="overallProgress"
        label="Overall Progress"
        color="#4F46E5"
      />
      <ProgressCircle
        :progress="flashcardProgress"
        label="Flashcards"
        color="#10B981"
      />
      <ProgressCircle
        :progress="quizProgress"
        label="Quizzes"
        color="#F59E0B"
      />
    </div>

    <!-- Lesson Progress Chart -->
    <div class="mt-8">
      <h4 class="text-md font-semibold text-gray-700 mb-4">Lesson Progress</h4>
      <div class="h-64">
        <canvas ref="lessonChart"></canvas>
      </div>
    </div>

    <!-- Level Progress -->
    <div class="mt-8">
      <h4 class="text-md font-semibold text-gray-700 mb-4">Level Progress</h4>
      <div class="relative pt-1">
        <div class="flex items-center justify-between mb-2">
          <div>
            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary-100">
              {{ currentLevel }}
            </span>
          </div>
          <div>
            <span class="text-xs font-semibold inline-block text-primary">
              {{ nextLevelLabel }}
            </span>
          </div>
        </div>
        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
          <div
            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
            :style="{ width: `${levelProgress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import Chart from 'chart.js/auto';
import ProgressCircle from './ProgressCircle.vue';

export default {
  name: 'StatisticsChart',
  components: {
    ProgressCircle
  },

  setup() {
    const store = useStore();
    const lessonChart = ref(null);
    let chart = null;

    // Computed values from store
    const statistics = computed(() => store.getters['profile/statistics']);
    const levelProgression = computed(() => store.getters['profile/levelProgression']);

    // Progress calculations
    const overallProgress = computed(() => {
      const flashcards = statistics.value?.flashcard_progress || [];
      if (!flashcards.length) return 0;
      
      const completed = flashcards.reduce((sum, lesson) => sum + lesson.completed_flashcards, 0);
      const total = flashcards.reduce((sum, lesson) => sum + lesson.total_flashcards, 0);
      return total > 0 ? Math.round((completed / total) * 100) : 0;
    });

    const flashcardProgress = computed(() => {
      const flashcards = statistics.value?.flashcard_progress || [];
      if (!flashcards.length) return 0;
      
      const completed = flashcards.reduce((sum, lesson) => sum + lesson.completed_flashcards, 0);
      const total = flashcards.reduce((sum, lesson) => sum + lesson.total_flashcards, 0);
      return total > 0 ? Math.round((completed / total) * 100) : 0;
    });

    const quizProgress = computed(() => {
      const flashcards = statistics.value?.flashcard_progress || [];
      if (!flashcards.length) return 0;
      
      const unlockedQuizzes = flashcards.filter(lesson => lesson.quiz_unlocked).length;
      return flashcards.length > 0 ? Math.round((unlockedQuizzes / flashcards.length) * 100) : 0;
    });

    const currentLevel = computed(() => 
      levelProgression.value?.current_level || 'Beginner'
    );

    const nextLevelLabel = computed(() => 
      levelProgression.value?.next_level || 'Max Level'
    );

    const levelProgress = computed(() => {
      const progression = levelProgression.value;
      if (!progression) return 0;
      return Math.round((progression.progress || 0) * 100);
    });

    // Chart initialization
    const initChart = () => {
      if (chart) {
        chart.destroy();
      }

      const ctx = lessonChart.value?.getContext('2d');
      if (!ctx) return;

      const flashcards = statistics.value?.flashcard_progress || [];
      
      chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: flashcards.map(lesson => lesson.lesson_title),
          datasets: [
            {
              label: 'Completed Flashcards',
              data: flashcards.map(lesson => lesson.completed_flashcards),
              backgroundColor: '#4F46E5'
            },
            {
              label: 'Total Flashcards',
              data: flashcards.map(lesson => lesson.total_flashcards),
              backgroundColor: '#E5E7EB'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: { display: false }
            },
            x: {
              grid: { display: false }
            }
          },
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      });
    };

    // Lifecycle hooks and watchers
    watch(() => statistics.value, () => {
      nextTick(() => {
        if (lessonChart.value) {
          initChart();
        }
      });
    }, { deep: true });

    onMounted(async () => {
      await store.dispatch('profile/fetchProfile');
      if (lessonChart.value) {
        initChart();
      }
    });

    onUnmounted(() => {
      if (chart) {
        chart.destroy();
      }
    });

    return {
      lessonChart,
      currentLevel,
      nextLevelLabel,
      levelProgress,
      overallProgress,
      flashcardProgress,
      quizProgress
    };
  }
};
</script>
