<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <!-- About Header -->
      <div class="mx-auto max-w-2xl lg:text-center">
        <h2 class="text-base font-semibold leading-7 text-primary-600">About Us</h2>
        <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Learning Linux Commands Made Simple
        </p>
        <p class="mt-6 text-lg leading-8 text-gray-600">
          IT Learning is an interactive platform designed to help developers and system administrators master Linux/MacOS commands through a structured, hands-on learning approach.
        </p>
      </div>

      <!-- Platform Features -->
      <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <div class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          <!-- Learning System -->
          <div class="flex flex-col">
            <dt class="text-base font-semibold leading-7 text-gray-900">
              Comprehensive Learning System
            </dt>
            <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
              <p class="flex-auto">Our platform features:</p>
              <ul class="mt-4 space-y-2">
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Level-based progression system
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Interactive flashcards
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Practical command examples
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Progress tracking
                </li>
              </ul>
            </dd>
          </div>

          <!-- AI Assistant -->
          <div class="flex flex-col">
            <dt class="text-base font-semibold leading-7 text-gray-900">
              Intelligent Learning Assistant
            </dt>
            <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
              <p class="flex-auto">Our AI-powered chatbot provides:</p>
              <ul class="mt-4 space-y-2">
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Natural language interactions
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Command explanations
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Best practices and tips
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Learning guidance
                </li>
              </ul>
            </dd>
          </div>

          <!-- Learning Path -->
          <div class="flex flex-col">
            <dt class="text-base font-semibold leading-7 text-gray-900">
              Structured Learning Path
            </dt>
            <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
              <p class="flex-auto">Progress through four levels:</p>
              <ul class="mt-4 space-y-2">
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Beginner fundamentals
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Intermediate skills
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced techniques
                </li>
                <li class="flex items-center">
                  <svg class="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Expert mastery
                </li>
              </ul>
            </dd>
          </div>
        </div>
      </div>

      <!-- Mission Statement -->
      <div class="mx-auto mt-32 max-w-2xl sm:mt-40 lg:mt-56">
        <div class="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
          <h2 class="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Our Mission
          </h2>
          <p class="mx-auto mt-6 max-w-xl text-center text-lg leading-8 text-gray-300">
            To make command line mastery accessible to everyone through interactive, engaging, and structured learning experiences.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <RouterLink
              to="/register"
              class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Start Learning
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';

export default defineComponent({
  name: 'AboutView',
  components: {
    RouterLink,
  },
});
</script>
