<template>
  <TransitionRoot appear :show="true" as="template">
    <Dialog as="div" @close="handleClose" class="relative z-50">
      <TransitionChild
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                Profile Settings
              </DialogTitle>

              <form @submit.prevent="handleSubmit" class="mt-4 space-y-6">
                <!-- Language Preference -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Preferred Language
                  </label>
                  <select
                    v-model="formData.preferred_language"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>

                <!-- Notification Settings -->
                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-2">
                    Notification Preferences
                  </h4>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input
                        v-model="formData.notifications.achievements"
                        type="checkbox"
                        class="rounded border-gray-300 text-primary-600"
                      />
                      <span class="ml-2 text-sm text-gray-600">
                        Achievement Notifications
                      </span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="formData.notifications.progress"
                        type="checkbox"
                        class="rounded border-gray-300 text-primary-600"
                      />
                      <span class="ml-2 text-sm text-gray-600">
                        Progress Updates
                      </span>
                    </label>
                  </div>
                </div>

                <!-- Privacy Settings -->
                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-2">
                    Privacy Settings
                  </h4>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input
                        v-model="formData.privacy.public_profile"
                        type="checkbox"
                        class="rounded border-gray-300 text-primary-600"
                      />
                      <span class="ml-2 text-sm text-gray-600">
                        Public Profile
                      </span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="formData.privacy.show_achievements"
                        type="checkbox"
                        class="rounded border-gray-300 text-primary-600"
                      />
                      <span class="ml-2 text-sm text-gray-600">
                        Show Achievements
                      </span>
                    </label>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="handleClose"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    :disabled="updating"
                  >
                    {{ updating ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import type { ProfileData, LearningStats } from '@/types/profile';

const props = defineProps<{
  profile?: ProfileData;
  learningStats?: LearningStats;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update', data: any): void;
}>();

const updating = ref(false);

const formData = reactive({
  preferred_language: props.profile?.preferred_language || 'en',
  notifications: {
    achievements: true,
    progress: true
  },
  privacy: {
    public_profile: true,
    show_achievements: true
  }
});

const handleSubmit = async () => {
  try {
    updating.value = true;
    await emit('update', formData);
    emit('close');
  } catch (error) {
    console.error('Failed to update settings:', error);
  } finally {
    updating.value = false;
  }
};

const handleClose = () => {
  emit('close');
};
</script>
