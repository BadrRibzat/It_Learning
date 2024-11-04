<template>
  <div class="dashboard">
    <h1>Welcome, {{ profile.username }}!</h1>
    <div class="profile-section">
      <img :src="profile.profile_picture || '/default-avatar.png'" alt="Profile Picture" class="profile-picture">
      <button @click="openProfilePictureUpload">Update Profile Picture</button>
      <input type="file" ref="fileInput" style="display: none" @change="uploadProfilePicture" accept="image/*">
    </div>
    <div class="dashboard-stats">
      <div class="stat">
        <h3>Completed Lessons</h3>
        <p>{{ statistics.completed_lessons || 0 }}</p>
      </div>
      <div class="stat">
        <h3>Total Points</h3>
        <p>{{ statistics.total_points || 0 }}</p>
      </div>
      <div class="stat">
        <h3>Current Level</h3>
        <p>{{ statistics.current_level || 1 }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'DashboardComponent',
  computed: {
    ...mapGetters(['profile', 'statistics']),
  },
  methods: {
    ...mapActions(['fetchProfile', 'fetchStatistics', 'uploadProfilePicture']),
    openProfilePictureUpload() {
      this.$refs.fileInput.click();
    },
    async uploadProfilePicture(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('profile_picture', file);
        try {
          await this.uploadProfilePicture(formData);
          alert('Profile picture updated successfully!');
        } catch (error) {
          console.error('Failed to upload profile picture:', error);
          alert('Failed to upload profile picture. Please try again.');
        }
      }
    },
  },
  async created() {
    try {
      await this.fetchProfile();
      await this.fetchStatistics();
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  },
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}

.profile-section {
  margin-bottom: 2rem;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.dashboard-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
}

.stat {
  background-color: #42b983;
  color: white;
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
}
</style>
