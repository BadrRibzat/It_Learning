<template>
  <header class="header">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/contact">Contact</router-link> |
      <router-link v-if="!isAuthenticated" to="/sign-in">Sign In</router-link> |
      <router-link v-if="!isAuthenticated" to="/sign-up">Sign Up</router-link> |
      <button v-if="isAuthenticated" @click="logout">Logout</button>
      <select v-model="$i18n.locale">
        <option v-for="locale in $i18n.availableLocales" :key="locale" :value="locale">{{ locale }}</option>
      </select>
    </nav>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'HeaderComponent',
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    ...mapActions(['logout']),
  },
};
</script>

<style scoped>
.header {
  background-color: #42b983;
  padding: 1rem;
  text-align: center;
}

nav a {
  margin: 0 1rem;
  color: white;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

button {
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #ff4500;
}

select {
  margin-left: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
