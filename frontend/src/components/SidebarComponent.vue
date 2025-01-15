<template>
  <aside class="sidebar">
    <nav>
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
  left: 0;
  height: 100%;
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
