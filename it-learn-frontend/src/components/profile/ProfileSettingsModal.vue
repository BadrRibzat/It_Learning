<template>
  <TransitionRoot as="template" appear :show="true">
    <Dialog as="div" class="relative z-10">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to="opacity-100 translate-y-0 sm:scale-100"
        leave="ease-in duration-200"
        leave-from="opacity-100 translate-y-0 sm:scale-100"
        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div>
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle as="h3" class="text-lg leading-6 font-medium text-gray-900">
                  Settings
                </DialogTitle>
                <div class="mt-2">
                  <form @submit.prevent="handleUpdate">
                    <div class="space-y-4">
                      <div>
                        <label for="preferredLanguage" class="block text-sm font-medium text-gray-700">Preferred Language</label>
                        <select
                          v-model="formData.preferred_language"
                          id="preferredLanguage"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="en">English</option>
                          <option value="fr">French</option>
                          <option value="es">Spanish</option>
                          <option value="ar">Arabic</option>
                        </select>
                      </div>
                      <div>
                        <label for="notifications" class="block text-sm font-medium text-gray-700">Notifications</label>
                        <div class="mt-1 space-y-2">
                          <div class="flex items-center">
                            <input
                              type="checkbox"
                              id="achievements"
                              v-model="formData.notifications.achievements"
                              class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label for="achievements" class="ml-2 block text-sm text-gray-900">Achievements</label>
                          </div>
                          <div class="flex items-center">
                            <input
                              type="checkbox"
                              id="progress"
                              v-model="formData.notifications.progress"
                              class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label for="progress" class="ml-2 block text-sm text-gray-900">Progress</label>
                          </div>
                          <div class="flex items-center">
                            <input
                              type="checkbox"
                              id="streaks"
                              v-model="formData.notifications.streaks"
                              class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label for="streaks" class="ml-2 block text-sm text-gray-900">Streaks</label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label for="privacy" class="block text-sm font-medium text-gray-700">Privacy</label>
                        <div class="mt-1 space-y-2">
                          <div class="flex items-center">
                            <input
                              type="checkbox"
                              id="publicProfile"
                              v-model="formData.privacy.public_profile"
                              class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label for="publicProfile" class="ml-2 block text-sm text-gray-900">Public Profile</label>
                          </div>
                          <div class="flex items-center">
                            <input
                              type="checkbox"
                              id="showAchievements"
                              v-model="formData.privacy.show_achievements"
                              class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label for="showAchievements" class="ml-2 block text-sm text-gray-900">Show Achievements</label>
                          </div>
                          <div class="flex items-center">
                            <input
                              type="checkbox"
                              id="showActivity"
                              v-model="formData.privacy.show_activity"
                              class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label for="showActivity" class="ml-2 block text-sm text-gray-900">Show Activity</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-4">
                      <button
                        type="button"
                        @click="handleClose"
                        class="inline-flex justify-center rounded-md border border-gray-300 py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import type { ProfileSettings } from '@/types/profile';

const props = defineProps<{
  profile: ProfileSettings | null;
  learningStats: any | null;
}>();

const emits = defineEmits(['close', 'update']);

const formData = ref({
  preferred_language: props.profile?.preferred_language || 'en',
  notifications: {
    achievements: props.profile?.notifications?.achievements || false,
    progress: props.profile?.notifications?.progress || false,
    streaks: props.profile?.notifications?.streaks || false,
  },
  privacy: {
    public_profile: props.profile?.privacy?.public_profile || false,
    show_achievements: props.profile?.privacy?.show_achievements || false,
    show_activity: props.profile?.privacy?.show_activity || false,
  },
});

const handleClose = () => {
  emits('close');
};

const handleUpdate = () => {
  emits('update', formData.value);
  handleClose();
};
</script>

<style scoped>
  .transition-all {
    transition-property: opacity, transform;
  }

  .transform {
    transform: none;
  }

  .overflow-hidden {
    overflow: hidden;
  }

  .rounded-lg {
    border-radius: 0.5rem;
  }

  .bg-white {
    --tw-bg-opacity: 1;
    background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
  }

  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .pt-5 {
    padding-top: 1.25rem;
  }

  .pb-4 {
    padding-bottom: 1rem;
  }

  .text-left {
    text-align: left;
  }

  .shadow-xl {
    --tw-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }

  .sm\:my-8 {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .sm\:w-full {
    width: 100%;
  }

  .sm\:max-w-lg {
    max-width: 32rem;
  }

  .sm\:p-6 {
    padding: 1.5rem;
  }

  .text-center {
    text-align: center;
  }

  .sm\:mt-0 {
    margin-top: 0;
  }

  .sm\:ml-4 {
    margin-left: 1rem;
  }

  .sm\:text-left {
    text-align: left;
  }

  .text-lg {
    font-size: 1.125rem;
  }

  .leading-6 {
    line-height: 1.5rem;
  }

</style>
