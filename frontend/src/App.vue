<template>
  <div id="app">
    <nav>
      <router-link to="/">{{ $t("nav.home") }}</router-link> |
      <router-link v-if="!isLoggedIn" to="/login">{{
        $t("nav.login")
      }}</router-link>
      |
      <router-link v-if="!isLoggedIn" to="/register">{{
        $t("nav.register")
      }}</router-link>
      |
      <router-link v-if="isLoggedIn" to="/levels">{{
        $t("nav.levels")
      }}</router-link>
      |
      <router-link v-if="isLoggedIn" to="/flashcards">{{
        $t("nav.flashcards")
      }}</router-link>
      |
      <router-link v-if="isLoggedIn" to="/profile">{{
        $t("nav.profile")
      }}</router-link>
      |
      <a v-if="isLoggedIn" href="#" @click.prevent="logout">{{
        $t("nav.logout")
      }}</a>

      <select v-model="currentLocale" @change="changeLanguage">
        <option
          v-for="locale in supportedLocales"
          :key="locale.code"
          :value="locale.code"
        >
          {{ locale.name }}
        </option>
      </select>
    </nav>
    <router-view />
    <ChatbotWidget />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import ChatbotWidget from "@/components/ChatbotWidget.vue";
import { key } from "@/store";

const store = useStore(key);
const { locale } = useI18n();
const router = useRouter();

const isLoggedIn = computed(() => !!store.state.auth.user);

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
  router.push("/login");
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
