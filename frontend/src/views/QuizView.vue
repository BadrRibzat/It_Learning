<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">{{ $t("quiz.title") }}</h1>
    <div v-if="quizQuestions.length">
      <BaseCard
        v-for="question in quizQuestions"
        :key="question.id"
        class="mb-4"
      >
        <h2 class="text-xl font-bold">{{ question.question_text }}</h2>
        <ul>
          <li
            v-for="(option, index) in question.options"
            :key="index"
            class="mb-2"
          >
            <label>
              <input
                type="radio"
                :name="`question-${question.id}`"
                :value="option"
              />
              {{ option }}
            </label>
          </li>
        </ul>
      </BaseCard>
      <BaseButton @click="submitQuiz">{{ $t("quiz.submit") }}</BaseButton>
    </div>
    <p v-else>{{ $t("quiz.noQuestions") }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BaseCard from "@/components/base/BaseCard.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import api from "@/api";

const quizQuestions = ref([]);

onMounted(async () => {
  try {
    const response = await api.get("/quiz-questions/");
    quizQuestions.value = response.data;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
  }
});

const submitQuiz = () => {
  // Implement quiz submission logic
};
</script>
