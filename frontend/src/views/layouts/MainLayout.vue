<template>
  <div class="main-layout">
    <header>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/profile">Profile</router-link>
      <router-link to="/lessons">Lessons</router-link>
      <router-link to="/notes">Notes</router-link>
      <button @click="handleLogout">Logout</button>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'MainLayout',
  methods: {
    ...mapActions('auth', ['logout']),
    async handleLogout() {
      await this.logout();
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  background-color: #f0f0f0;
}

header a {
  margin-right: 10px;
}
</style>
