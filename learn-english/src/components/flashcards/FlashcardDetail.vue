<template>
  <div class="flashcard-detail w-full">
    <!-- Flashcards Content -->
    <div v-if="flashcards.length > 0 && !quizTime">
      <div
        @click="handleCardClick"
        class="card relative h-80 cursor-pointer perspective-1000"
      >
        <div
          class="card-inner w-full h-full transition-transform duration-500"
          :class="{ 'rotate-y-180': isFlipped }"
        >
          <!-- Front face -->
          <div class="card-face front absolute w-full h-full bg-white rounded-lg shadow-lg p-8">
            <div class="flex flex-col items-center justify-center h-full">
              <h3 class="text-3xl font-bold text-primary mb-6">
                {{ currentFlashcard.word }}
              </h3>
              <p class="text-xl text-gray-600 text-center">
                {{ currentFlashcard.definition }}
              </p>
            </div>
          </div>

          <!-- Back face -->
          <div class="card-face back absolute w-full h-full bg-white rounded-lg shadow-lg p-8 rotate-y-180">
            <div class="flex flex-col items-center justify-center h-full">
              <h3 class="text-2xl font-bold text-primary mb-4">Fill in the blank:</h3>
              <p class="text-xl text-gray-600 mb-6 text-center">
                {{ currentFlashcard.question }}
              </p>
              <input
                v-model="userAnswer"
                type="text"
                placeholder="Type your answer here"
                @click.stop
                class="w-full border-2 border-gray-300 rounded-lg px-4 py-2 mb-4 text-lg focus:border-primary focus:outline-none"
              />
              <button
                @click.stop="submitAnswer"
                class="bg-primary text-white px-6 py-2 rounded-lg text-lg hover:bg-primary-dark transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Feedback section -->
      <div v-if="feedback" class="mt-6 text-center">
        <p class="text-lg mb-4" :class="feedback.isCorrect ? 'text-green-600' : 'text-red-600'">
          {{ feedback.message }}
        </p>
        <button
          v-if="feedback.isCorrect"
          @click="nextCard"
          class="bg-primary text-white px-6 py-2 rounded-lg text-lg hover:bg-primary-dark transition-colors"
        >
          Next Card
        </button>
        <button
          v-else
          @click="retry"
          class="bg-primary text-white px-6 py-2 rounded-lg text-lg hover:bg-primary-dark transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Quiz Time -->
    <QuizForm v-else-if="quizTime" :lessonId="currentLessonId" :lessonTitle="currentLessonTitle" />

    <!-- No Flashcards State -->
    <div v-else class="text-center text-gray-600">
      <p>No flashcards available.</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { useRouter } from 'vue-router';
import { progressState } from "@/utils/progress";
import { NotificationService } from "@/utils/NotificationService";
import QuizForm from "@/components/quizzes/QuizForm.vue";

export default {
  name: "FlashcardDetail",
  components: {
    QuizForm,
  },
  setup() {
    const router = useRouter();
    const isFlipped = ref(false);
    const userAnswer = ref("");
    const feedback = ref(null);
    const quizTime = ref(false);
    const currentLessonId = ref(1); // Mock current lesson ID
    const currentLessonTitle = ref("Beginner Lesson 1"); // Mock current lesson title

    // Mock flashcards data (associate with a lesson ID)
    const flashcardsData = {
      1: [ // Flashcards for lesson ID 1
        {
          word: "Example",
          definition: "A representative instance or pattern.",
          question: 'What is a synonym for "example"?',
          answer: "instance",
        },
        {
          word: "Hello",
          definition: "Used as a greeting or to begin a phone conversation.",
          question: "How do you greet someone?",
          answer: "hello",
        },
      ],
      2: [ // Flashcards for lesson ID 2
        {
          word: "Learn",
          definition: "To gain knowledge or skill by studying, practicing, being taught, or experiencing something.",
          question: "What do you do to acquire knowledge?",
          answer: "learn",
        },
        {
          word: "English",
          definition: "The language of England, also widely used in many other countries.",
          question: "What language are we studying?",
          answer: "english",
        },
      ],
    };

    const flashcards = reactive(flashcardsData[currentLessonId.value] || []);
    const currentFlashcardIndex = ref(0);
    const currentFlashcard = computed(() => flashcards[currentFlashcardIndex.value]);

    const flipCard = () => {
      isFlipped.value = !isFlipped.value;
      feedback.value = null; // Reset feedback when flipping
    };

    const submitAnswer = () => {
      if (!userAnswer.value.trim()) {
        NotificationService.showError("Please enter an answer.");
        return;
      }

      if (userAnswer.value.toLowerCase() === currentFlashcard.value.answer.toLowerCase()) {
        feedback.value = {
          isCorrect: true,
          message: "Correct! Great job!",
        };
        progressState.incrementProgress(); // Update progress
        NotificationService.showSuccess("+1 point! Progress updated.");
      } else {
        feedback.value = {
          isCorrect: false,
          message: "Incorrect. Try again or flip the card to see the answer.",
        };
        NotificationService.showError("Incorrect answer. Try again!");
      }
    };

    const nextCard = () => {
      if (currentFlashcardIndex.value < flashcards.length - 1) {
        currentFlashcardIndex.value++;
        userAnswer.value = "";
        isFlipped.value = false;
        feedback.value = null;
      } else {
        // Flashcards for the lesson are completed, move to the quiz
        quizTime.value = true;
        feedback.value = null; // Clear any previous feedback
        NotificationService.showInfo("You've completed the flashcards! Time for a quiz.");
      }
    };

    const retry = () => {
      isFlipped.value = false;
      userAnswer.value = "";
    };

    const handleCardClick = (event) => {
      if (!event.target.closest("button") && !event.target.closest("input")) {
        flipCard();
      }
    };

    return {
      isFlipped,
      userAnswer,
      feedback,
      flashcards,
      currentFlashcard,
      currentFlashcardIndex,
      flipCard,
      submitAnswer,
      nextCard,
      retry,
      handleCardClick,
      quizTime,
      currentLessonId,
      currentLessonTitle,
    };
  },
};
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.card-inner {
  position: relative;
  transform-style: preserve-3d;
}

.card-face {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.back {
  transform: rotateY(180deg);
}
</style>
