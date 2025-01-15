<template>
  <div class="profile-view flex flex-1">
    <!-- Sidebar -->
    <Sidebar :isSidebarOpen="isSidebarOpen" @toggle-sidebar="toggleSidebar" />

    <!-- Main Content -->
    <div
      class="flex-1 p-10 overflow-y-auto transition-all duration-300 ease-in-out"
      :class="{ 'ml-16': !isSidebarOpen, 'ml-64': isSidebarOpen }"
    >
      <!-- Progress Circle at the Top Right -->
      <div class="flex justify-end mb-8">
        <div class="text-right">
          <h3 class="text-2xl font-bold text-primary mb-4">Learning Progress</h3>
          <ProgressCircle :progress="progressState.progress" />
        </div>
      </div>

      <!-- Default Profile Content -->
      <div v-if="$route.path === '/profile'">
        <div class="container mx-auto px-4">
          <h1 class="text-4xl font-bold text-center text-primary mb-8">
            My Profile
          </h1>
          <div class="bg-white shadow-lg rounded-lg p-8">
            <div class="flex flex-col md:flex-row items-center md:items-start">
              <div class="w-full md:w-1/3 flex justify-center">
                <div
                  class="w-48 h-48 rounded-full object-cover border-4 border-gray-200 flex items-center justify-center"
                >
                  <i
                    v-if="!user.profilePicture"
                    class="fas fa-user-circle text-6xl text-gray-400"
                  ></i>
                  <img
                    v-else
                    :src="user.profilePicture"
                    alt="Profile Picture"
                    class="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div class="w-full md:w-2/3 mt-6 md:mt-0 md:ml-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">
                  {{ user.firstName }} {{ user.lastName }}
                </h2>
                <p class="text-gray-600 mb-4">{{ user.bio }}</p>
                <ul class="text-gray-600">
                  <li class="mb-2">
                    <i class="fas fa-envelope text-primary mr-2"></i>
                    {{ user.email }}
                  </li>
                  <li class="mb-2">
                    <i class="fas fa-map-marker-alt text-primary mr-2"></i>
                    {{ user.location }}
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
        </div>
      </div>

      <!-- Nested Route Content -->
      <router-view v-else />
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/common/Sidebar.vue";
import ProgressCircle from "@/components/progress/ProgressCircle.vue";
import { progressState } from "@/utils/progress";

export default {
  name: "ProfileView",
  components: {
    Sidebar,
    ProgressCircle,
  },
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        bio: "",
        location: "",
        profilePicture: null,
      },
      isSidebarOpen: false,
    };
  },
  created() {
    // Load saved user data when the component is created
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  },
  setup() {
    return {
      progressState,
    };
  },
  methods: {
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
  min-width: 100px; /* Adjust as needed */
  min-height: 100px; /* Adjust as needed */
}
</style>
