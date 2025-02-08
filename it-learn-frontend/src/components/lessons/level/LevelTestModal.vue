<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="$emit('close')"
      ></div>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
              <AcademicCapIcon class="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Level {{ level?.order }} Test
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you ready to take the level test? Make sure you've completed all lessons and feel confident with the material.
                </p>

                <div class="mt-4 space-y-4">
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-sm font-medium text-gray-900">Test Requirements:</h4>
                    <ul class="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                      <li>Complete all lessons in Level {{ level?.order }}</li>
                      <li>Pass all lesson quizzes</li>
                      <li>Score {{ level?.test_passing_score || 80 }}% or higher to advance</li>
                    </ul>
                  </div>

                  <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-sm font-medium text-gray-900">Test Format:</h4>
                    <ul class="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                      <li>{{ level?.test_questions_count || 10 }} questions</li>
                      <li>90 seconds per question</li>
                      <li>No retries during the test</li>
                      <li>Points based on speed and accuracy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
            @click="$emit('start-test')"
          >
            Start Test
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="$emit('close')"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AcademicCapIcon } from '@heroicons/vue/24/outline';
import type { Level } from '@/types/lessons';

defineProps<{
  level: Level | null;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'start-test'): void;
}>();
</script>
