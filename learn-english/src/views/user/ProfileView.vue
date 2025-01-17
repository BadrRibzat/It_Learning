<template>
  <div class="profile-view flex flex-1">
    <!-- Sidebar -->
    <Sidebar :isSidebarOpen="isSidebarOpen" @toggle-sidebar="toggleSidebar" />

    <!-- Main Content -->
    <div
      class="flex-1 p-10 overflow-y-auto transition-all duration-300 ease-in-out"
      :class="{ 'ml-16': !isSidebarOpen, 'ml-64': isSidebarOpen }"
    >
      <!-- Progress Circle and Profile Picture Upload -->
      <div class="flex justify-end mb-8">
        <div class="text-right">
          <h3 class="text-2xl font-bold text-primary mb-4">Learning Progress</h3>
          <div class="flex items-center gap-4">
            <ProgressCircle :progress="progressState.progress" />
            <div class="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                @change="onFileSelected"
                class="border border-gray-400 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-primary"
              />
              <button
                @click="uploadProfilePicture"
                class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Upload Picture
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Default Profile Content -->
      <div v-if="$route.path === '/profile'">
        <div class="container mx-auto px-4">
          <h1 class="text-4xl font-bold text-center text-primary mb-8">
            My Profile
          </h1>

          <!-- Profile Information -->
          <div v-if="profile" class="bg-white shadow-lg rounded-lg p-8">
            <div class="flex flex-col md:flex-row items-center md:items-start">
              <div class="w-full md:w-1/3 flex justify-center">
                <div
                  class="w-48 h-48 rounded-full object-cover border-4 border-gray-200 flex items-center justify-center"
                >
                  <i
                    v-if="!profile.profile_picture"
                    class="fas fa-user-circle text-6xl text-gray-400"
                  ></i>
                  <img
                    v-else
                    :src="profile.profile_picture"
                    alt="Profile Picture"
                    class="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div class="w-full md:w-2/3 mt-6 md:mt-0 md:ml-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">
                  {{ profile.username }}
                </h2>
                <p class="text-gray-600 mb-4">{{ profile.bio }}</p>
                <ul class="text-gray-600">
                  <li class="mb-2">
                    <i class="fas fa-envelope text-primary mr-2"></i>
                    {{ profile.email }}
                  </li>
                  <li class="mb-2">
                    <i class="fas fa-calendar-alt text-primary mr-2"></i>
                    {{ profile.date_of_birth }}
                  </li>
                  <li class="mb-2">
                    <i class="fas fa-globe text-primary mr-2"></i>
                    {{ profile.language }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="mt-8">
              <button
                @click="editProfile"
                class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <!-- User Statistics -->
          <div v-if="statistics" class="mt-8 bg-white shadow-lg rounded-lg p-8">
            <h2 class="text-2xl font-bold text-primary mb-4">Statistics</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-800">Completed Lessons</h3>
                <p class="text-gray-600">{{ statistics.completed_lessons }}</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-800">Total Points</h3>
                <p class="text-gray-600">{{ statistics.total_points }}</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-800">Correct Flashcards</h3>
                <p class="text-gray-600">{{ statistics.correct_flashcards }} / {{ statistics.total_flashcards }}</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-800">Learning Streak</h3>
                <p class="text-gray-600">{{ statistics.learning_streak }} days</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-800">Time Spent Learning</h3>
                <p class="text-gray-600">{{ statistics.time_spent_learning.total_hours }} hours</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-800">Current Level Progress</h3>
                <p class="text-gray-600">{{ statistics.current_level_progress.lessons_progress.percentage }}%</p>
              </div>
            </div>
          </div>

          <!-- Recommended Lessons -->
          <div v-if="recommendedLessons.length > 0" class="mt-8 bg-white shadow-lg rounded-lg p-8">
            <h2 class="text-2xl font-bold text-primary mb-4">Recommended Lessons</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="lesson in recommendedLessons"
                :key="lesson.id"
                class="bg-gray-50 p-4 rounded-lg"
              >
                <h3 class="text-lg font-semibold text-gray-800">{{ lesson.title }}</h3>
                <p class="text-gray-600">{{ lesson.description }}</p>
              </div>
            </div>
          </div>

          <!-- User Notes -->
          <div v-if="notes.length > 0" class="mt-8 bg-white shadow-lg rounded-lg p-8">
            <h2 class="text-2xl font-bold text-primary mb-4">Notes</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="note in notes"
                :key="note.id"
                class="bg-gray-50 p-4 rounded-lg"
              >
                <h3 class="text-lg font-semibold text-gray-800">{{ note.title }}</h3>
                <p class="text-gray-600">{{ note.content }}</p>
                <p class="text-sm text-gray-500">{{ note.note_type }}</p>
              </div>
            </div>
          </div>

          <!-- Multi-Factor Authentication Status -->
          <div v-if="profile && profile.mfa" class="mt-8 bg-white shadow-lg rounded-lg p-8">
            <h2 class="text-2xl font-bold text-primary mb-4">Security</h2>
            <div class="flex items-center justify-between">
              <p class="text-gray-600">Multi-Factor Authentication (MFA)</p>
              <span
                class="px-4 py-2 rounded-full text-sm font-semibold"
                :class="{
                  'bg-green-100 text-green-800': profile.mfa.is_enabled,
                  'bg-red-100 text-red-800': !profile.mfa.is_enabled,
                }"
              >
                {{ profile.mfa.is_enabled ? "Enabled" : "Disabled" }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Nested Route Content -->
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/common/Sidebar.vue";
import ProgressCircle from "@/components/progress/ProgressCircle.vue";
import { progressState } from "@/utils/progress";
import { mapState, mapActions } from "vuex";

export default {
  name: "ProfileView",
  components: {
    Sidebar,
    ProgressCircle,
  },
  data() {
    return {
      isSidebarOpen: false,
      recommendedLessons: [],
      notes: [],
      selectedFile: null,
    };
  },
  computed: {
    ...mapState("profile", ["profile", "statistics"]),
    ...mapState("auth", ["user"]),
    progressState() {
      return progressState;
    },
  },
  async created() {
    if (this.user) {
      await this.fetchProfile(this.user.username);
      await this.fetchStatistics(this.user.username);
      await this.fetchRecommendedLessons();
      await this.fetchNotes();
    } else {
      console.error("User data is not available.");
    }
  },
  methods: {
    ...mapActions("profile", ["fetchProfile", "fetchStatistics", "uploadProfilePicture"]),
    async fetchRecommendedLessons() {
      try {
        const response = await ProfileService.getRecommendedLessons();
        this.recommendedLessons = response.recommended_lessons;
      } catch (error) {
        console.error("Failed to fetch recommended lessons:", error);
      }
    },
    async fetchNotes() {
      try {
        const response = await ProfileService.getNotes();
        this.notes = response;
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadProfilePicture() {
      if (this.selectedFile) {
        try {
          await this.uploadProfilePicture(this.selectedFile);
          await this.fetchProfile(this.user.username);
          this.selectedFile = null;
        } catch (error) {
          console.error("Failed to upload profile picture:", error);
        }
      }
    },
    editProfile() {
      this.$router.push("/profile/edit");
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
  },
};
</script>

<style scoped>
.profile-picture {
  min-width: 100px;
  min-height: 100px;
}
</style>
