<template>
  <div class="page-container p-10">
    <h1 class="text-4xl font-bold text-center text-primary mb-8">
      {{ level }} Level Test
    </h1>
    <div v-for="(question, index) in questions" :key="index" class="mb-6">
      <p class="text-lg font-semibold text-gray-800 mb-2">
        {{ question.text }}
      </p>
      <input
        v-model="userAnswers[index]"
        class="w-full p-2 border border-gray-300 rounded-lg"
        :placeholder="question.placeholder"
      />
    </div>
    <button
      @click="submitTest"
      class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Submit Test
    </button>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { progressState } from "@/utils/progress.js";

export default {
  name: "TestView",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const level = route.query.level || "intermediate";
    const questions = ref([
      {
        text: "What is the capital of France?",
        placeholder: "Enter your answer",
        correctAnswer: "Paris",
      },
      {
        text: "What is 2 + 2?",
        placeholder: "Enter your answer",
        correctAnswer: "4",
      },
    ]);
    const userAnswers = ref([]);

    const submitTest = () => {
      // Simulate test scoring
      let correctAnswers = 0;
      questions.value.forEach((question, index) => {
        if (userAnswers.value[index] === question.correctAnswer) {
          correctAnswers++;
        }
      });

      const score = (correctAnswers / questions.value.length) * 100;
      if (score >= 80) {
        if (level === "intermediate") {
          progressState.intermediatePassed = true;
        } else if (level === "advanced") {
          progressState.advancedPassed = true;
        }
        alert(`Congratulations! You passed with a score of ${score}%.`);
        router.push(`/profile/${level}`);
      } else {
        alert(`You failed with a score of ${score}%. Please try again.`);
        router.push("/profile/recommended");
      }
    };

    return {
      level,
      questions,
      userAnswers,
      submitTest,
    };
  },
};
</script>
