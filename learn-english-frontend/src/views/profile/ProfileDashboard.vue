<template>
  <div class="profile-dashboard">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="profile-picture">
        <img :src="profilePicture" alt="Profile Picture" @error="setDefaultPicture" />
      </div>
      <nav>
        <ul>
          <li><a href="#"><i class="fas fa-home"></i>Dashboard</a></li>
          <li><a href="#"><i class="fas fa-history"></i>Lessons</a></li>
          <li><a href="#"><i class="fas fa-history"></i>Flashcards</a></li>
          <li><a href="#"><i class="fas fa-cog"></i>Quizzes</a></li>
          <li><a href="#"><i class="fas fa-cog"></i>Notes</a></li>
          <li><a href="#"><i class="fas fa-history"></i>Levels</a></li>
          <li><a href="#"><i class="fas fa-history"></i>LevelTest</a></li>
        </ul>
      </nav>
    </div>

    <!-- Main Content Area -->
    <div class="main-content">
      <h1>Welcome to Your Learning Space</h1>
      <div class="profile-details">
        <h2>Profile Details</h2>
        <p><strong>Username:</strong> {{ userProfile.username }}</p>
        <p><strong>Email:</strong> {{ userProfile.email }}</p>
        <p><strong>Bio:</strong> {{ userProfile.bio }}</p>
      </div>
      <div class="statistics">
        <h2>Statistics</h2>
        <p><strong>Completed Lessons:</strong> {{ userStatistics.completed_lessons }}</p>
        <p><strong>Total Points:</strong> {{ userStatistics.total_points }}</p>
        <p><strong>Current Level:</strong> {{ userStatistics.current_level }}</p>
      </div>
      <div class="progress">
        <h2>Progress</h2>
        <p><strong>Lessons Progress:</strong> {{ userStatistics.lessons_progress }}%</p>
        <p><strong>Quizzes Progress:</strong> {{ userStatistics.quizzes_progress }}%</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const userProfile = ref({
      username: '',
      email: '',
      bio: '',
    });
    const userStatistics = ref({
      completed_lessons: 0,
      total_points: 0,
      current_level: '',
      lessons_progress: 0,
      quizzes_progress: 0,
    });

    const profilePicture = ref('https://via.placeholder.com/150');

    const setDefaultPicture = () => {
      profilePicture.value = 'https://via.placeholder.com/150';
    };

    onMounted(async () => {
      const profileResponse = await store.dispatch('profile/getUserProfile');
      userProfile.value = profileResponse.data;

      const statisticsResponse = await store.dispatch('profile/getUserStatistics');
      userStatistics.value = statisticsResponse.data;
    });

    return {
      userProfile,
      userStatistics,
      profilePicture,
      setDefaultPicture,
    };
  },
};
</script>

<style scoped>
.profile-dashboard {
  display: flex;
  height: 100vh;
  font-family: 'Arial', sans-serif;
}

.sidebar {
  width: 250px;
  background-color: #333;
  color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-picture {
  position: relative;
  margin-bottom: 20px;
}

.profile-picture img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

nav ul {
  list-style: none;
  padding: 0;
  width: 100%;
}

nav ul li {
  margin: 10px 0;
}

nav ul li a {
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
}

nav ul li a:hover {
  text-decoration: underline;
}

nav ul li a i {
  margin-right: 10px;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f4f4f4;
}

.main-content h1 {
  color: #333;
}

.profile-details, .statistics, .progress {
  margin-bottom: 20px;
}

.profile-details h2, .statistics h2, .progress h2 {
  color: #333;
  margin-bottom: 10px;
}
</style>
