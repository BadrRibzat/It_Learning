<template>
  <form @submit.prevent="submitForm">
    <div class="mb-4">
      <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
      <input v-model="form.username" type="text" id="username" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
    </div>
    <div class="mb-4">
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input v-model="form.email" type="email" id="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
    </div>
    <div class="mb-4">
      <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
      <textarea v-model="form.bio" id="bio" rows="4" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
    </div>
    <div class="mb-4">
      <label for="profilePicture" class="block text-sm font-medium text-gray-700">Profile Picture</label>
      <input type="file" id="profilePicture" @change="handleFileChange" accept="image/*" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
    </div>
    <div class="flex justify-end">
      <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
        Save
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  initialData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['submit']);

const form = ref({
  username: props.initialData.username,
  email: props.initialData.email,
  bio: props.initialData.bio,
  profilePicture: null,
});

const handleFileChange = (event) => {
  form.value.profilePicture = event.target.files[0];
};

const submitForm = () => {
  emit('submit', form.value);
};
</script>
