<template>
  <nav>
    <router-link to="/">{{ $t("nav.home") }}</router-link> |
    <router-link to="/login">{{ $t("nav.login") }}</router-link> |
    <router-link to="/register">{{ $t("nav.register") }}</router-link> |
    <router-link to="/lessons">{{ $t("nav.lessons") }}</router-link> |
    <router-link to="/flashcards">{{ $t("nav.flashcards") }}</router-link> |
    <router-link to="/quiz">{{ $t("nav.quiz") }}</router-link> |
    <router-link to="/profile">{{ $t("nav.profile") }}</router-link>
  </nav>
  <router-view />
</template>

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
