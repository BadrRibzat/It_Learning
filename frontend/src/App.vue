<template>
  <div id="app">
    <nav>
      <router-link to="/">{{ $t("nav.home") }}</router-link> |
      <router-link to="/login">{{ $t("nav.login") }}</router-link> |
      <router-link to="/register">{{ $t("nav.register") }}</router-link> |
      <router-link to="/lessons">{{ $t("nav.lessons") }}</router-link> |
      <router-link to="/flashcards">{{ $t("nav.flashcards") }}</router-link> |
      <router-link to="/quiz">{{ $t("nav.quiz") }}</router-link> |
      <router-link to="/profile">{{ $t("nav.profile") }}</router-link> |
      <button v-if="isLoggedIn" @click="logout">{{ $t("nav.logout") }}</button>
      
      <!-- Language Switcher -->
      <select v-model="currentLocale" @change="changeLanguage">
        <option v-for="locale in supportedLocales" :key="locale.code" :value="locale.code">
          {{ locale.name }}
        </option>
      </select>
    </nav>
    <router-view />
    <ChatbotWidget />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import ChatbotWidget from "@/components/ChatbotWidget.vue";

const store = useStore();
const { locale } = useI18n();
const isLoggedIn = computed(() => !!store.state.auth.user);

// Supported locales
const supportedLocales = [
  { code: "en-US", name: "English" },
  { code: "ar-SA", name: "العربية" },
  { code: "fr-FR", name: "Français" },
  { code: "de-DE", name: "Deutsch" },
  { code: "es-ES", name: "Español" },
  { code: "ja-JP", name: "日本語" },
  { code: "ko-KR", name: "한국어" },
  { code: "zh-CN", name: "中文" },
];
const currentLocale = ref(locale.value);

const changeLanguage = () => {
  locale.value = currentLocale.value;
};

const logout = async () => {
  await store.dispatch("auth/logout");
};
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
