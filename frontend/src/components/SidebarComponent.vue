<template>
  <aside class="sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
    <button @click="toggleSidebar" class="sidebar-toggle">
      {{ isSidebarOpen ? 'Close' : 'Open' }}
    </button>
    <nav v-if="isSidebarOpen">
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/profile">Profile</router-link>
      <router-link to="/levels">Levels</router-link>
      <router-link to="/notes">Notes</router-link>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'SidebarComponent',
  data() {
    return {
      isSidebarOpen: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
  },
};
</script>

<style scoped>
.sidebar {
  background-color: #35495e;
  color: white;
  width: 200px;
  padding: 1rem;
  position: fixed;
  top: 0;
  left: -200px;
  height: 100%;
  transition: left 0.3s ease;
}

.sidebar-open {
  left: 0;
}

.sidebar-toggle {
  position: absolute;
  top: 1rem;
  right: -40px;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

nav a {
  display: block;
  margin: 1rem 0;
  color: white;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}
</style>
