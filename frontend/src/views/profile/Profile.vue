<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Profile</h1>

    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center mb-6">
        <img :src="profilePicture" alt="Profile Picture" class="w-32 h-32 rounded-full mr-6">
        <div>
          <h2 class="text-2xl font-bold mb-2">{{ profile.username }}</h2>
          <p class="text-gray-600">{{ profile.email }}</p>
        </div>
      </div>
      <div class="mb-6">
        <h2 class="text-2xl font-bold mb-4">Personal Information</h2>
        <ProfileForm :initialData="profile" @submit="updateProfile" />
      </div>

      <div v-if="statistics">
        <h2 class="text-2xl font-bold mb-4">Statistics</h2>
        <ProfileStatistics :statistics="statistics" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useNotification } from '@/composables/useNotification';
import ProfileForm from '@/components/profile/ProfileForm.vue';
import ProfileStatistics from '@/components/profile/ProfileStatistics.vue';

const store = useStore();
const { show } = useNotification();

const profile = ref({
  username: '',
  email: '',
  bio: '',
  profilePicture: null,
});

const statistics = ref(null);

const profilePicture = computed(() => profile.value.profilePicture || '/default-profile.png');

onMounted(async () => {
  await fetchProfileData();
  await fetchStatistics();
});

const fetchProfileData = async () => {
  try {
    const profileData = await store.dispatch('profile/fetchProfile');
    profile.value = {
      username: profileData.username,
      email: profileData.email,
      bio: profileData.bio || '',
      profilePicture: profileData.profile_picture,
    };
  } catch (error) {
    show('Failed to load profile data', 'error');
  }
};

const fetchStatistics = async () => {
  try {
    statistics.value = await store.dispatch('profile/fetchStatistics');
  } catch (error) {
    show('Failed to load statistics', 'error');
    statistics.value = null;
  }
};

const updateProfile = async (profileData) => {
  try {
    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      if (key === 'profilePicture' && profileData[key]) {
        formData.append(key, profileData[key]);
      } else {
        formData.append(key, profileData[key]);
      }
    });
    await store.dispatch('profile/updateProfile', formData);
    show('Profile updated successfully', 'success');
    await fetchProfileData();
  } catch (error) {
    show('Failed to update profile', 'error');
  }
};
</script>
