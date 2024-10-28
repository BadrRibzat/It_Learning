<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center mb-4">
      <img :src="profilePicture" alt="Profile Picture" class="w-16 h-16 rounded-full mr-4">
      <div>
        <h2 class="text-xl font-bold">{{ username }}</h2>
        <p class="text-gray-600">{{ email }}</p>
      </div>
    </div>
    <p class="text-gray-600">{{ bio }}</p>
  </div>
</template>

<script setup>
defineProps({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: true,
  },
});
</script>
