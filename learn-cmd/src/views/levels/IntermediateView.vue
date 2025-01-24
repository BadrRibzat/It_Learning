<template>
  <div class="page-container p-10">
    <h1 class="text-4xl font-bold text-center text-primary mb-8">
      Intermediate
    </h1>
    <div v-if="progressState.intermediatePassed">
      <p class="text-center text-gray-600">
        Congratulations! You have passed the Intermediate Level Test.
      </p>
      <!-- Display Intermediate Lessons Here -->
      <div class="mt-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Intermediate Lessons</h2>
        <p class="text-gray-600">Lesson 1: ...</p>
        <p class="text-gray-600">Lesson 2: ...</p>
      </div>
    </div>
    <div v-else>
      <p class="text-center text-gray-600">
        You need to pass the Intermediate Level Test to access these lessons.
      </p>
      <router-link
        to="/profile/Test?level=intermediate"
        class="mt-4 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Take the Intermediate Level Test
      </router-link>
    </div>
  </div>
</template>

<script>
import { progressState } from "@/utils/progress.js";

export default {
  name: "IntermediateView",
  setup() {
    return {
      progressState,
    };
  },
};
</script>
