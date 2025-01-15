<template>
  <div class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h2 class="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          A better way to learn languages
        </p>
        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Our flashcard system is designed to help you learn faster and retain information longer.
        </p>
      </div>

      <div class="mt-10">
        <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
          <div v-for="feature in features" :key="feature.name" class="relative">
            <dt>
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                <font-awesome-icon :icon="feature.icon" class="h-6 w-6" aria-hidden="true" />
              </div>
              <p class="ml-16 text-lg leading-6 font-medium text-gray-900">{{ feature.name }}</p>
            </dt>
            <dd class="mt-2 ml-16 text-base text-gray-500">
              {{ feature.description }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup>
const features = [
  {
    name: 'Interactive Learning',
    description: 'Engage with flashcards that adapt to your learning style and progress.',
    icon: ['fas', 'lightbulb'],
  },
  {
    name: 'Spaced Repetition',
    description: 'Our system uses scientifically-proven methods to help you retain information longer.',
    icon: ['fas', 'graduation-cap'],
  },
  {
    name: 'Progress Tracking',
    description: 'Monitor your improvement with detailed statistics and progress reports.',
    icon: ['fas', 'chart-pie'],
  },
  {
    name: 'Time-Efficient',
    description: 'Learn at your own pace with short, focused study sessions.',
    icon: ['fas', 'clock'],
  },
];
</script>
