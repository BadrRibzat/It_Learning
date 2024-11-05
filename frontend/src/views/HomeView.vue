<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">{{ $t("home.title") }}</h1>
    <p class="text-lg mb-6">{{ $t("home.description") }}</p>
    <BaseButton @click="startLearning">{{
      $t("home.startLearning")
    }}</BaseButton>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import BaseButton from "@/components/base/BaseButton.vue";

const router = useRouter();

const startLearning = () => {
  router.push("/lessons");
};
</script>
