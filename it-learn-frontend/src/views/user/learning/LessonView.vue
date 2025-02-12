<template>
  <div class="lesson-view space-y-8" v-if="currentLesson">
    <div v-if="loading" class="flex justify-center items-center py-12">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
      <button 
        @click="initializeLesson" 
        class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Retry
      </button>
    </div>

    <template v-else>
      <!-- Lesson Header -->
      <LessonHeader
        :lesson="currentLesson"
        :level-id="levelId"
      />

      <!-- Lesson Content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-8">
          <router-view></router-view>
        </div>

        <div class="lg:col-span-4 space-y-6">
          <LessonContent
            :current-step="currentStep"
            :total-steps="totalSteps"
            :can-navigate="canNavigate"
            :is-active="isActive"
            @previous="handlePrevious"
            @next="handleNext"
            @time-update="handleTimeUpdate"
          />
          
          <QuickStat
            title="Progress"
            label="Lesson Progress"
            :value="currentStep"
            :total="totalSteps"
            icon="ChartBarIcon"
          />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Next Steps</h3>
        <div class="space-y-4">
          <template v-if="currentLesson?.progress.quiz_unlocked">
            <p class="text-sm text-gray-600">
              You've unlocked the lesson quiz!
            </p>
            <button
              @click="startQuiz"
              class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Take Quiz
            </button>
          </template>
          <template v-else>
            <p class="text-sm text-gray-600">
              Complete more flashcards to unlock the quiz
            </p>
            <ProgressBar
              :value="currentLesson?.progress.completed_flashcards || 0"
              :max="currentLesson?.progress.total_flashcards || 10"
            />
          </template>
        </div>
      </div>
    </template>

    <!-- Debug Information -->
    <div v-if="isDevelopment" class="mt-8">
      <LearningDebugComponent :debug-data="debugData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useLessonsStore } from '@/stores/lessons';
import { useToast } from 'vue-toastification';
import {
  ClipboardListIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import LessonHeader from '@/components/lessons/common/LessonHeader.vue';
import LessonContent from '@/components/lessons/common/LessonContent.vue';
import LearningDebugComponent from './LearningDebugComponent.vue';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const lessonsStore = useLessonsStore();

const loading = ref(true);
const error = ref<string | null>(null);
const currentStep = ref(1);
const isActive = ref(true);

const isDevelopment = computed(() => import.meta.env.MODE === 'development');
const levelId = computed(() => route.params.levelId as string);
const lessonId = computed(() => route.params.lessonId as string);
const currentLesson = computed(() => lessonsStore.currentLesson);
const totalSteps = computed(() => currentLesson.value?.progress.total_flashcards || 10);
const canNavigate = computed(() => route.name === 'flashcards');

const debugData = computed(() => ({
  levelId: levelId.value,
  lessonId: lessonId.value,
  currentLesson: currentLesson.value,
  currentStep: currentStep.value,
  totalSteps: totalSteps.value,
  isActive: isActive.value,
  storeState: {
    loading: lessonsStore.loading,
    error: lessonsStore.error
  }
}));

const initializeLesson = async () => {
  try {
    loading.value = true;
    error.value = null;

    await lessonsStore.fetchLessons(levelId.value);
    const lesson = lessonsStore.lessons.find(l => l.id === lessonId.value);

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    await lessonsStore.setCurrentLesson(lesson);
    currentStep.value = lesson.progress.completed_flashcards + 1;

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load lesson';
    toast.error('Failed to load lesson');
  } finally {
    loading.value = false;
  }
};

const handlePrevious = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleNext = () => {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++;
  }
};

const handleTimeUpdate = (time: number) => {
  // Handle time tracking logic here
  console.log('Learning time:', time);
};

const startQuiz = () => {
  router.push({
    name: 'quiz',
    params: {
      levelId: levelId.value,
      lessonId: lessonId.value
    }
  });
};

onMounted(() => {
  initializeLesson();
});
</script>