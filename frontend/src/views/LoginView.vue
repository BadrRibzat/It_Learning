<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">{{ $t("login.title") }}</h1>
    <form @submit.prevent="login">
      <BaseInput
        v-model="email"
        type="email"
        :placeholder="$t('login.email')"
        class="mb-4"
      />
      <BaseInput
        v-model="password"
        type="password"
        :placeholder="$t('login.password')"
        class="mb-4"
      />
      <BaseButton type="submit" :disabled="loading">
        {{ $t("login.submit") }}
      </BaseButton>
    </form>
    <p v-if="error" class="text-red-500 text-sm mt-4">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";

const store = useStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const login = async () => {
  loading.value = true;
  error.value = "";
  try {
    const response = await store.dispatch("auth/login", {
      email: email.value,
      password: password.value,
    });
    if (response) {
      router.push("/profile");
    }
  } catch (err) {
    error.value = err.response?.data?.detail || "An error occurred";
  } finally {
    loading.value = false;
  }
};
</script>
