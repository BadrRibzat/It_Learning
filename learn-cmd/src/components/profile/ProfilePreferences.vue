<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-2xl font-bold mb-6">Preferences</h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700">Language</label>
        <LanguageSwitcher
          v-model="formData.preferred_language"
          class="mt-1"
        />
      </div>

      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-gray-700">Dark Mode</span>
        <ThemeSwitcher />
      </div>

      <div class="flex justify-end space-x-4">
        <button type="submit" class="btn-primary">
          Save Preferences
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue';

export default {
  name: 'ProfilePreferences',
  components: {
    LanguageSwitcher,
    ThemeSwitcher
  },
  emits: ['update'],
  setup(props, { emit }) {
    const formData = ref({
      preferred_language: 'en'
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
