<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Flashcards Practice</h2>
      <p class="text-gray-600">
        Complete {{ progress?.total_flashcards || 10 }} flashcards to unlock the quiz
      </p>
    </div>

    <!-- Progress Bar -->
    <div class="mb-6">
      <div class="flex justify-between text-sm text-gray-600 mb-1">
        <span>Progress</span>
        <span>{{ progress?.completed_flashcards || 0 }} / {{ progress?.total_flashcards || 10 }}</span>
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

    <!-- Flashcard Display -->
    <div v-if="currentFlashcard" class="mb-6">
      <div
        class="bg-gray-50 rounded-lg p-6 cursor-pointer"
        :class="{ 'flip': isFlipped }"
        @click="flipCard"
      >
        <div class="front" v-if="!isFlipped">
          <h3 class="text-xl font-semibold mb-4">{{ currentFlashcard.command }}</h3>
          <p class="text-gray-700">{{ currentFlashcard.question }}</p>
        </div>
        <div class="back" v-else>
          <h3 class="text-xl font-semibold mb-4">Answer</h3>
          <p class="text-gray-700" v-html="currentFlashcard.explanation"></p>
          <div class="mt-4 p-4 bg-gray-100 rounded">
            <code v-html="currentFlashcard.formatted_example"></code>
          </div>
        </div>
      </div>
    </div>

    <!-- Answer Input -->
    <div v-if="currentFlashcard && !isFlipped" class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Your Answer
      </label>
      <input
        v-model="userAnswer"
        type="text"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        :disabled="answering"
        @keyup.enter="submitAnswer"
      />
    </div>

    <!-- Actions -->
    <div class="flex justify-between">
      <button
        @click="skipCard"
        class="px-4 py-2 text-gray-600 hover:text-gray-800"
        :disabled="answering"
      >
        Skip
      </button>
      <button
        v-if="!isFlipped"
        @click="submitAnswer"
        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        :disabled="answering || !userAnswer"
      >
        {{ answering ? 'Checking...' : 'Submit' }}
      </button>
      <button
        v-else
        @click="nextCard"
        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
        :to="`/lessons/${currentLevel}/quizzes`"
        class="mt-2 inline-block text-primary hover:text-primary-dark"
      >
        Take the Quiz →
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { NotificationService } from '@/utils/NotificationService';

export default {
  name: 'FlashcardsComponent',
  
  setup() {
    const store = useStore();
    const route = useRoute();
    const currentFlashcard = ref(null);
    const userAnswer = ref('');
    const isFlipped = ref(false);
    const answering = ref(false);
    const progress = ref(null);
    const currentLevel = route.params.level;

    const loadFlashcard = async () => {
      try {
        // This would need to be implemented in your store
        const response = await store.dispatch('lessons/getNextFlashcard', {
          level: currentLevel
        });
        currentFlashcard.value = response;
        userAnswer.value = '';
        isFlipped.value = false;
      } catch (error) {
        NotificationService.showError('Failed to load flashcard');
      }
    };

    const submitAnswer = async () => {
      if (!userAnswer.value) return;
      
      answering.value = true;
      try {
        const response = await store.dispatch('lessons/submitFlashcardAnswer', {
          lessonId: currentFlashcard.value.lesson,
          flashcardId: currentFlashcard.value._id,
          userAnswer: userAnswer.value,
          expectedAnswer: currentFlashcard.value.answer
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

    onMounted(() => {
      loadFlashcard();
    });

    return {
      currentFlashcard,
      userAnswer,
      isFlipped,
      answering,
      progress,
      currentLevel,
      submitAnswer,
      flipCard,
      skipCard,
      nextCard
    };
  }
};
</script>

<style scoped>
.flip {
  transform: rotateY(180deg);
}

.front, .back {
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.back {
  transform: rotateY(180deg);
}
</style>
