<template>
  <div class="p-8">
    <section class="mb-12">
      <h1 class="text-4xl font-bold mb-4">{{ $t("home.title") }}</h1>
      <p class="text-lg mb-6">{{ $t("home.description") }}</p>
      <BaseButton @click="startLearning">{{ $t("home.startLearning") }}</BaseButton>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-bold mb-4">{{ $t("home.howItWorks") }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="(step, index) in learningSteps" :key="index" class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-2">{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </div>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-bold mb-4">{{ $t("home.flashcardDemo") }}</h2>
      <Flashcard :flashcard="demoFlashcard" @answer="handleDemoAnswer" />
      <p v-if="demoFeedback" class="mt-4" :class="{ 'text-green-600': demoFeedback === 'Correct!', 'text-red-600': demoFeedback === 'Incorrect. Try again!' }">
        {{ demoFeedback }}
      </p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import BaseButton from "@/components/base/BaseButton.vue";
import Flashcard from "@/components/Flashcard.vue";

const router = useRouter();
const { t } = useI18n();

const startLearning = () => {
  router.push("/levels");
};

const learningSteps = computed(() => [
  { title: t("home.step1Title"), description: t("home.step1Description") },
  { title: t("home.step2Title"), description: t("home.step2Description") },
  { title: t("home.step3Title"), description: t("home.step3Description") },
]);

const demoFlashcard = {
  id: "demo",
  word: "Hello",
  definition: "A common greeting",
  question: "What do you say to greet someone?",
};

const demoFeedback = ref("");

const handleDemoAnswer = ({ userAnswer }) => {
  if (userAnswer.toLowerCase() === "hello") {
    demoFeedback.value = "Correct!";
  } else {
    demoFeedback.value = "Incorrect. Try again!";
  }
};
</script>
