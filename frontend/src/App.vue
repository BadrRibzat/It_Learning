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
        <option v-for="locale in supportedLocales" :key="locale" :value="locale">
          {{ locale }}
        </option>
      </select>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import i18n from "./i18n"; // Import your i18n instance

const store = useStore();
const isLoggedIn = computed(() => !!store.state.auth.user);

// Supported locales
const supportedLocales = [
  "en-US",
  "ar-SA",
  "fr-FR",
  "de-DE",
  "es-ES",
  "ja-JP",
  "ko-KR",
  "zh-CN"
];
const currentLocale = ref(i18n.global.locale); // Get the current locale from i18n

const changeLanguage = () => {
  i18n.global.locale = currentLocale.value; // Change the locale in i18n
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
