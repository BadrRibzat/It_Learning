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
              {{ statistics.level_progression.current_level }}
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
import { ref, onMounted, computed } from 'vue';
import Chart from 'chart.js/auto';
import ProgressCircle from './ProgressCircle.vue';

export default {
  name: 'StatisticsChart',
  components: {
    ProgressCircle
  },
  props: {
    statistics: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const lessonChart = ref(null);
    let chart = null;

    // Computed properties for progress circles
    const overallProgress = computed(() => {
      const flashcards = props.statistics.flashcard_progress;
      if (!flashcards.length) return 0;
      
      const total = flashcards.reduce((sum, lesson) => {
        return sum + (lesson.completed_flashcards / lesson.total_flashcards) * 100;
      }, 0);
      
      return Math.round(total / flashcards.length);
    });

    const flashcardProgress = computed(() => {
      const flashcards = props.statistics.flashcard_progress;
      if (!flashcards.length) return 0;
      
      const completed = flashcards.reduce((sum, lesson) => sum + lesson.completed_flashcards, 0);
      const total = flashcards.reduce((sum, lesson) => sum + lesson.total_flashcards, 0);
      
      return Math.round((completed / total) * 100);
    });

    const quizProgress = computed(() => {
      const flashcards = props.statistics.flashcard_progress;
      if (!flashcards.length) return 0;
      
      const unlockedQuizzes = flashcards.filter(lesson => lesson.quiz_unlocked).length;
      return Math.round((unlockedQuizzes / flashcards.length) * 100);
    });

    const levelProgress = computed(() => {
      // This would need to be calculated based on your level progression logic
      return 75; // Example value
    });

    const nextLevelLabel = computed(() => {
      const nextLevel = props.statistics.level_progression.next_level;
      return nextLevel || 'Max Level';
    });

    // Chart initialization
    const initChart = () => {
      const ctx = lessonChart.value.getContext('2d');
      
      const labels = props.statistics.flashcard_progress.map(lesson => 
        lesson.lesson_title.replace('Lesson ', 'L')
      );
      
      const completed = props.statistics.flashcard_progress.map(lesson =>
        lesson.completed_flashcards
      );
      
      const total = props.statistics.flashcard_progress.map(lesson =>
        lesson.total_flashcards
      );

      chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Completed',
              data: completed,
              backgroundColor: '#4F46E5',
              borderRadius: 4
            },
            {
              label: 'Total',
              data: total,
              backgroundColor: '#E5E7EB',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: false
              }
            },
            x: {
              grid: {
                display: false
              }
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

    onMounted(() => {
      initChart();
    });

    return {
      lessonChart,
      overallProgress,
      flashcardProgress,
      quizProgress,
      levelProgress,
      nextLevelLabel
    };
  }
};
</script>
