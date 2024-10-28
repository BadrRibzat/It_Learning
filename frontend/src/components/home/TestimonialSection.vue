<template>
  <div class="bg-white py-16 lg:py-24">
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative">
        <div class="text-center">
          <h2 class="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
            Hear from our satisfied learners
          </h2>
          <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover how our flashcard system has helped people achieve their language learning goals.
          </p>
        </div>
        <div class="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
          <div v-for="testimonial in testimonials" :key="testimonial.name" class="flex flex-col rounded-lg shadow-lg overflow-hidden">
            <div class="flex-1 bg-white p-6 flex flex-col justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-primary">
                  {{ testimonial.language }}
                </p>
                <div class="block mt-2">
                  <p class="text-xl font-semibold text-gray-900">
                    {{ testimonial.name }}
                  </p>
                  <p class="mt-3 text-base text-gray-500">
                    {{ testimonial.quote }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const testimonials = [
  {
    name: 'Sarah Johnson',
    language: 'Spanish',
    quote: 'This flashcard system has revolutionized my language learning journey. I\'ve made more progress in 3 months than I did in a year of traditional classes!',
  },
  {
    name: 'Mike Chen',
    language: 'French',
    quote: 'The interactive features and progress tracking keep me motivated. I can see my improvement day by day, which is incredibly rewarding.',
  },
  {
    name: 'Emma Rodriguez',
    language: 'German',
    quote: 'I love how I can learn at my own pace. The spaced repetition system ensures I never forget what I\'ve learned. It\'s been a game-changer for me.',
  },
];
</script>
