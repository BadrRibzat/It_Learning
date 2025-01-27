<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-2xl font-bold mb-6">Personal Information</h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          id="fullName"
          v-model="formData.full_name"
          type="text"
          class="mt-1 input-field"
        />
      </div>
      
      <div>
        <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          id="bio"
          v-model="formData.bio"
          rows="4"
          class="mt-1 input-field"
        ></textarea>
      </div>

      <div class="flex justify-end space-x-4">
        <button type="submit" class="btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ProfilePersonal',
  emits: ['update'],
  setup(props, { emit }) {
    const formData = ref({
      full_name: '',
      bio: ''
    });

    const handleSubmit = () => {
      emit('update', formData.value);
    };

    return {
      formData,
      handleSubmit
    };
  }
};
</script>
