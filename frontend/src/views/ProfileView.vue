<template>
  <div class="profile-view">
    <HeaderComponent />
    <SidebarComponent />
    <div class="profile-content">
      <h1>Profile</h1>
      <div v-if="profile">
        <img :src="profile.profile_picture || '/default-avatar.png'" alt="Profile Picture" class="profile-picture">
        <p><strong>Username:</strong> {{ profile.username }}</p>
        <p><strong>Email:</strong> {{ profile.email }}</p>
        <p><strong>Bio:</strong> {{ profile.bio }}</p>
        <button @click="toggleEditMode">{{ editMode ? 'Cancel' : 'Edit Profile' }}</button>
        <form v-if="editMode" @submit.prevent="updateProfile">
          <div>
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="editedProfile.username" required>
          </div>
          <div>
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="editedProfile.email" required>
          </div>
          <div>
            <label for="bio">Bio:</label>
            <textarea id="bio" v-model="editedProfile.bio"></textarea>
          </div>
          <button type="submit">Save Changes</button>
        </form>
      </div>
      <div v-else>
        <p>Loading profile...</p>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SidebarComponent from '../components/SidebarComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';

export default {
  name: 'ProfileView',
  components: {
    SidebarComponent,
    FooterComponent,
  },
  data() {
    return {
      editMode: false,
      editedProfile: {},
    };
  },
  computed: {
    ...mapGetters(['profile']),
  },
  methods: {
    ...mapActions(['fetchProfile', 'updateProfile']),
    toggleEditMode() {
      this.editMode = !this.editMode;
      if (this.editMode) {
        this.editedProfile = { ...this.profile };
      }
    },
    async handleUpdateProfile() {
      try {
        await this.updateProfile(this.editedProfile);
        this.editMode = false;
      } catch (error) {
        console.error('Failed to update profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    },
  },
  async created() {
    await this.fetchProfile();
  },
};
</script>

<style scoped>
.profile-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.profile-content {
  padding: 2rem;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

form div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover {
  background-color: #35495e;
}
</style>
