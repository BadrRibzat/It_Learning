<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          {{ lesson?.title }}
        </h2>
        <p class="text-gray-600 mt-1">
          Complete {{ progress?.total_flashcards || 10 }} flashcards to unlock the quiz
        </p>
      </div>
      
      <router-link
        :to="`/profile/lessons/${currentLevel}`"
        class="text-primary hover:text-primary-dark"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        Back to Lessons
      </router-link>
    </div>

    <!-- Progress Bar -->
    <div class="mb-6">
      <div class="flex justify-between text-sm text-gray-600 mb-1">
        <span>Progress</span>
        <span>
          {{ progress?.completed_flashcards || 0 }} / {{ progress?.total_flashcards || 10 }}
        </span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div
          class="bg-primary h-2.5 rounded-full transition-all duration-300"
          :style="{
            width: `${((progress?.completed_flashcards || 0) / (progress?.total_flashcards || 10)) * 100}%`
          }"
        ></div>
      </div>
    </div>

    <!-- Flashcard Content -->
    <div v-if="currentFlashcard" class="mb-6">
      <div
        class="relative bg-gray-50 rounded-lg p-6 transition-transform duration-500"
        :class="{ 'transform rotate-y-180': isFlipped }"
        @click="!answering && flipCard()"
      >
        <!-- Front Side -->
        <div v-show="!isFlipped" class="space-y-4">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ currentFlashcard.command }}
          </h3>
          <p class="text-gray-700">{{ currentFlashcard.question }}</p>
        </div>

        <!-- Back Side -->
        <div v-show="isFlipped" class="space-y-4">
          <div class="prose max-w-none">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              {{ currentFlashcard.command }}
            </h3>
            <div class="space-y-4">
              <div>
                <h4 class="font-semibold text-gray-700">Purpose:</h4>
                <p>{{ currentFlashcard.purpose }}</p>
              </div>
              
              <div>
                <h4 class="font-semibold text-gray-700">Common Usage:</h4>
                <ul class="list-disc pl-5">
                  <li v-for="(use, index) in currentFlashcard.usage" :key="index">
                    {{ use }}
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 class="font-semibold text-gray-700">Example:</h4>
                <div 
                  class="bg-gray-800 text-white p-3 rounded-md font-mono text-sm"
                  v-html="currentFlashcard.formatted_example"
                ></div>
              </div>
              
              <div v-if="currentFlashcard.warning" class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <i class="fas fa-exclamation-triangle text-yellow-400"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-yellow-700">
                      {{ currentFlashcard.warning }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Answer Input -->
    <div v-if="currentFlashcard && !isFlipped" class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Your Answer
      </label>
      <div class="flex space-x-2">
        <input
          v-model="userAnswer"
          type="text"
          class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          :disabled="answering"
          @keyup.enter="submitAnswer"
          placeholder="Type the command name..."
        />
        <button
          @click="submitAnswer"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
          :disabled="answering || !userAnswer.trim()"
        >
          {{ answering ? 'Checking...' : 'Submit' }}
        </button>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between">
      <button
        @click="skipCard"
        class="px-4 py-2 text-gray-600 hover:text-gray-800"
        :disabled="answering"
      >
        Skip
      </button>
      
      <button
        v-if="isFlipped"
        @click="nextCard"
        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
      >
        Next Card
      </button>
    </div>

    <!-- Quiz Unlock Notification -->
    <div
      v-if="progress?.quiz_unlocked"
      class="mt-6 p-4 bg-green-50 border border-green-200 rounded-md"
    >
      <p class="text-green-700">
        <i class="fas fa-unlock mr-2"></i>
        Congratulations! You've unlocked the quiz for this lesson.
      </p>
      <router-link
        :to="`/profile/lessons/${currentLevel}/quiz?lesson=${lessonId}`"
        class="mt-2 inline-block text-primary hover:text-primary-dark"
      >
        Take the Quiz →
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { NotificationService } from '@/utils/NotificationService';

export default {
  name: 'FlashcardsComponent',
  
  setup() {
    const store = useStore();
    const route = useRoute();
    
    const currentLevel = computed(() => route.params.level);
    const lessonId = computed(() => route.query.lesson);
    
    const lesson = ref(null);
    const currentFlashcard = ref(null);
    const progress = ref(null);
    const userAnswer = ref('');
    const isFlipped = ref(false);
    const answering = ref(false);

    const loadLesson = async () => {
      try {
        const response = await store.dispatch('lessons/getLesson', lessonId.value);
        lesson.value = response;
      } catch (error) {
        NotificationService.showError('Failed to load lesson');
      }
    };

    const loadFlashcard = async () => {
      try {
        const response = await store.dispatch('lessons/getNextFlashcard', {
          lessonId: lessonId.value
        });
        currentFlashcard.value = response;
        progress.value = response.progress;
        userAnswer.value = '';
        isFlipped.value = false;
      } catch (error) {
        NotificationService.showError('Failed to load flashcard');
      }
    };

    const submitAnswer = async () => {
      if (!userAnswer.value.trim() || answering.value) return;
      
      answering.value = true;
      try {
        const response = await store.dispatch('lessons/submitFlashcardAnswer', {
          lessonId: lessonId.value,
          flashcardId: currentFlashcard.value._id,
          userAnswer: userAnswer.value.trim(),
          expectedAnswer: currentFlashcard.value.command
        });

        progress.value = response.progress;
        
        if (response.correct) {
          NotificationService.showSuccess('Correct answer!');
        } else {
          NotificationService.showInfo('Not quite right. Review the explanation.');
        }
        
        isFlipped.value = true;
      } catch (error) {
        NotificationService.showError('Failed to submit answer');
      } finally {
        answering.value = false;
      }
    };

    const flipCard = () => {
      isFlipped.value = !isFlipped.value;
    };

    const skipCard = () => {
      loadFlashcard();
    };

    const nextCard = () => {
      loadFlashcard();
    };

    onMounted(async () => {
      await loadLesson();
      await loadFlashcard();
    });

    return {
      lesson,
      currentLevel,
      lessonId,
      currentFlashcard,
      progress,
      userAnswer,
      isFlipped,
      answering,
      submitAnswer,
      flipCard,
      skipCard,
      nextCard
    };
  }
};
</script>

<style scoped>
.rotate-y-180 {
  transform: rotateY(180deg);
}

.transform {
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.prose code {
  @apply text-sm;
}
</style>
