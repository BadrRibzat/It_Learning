<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <div class="ml-64 p-8">
      <h1 class="text-3xl font-bold mb-8">Profile</h1>
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Profile Information</h2>
          <form @submit.prevent="updateProfile">
            <div class="mb-4">
              <label class="block text-gray-700">Username</label>
              <input v-model="profile.username" class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700">Email</label>
              <input v-model="profile.email" class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <button type="submit" class="bg-primary text-white px-4 py-2 rounded-lg">Update Profile</button>
          </form>
        </div>
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Profile Picture</h2>
          <div class="flex items-center">
            <img v-if="profile.profilePicture" :src="profile.profilePicture" class="h-24 w-24 rounded-full mr-4" />
            <div>
              <input type="file" @change="handleFileChange" class="mb-4" />
              <button @click="uploadProfilePicture" class="bg-primary text-white px-4 py-2 rounded-lg">Upload Picture</button>
              <button @click="deleteProfilePicture" class="bg-red-500 text-white px-4 py-2 rounded-lg ml-4">Delete Picture</button>
            </div>
          </div>
        </div>
        <div>
          <h2 class="text-2xl font-bold mb-4">Reset Progress</h2>
          <button @click="resetProgress" class="bg-red-500 text-white px-4 py-2 rounded-lg">Reset Progress</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Sidebar from '@/components/dashboard/Sidebar.vue'

const store = useStore()
const profile = ref({})
const file = ref(null)

onMounted(async () => {
  await store.dispatch('profile/fetchProfile')
  profile.value = store.state.profile.profile
})

const updateProfile = async () => {
  await store.dispatch('profile/updateProfile', profile.value)
}

const handleFileChange = (event) => {
  file.value = event.target.files[0]
}

const uploadProfilePicture = async () => {
  const formData = new FormData()
  formData.append('profile_picture', file.value)
  await store.dispatch('profile/uploadProfilePicture', formData)
}

const deleteProfilePicture = async () => {
  // Implement delete profile picture logic
}

const resetProgress = async () => {
  await store.dispatch('profile/resetProgress')
}
</script>
