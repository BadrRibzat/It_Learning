<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">{{ $t("profile.title") }}</h1>
    <BaseCard v-if="user">
      <h2 class="text-xl font-bold">{{ user.email }}</h2>
      <p>{{ $t("profile.welcomeMessage") }}</p>
    </BaseCard>
    <p v-else>Loading user profile...</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import BaseCard from "@/components/base/BaseCard.vue";

const store = useStore();

const user = computed(() => store.state.auth.user);

onMounted(async () => {
  await store.dispatch("auth/fetchUserProfile");
});
</script>
