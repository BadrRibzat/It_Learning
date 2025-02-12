<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-16 sm:py-24">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Master Linux Commands Through Interactive Learning
          </h1>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Learn Linux/MacOS commands through an engaging platform with flashcards, quizzes, and an AI-powered chatbot assistant.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <RouterLink
              to="/register"
              class="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Get Started
            </RouterLink>
            <RouterLink
              to="/about"
              class="text-sm font-semibold leading-6 text-gray-900"
            >
              Learn more <span aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 sm:py-24">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:text-center">
          <h2 class="text-base font-semibold leading-7 text-primary-600">
            Interactive Learning
          </h2>
          <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to master the command line
          </p>
        </div>
        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <!-- Level-based Learning -->
            <div class="flex flex-col">
              <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-primary-600">
                  <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                Level-based Progression
              </dt>
              <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p class="flex-auto">Start from beginner basics and progress through intermediate, advanced, and expert levels at your own pace.</p>
              </dd>
            </div>

            <!-- Interactive Flashcards -->
            <div class="flex flex-col">
              <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-primary-600">
                  <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75M15 19.5v-.75a2.25 2.25 0 012.25-2.25h1.5V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15 19.5H9" />
                  </svg>
                </div>
                Interactive Flashcards
              </dt>
              <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p class="flex-auto">Practice with interactive flashcards featuring real command examples and instant feedback.</p>
              </dd>
            </div>

            <!-- AI Chatbot -->
            <div class="flex flex-col">
              <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-primary-600">
                  <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
                AI-Powered Assistant
              </dt>
              <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p class="flex-auto">Get help from our intelligent chatbot that provides command explanations, examples, and learning guidance.</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- Learning Path Section -->
    <section class="py-16 sm:py-24 bg-gray-50">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:text-center">
          <h2 class="text-base font-semibold leading-7 text-primary-600">
            Learning Path
          </h2>
          <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your journey to command line mastery
          </p>
        </div>
        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Beginner Level -->
            <div class="rounded-lg bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Beginner</h3>
              <ul class="mt-4 space-y-3 text-sm text-gray-600">
                <li class="flex items-center">
                  <svg class="h-4 w-4 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Basic file operations
                </li>
                <li class="flex items-center">
                  <svg class="h-4 w-4 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Directory navigation
                </li>
                <li class="flex items-center">
                  <svg class="h-4 w-4 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Simple commands
                </li>
              </ul>
            </div>

            <!-- Intermediate Level -->
            <div class="rounded-lg bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Intermediate</h3>
              <ul class="mt-4 space-y-3 text-sm text-gray-600">
                <li class="flex items-center">
                  <svg class="h-4 w-4 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  File permissions
                </li>
                <li class="flex items-center">
                  <svg class="h-4 w-4 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Text processing
                </li>
                <li class="flex items-center">
                  <svg class="h-4 w-4 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Process management
                </li>
              </ul>
            </div>

            <!-- Advanced Level -->
            <div class="rounded-lg bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Advanced</h3>
              <ul class="mt-4 space-y-3 text-sm text-gray-600">
                <li class="flex items-center">
                  <svg class="h-4 w-4 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Shell scripting
                </li>
                <li class="flex items-center">
                  <svg class="h-4 w-4 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Regular expressions
                </li>
                <li class="flex items-center">
                  <svg class="h-4 w-4 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  System administration
                </li>
              </ul>
            </div>

            <!-- Expert Level -->
            <div class="rounded-lg bg-white p-8 shadow-lg ring-1 ring-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Expert</h3>
              <ul class="mt-4 space-y-3 text-sm text-gray-600">
                <li class="flex items-center">
                  <svg class="h-4 w-4 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced scripting
                </li>
                <li class="flex items-center">
                  <svg class="h-4 w-4 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  System optimization
                  </li>
                <li class="flex items-center">
                  <svg class="h-4 w-4 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Security hardening
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Chatbot Feature Section -->
    <section class="py-16 sm:py-24">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:mx-0">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">AI-Powered Learning Assistant</h2>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Get instant help with our intelligent chatbot that understands your learning needs and provides personalized guidance.
          </p>
        </div>
        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div class="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
            <div class="lg:pr-8 lg:pt-4">
              <div class="lg:max-w-lg">
                <h3 class="text-2xl font-bold tracking-tight text-gray-900">Interactive Learning Experience</h3>
                <dl class="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600">
                  <div class="relative pl-9">
                    <dt class="font-semibold text-gray-900">
                      <svg class="absolute left-1 top-1 h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                      Natural Language Understanding
                    </dt>
                    <dd class="inline">Ask questions in plain English and get detailed explanations about any command.</dd>
                  </div>
                  <div class="relative pl-9">
                    <dt class="font-semibold text-gray-900">
                      <svg class="absolute left-1 top-1 h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                      Contextual Learning
                    </dt>
                    <dd class="inline">Get personalized recommendations based on your skill level and learning progress.</dd>
                  </div>
                  <div class="relative pl-9">
                    <dt class="font-semibold text-gray-900">
                      <svg class="absolute left-1 top-1 h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                      </svg>
                      Interactive Examples
                    </dt>
                    <dd class="inline">Practice with real-world examples and get immediate feedback on your progress.</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div class="flex items-center justify-center">
              <div class="relative h-[400px] w-full rounded-2xl bg-gray-900 p-8 ring-1 ring-gray-200/10">
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <h3 class="text-xl font-semibold text-white mb-4">Try asking:</h3>
                    <ul class="space-y-3 text-gray-300">
                      <li>"How do I use the ls command?"</li>
                      <li>"What are file permissions?"</li>
                      <li>"Show me examples of mkdir"</li>
                      <li>"Help me with process management"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8">
      <div class="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-b from-primary-100/20">
        <div class="absolute inset-0 bg-white/90"></div>
      </div>
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Ready to master the command line?
        </h2>
        <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
          Join thousands of developers who are improving their command line skills through our interactive learning platform.
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <RouterLink
            to="/register"
            class="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Start Learning Now
          </RouterLink>
          <RouterLink
            to="/contact"
            class="text-sm font-semibold leading-6 text-gray-900"
          >
            Contact us <span aria-hidden="true">→</span>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';

export default defineComponent({
  name: 'HomeView',
  components: {
    RouterLink,
  },
});
</script>
