<template>
  <div class="profile">
    <h1>Profile</h1>
    <div v-if="profile">
      <p><strong>Username:</strong> {{ profile.username }}</p>
      <p><strong>Email:</strong> {{ profile.email }}</p>
      <p><strong>Bio:</strong> {{ profile.bio }}</p>
      <button @click="editProfile">Edit Profile</button>
    </div>
    <div v-else>
      <p>Loading profile...</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ProfileComponent',
  computed: {
    ...mapGetters(['profile']),
  },
  methods: {
    ...mapActions(['fetchProfile']),
    editProfile() {
      // Logic to edit profile
      console.log('Edit profile');
    },
  },
  async created() {
    await this.fetchProfile();
  },
};
</script>

<style scoped>
.profile {
  padding: 2rem;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #35495e;
}
</style>
