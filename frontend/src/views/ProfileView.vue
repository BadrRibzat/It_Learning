<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">{{ $t("profile.title") }}</h1>
    <BaseCard v-if="user">
      <h2 class="text-xl font-bold">{{ user.email }}</h2>
      <p>{{ $t("profile.welcomeMessage") }}</p>
      <p>{{ $t("profile.level", { level: user.level }) }}</p>
      <p>{{ $t("profile.points", { points: user.points }) }}</p>
    </BaseCard>
    <p v-else>{{ $t("profile.loading") }}</p>

    <NotesManager class="mt-8" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import BaseCard from "@/components/base/BaseCard.vue";
import NotesManager from "@/components/NotesManager.vue";
import { key } from "@/store";

const store = useStore(key);

const user = computed(() => store.state.auth.user);

onMounted(async () => {
  await store.dispatch("auth/fetchUserProfile");
});
</script>
