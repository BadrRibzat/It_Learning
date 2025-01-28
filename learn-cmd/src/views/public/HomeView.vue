<template>
  <div class="home">
    <section class="hero bg-primary text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">
          Unlock Your Potential with Interactive Commands Lines Learning
        </h1>
        <p class="text-lg md:text-xl mb-8">
          Master Cammands Lines through engaging lessons, flashcards, quizzes, and personalized feedback.
        </p>
        <router-link to="/auth/register" class="btn-primary inline-block px-8 py-3 text-lg">
          Get Started for Free
        </router-link>
      </div>
    </section>

    <section class="features py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">
          Why Choose Learn Cammands Lines?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="card text-center">
            <i class="fas fa-cards-blank text-4xl text-primary mb-4"></i>
            <h3 class="text-xl font-bold mb-2">Interactive Flashcards</h3>
            <p class="text-gray-600">
              Boost your knowledges with our dynamic flashcard system.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="card text-center">
            <i class="fas fa-chart-line text-4xl text-primary mb-4"></i>
            <h3 class="text-xl font-bold mb-2">Progress Tracking</h3>
            <p class="text-gray-600">
              Monitor your learning journey and stay motivated with detailed progress reports.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="card text-center">
            <i class="fas fa-user-graduate text-4xl text-primary mb-4"></i>
            <h3 class="text-xl font-bold mb-2">Personalized Learning</h3>
            <p class="text-gray-600">
              Tailor your learning experience to your specific needs and goals.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="demo py-16 bg-gray-100">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">
          Experience Our Learning System
        </h2>
        <div class="w-full max-w-xl mx-auto">
          <flashcard-demo />
        </div>
      </div>
    </section>

    <section class="testimonials py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">
          What Our Learners Say
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Testimonial 1 -->
          <div class="card">
            <p class="text-gray-600 mb-4">
              "Learn Commands Lines has transformed the way I learn Engineering. The interactive flashcards and quizzes make it so much fun!"
            </p>
            <div class="flex items-center">
              <i class="fas fa-user-circle text-4xl text-primary mr-4"></i>
              <span class="font-bold">Sarah M.</span>
            </div>
          </div>

          <!-- Testimonial 2 -->
          <div class="card">
            <p class="text-gray-600 mb-4">
              "I love how I can track my progress and see how much I've improved. This platform is a game-changer!"
            </p>
            <div class="flex items-center">
              <i class="fas fa-user-circle text-4xl text-primary mr-4"></i>
              <span class="font-bold">John D.</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="call-to-action bg-secondary text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-8">
          Ready to Start Your Cammands Lines Learning Journey?
        </h2>
        <router-link to="/auth/register" class="btn-primary inline-block px-8 py-3 text-lg">
          Sign Up Now
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import FlashcardDemo from '@/components/common/FlashcardDemo.vue'

export default {
  name: 'HomeView',
  components: {
    FlashcardDemo
  }
}
</script>
