<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-center py-20">
      <h1 class="text-5xl font-bold mb-5">FlashLearn</h1>
      <p class="text-xl max-w-2xl mx-auto">Master English through interactive flashcards with real-time feedback and progress tracking</p>
    </section>

    <!-- Language Support Section -->
    <section class="language-support bg-gray-100 py-20 text-center">
      <h2 class="text-3xl font-bold mb-10">Available in 8 Languages</h2>
      <div class="language-grid grid grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
        <div class="language-item bg-white p-6 rounded-lg shadow-md">
          <i class="fas fa-language text-2xl mb-4"></i>
          <h3 class="text-lg font-semibold">English</h3>
        </div>
        <div class="language-item bg-white p-6 rounded-lg shadow-md">
          <i class="fas fa-language text-2xl mb-4"></i>
          <h3 class="text-lg font-semibold">العربية</h3>
        </div>
        <div class="language-item bg-white p-6 rounded-lg shadow-md">
          <i class="fas fa-language text-2xl mb-4"></i>
          <h3 class="text-lg font-semibold">Français</h3>
        </div>
        <div class="language-item bg-white p-6 rounded-lg shadow-md">
          <i class="fas fa-language text-2xl mb-4"></i>
          <h3 class="text-lg font-semibold">Español</h3>
        </div>
        <div class="language-item bg-white p-6 rounded-lg shadow-md">
          <i class="fas fa-language text-2xl mb-4"></i>
          <h3 class="text-lg font-semibold">Deutsch</h3>
        </div>
        <div class="language-item bg-white p-6 rounded-lg shadow-md">
          <i class="fas fa-language text-2xl mb-4"></i>
          <h3 class="text-lg font-semibold">日本語</h3>
        </div>
        <div class="language-item bg-white p-6 rounded-lg shadow-md">
          <i class="fas fa-language text-2xl mb-4"></i>
          <h3 class="text-lg font-semibold">한국어</h3>
        </div>
        <div class="language-item bg-white p-6 rounded-lg shadow-md">
          <i class="fas fa-language text-2xl mb-4"></i>
          <h3 class="text-lg font-semibold">中文</h3>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features py-20 text-center">
      <h2 class="text-3xl font-bold mb-10">Why Choose FlashLearn?</h2>
      <div class="features-grid grid grid-cols-3 gap-10 max-w-6xl mx-auto px-4">
        <div class="feature-item p-8">
          <i class="fas fa-sync-alt text-4xl text-indigo-500 mb-6"></i>
          <h3 class="text-xl font-semibold">Interactive Learning</h3>
          <p class="text-gray-600">Flip cards to test your knowledge with real-time feedback</p>
        </div>
        <div class="feature-item p-8">
          <i class="fas fa-chart-line text-4xl text-indigo-500 mb-6"></i>
          <h3 class="text-xl font-semibold">Progress Tracking</h3>
          <p class="text-gray-600">Monitor your learning journey with detailed analytics</p>
        </div>
        <div class="feature-item p-8">
          <i class="fas fa-globe text-4xl text-indigo-500 mb-6"></i>
          <h3 class="text-xl font-semibold">Multi-Language Support</h3>
          <p class="text-gray-600">Learn in your preferred language</p>
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section class="demo-section bg-gray-100 py-20 text-center">
      <h2 class="text-3xl font-bold mb-10">Try it Yourself!</h2>
      <div class="flashcard-demo w-full max-w-lg mx-auto">
        <div class="flashcard-inner relative w-full h-64" :class="{ 'rotate-y-180': isFlipped }" @click="flipCard">
          <div class="flashcard-front absolute w-full h-full bg-white flex flex-col items-center justify-center p-6 rounded-lg shadow-lg">
            <h3 class="text-2xl font-semibold">Perseverance</h3>
            <p class="text-gray-600">The quality of continuing to try to achieve a particular aim despite difficulties.</p>
            <p class="text-gray-600 italic">Example: Her perseverance in learning English paid off.</p>
          </div>
          <div class="flashcard-back absolute w-full h-full bg-indigo-500 text-white flex flex-col items-center justify-center p-6 rounded-lg shadow-lg">
            <h3 class="text-2xl font-semibold">Complete the sentence:</h3>
            <p class="text-white">Her _______ in learning English paid off.</p>
            <input v-model="userAnswer" type="text" placeholder="Type your answer" class="mt-4 p-2 border border-white rounded-md bg-transparent text-white" @click.stop>
            <div v-if="feedback" class="mt-4 text-xl font-bold">{{ feedback }}</div>
            <button v-if="feedback && !isCorrect" @click.stop="tryAgain" class="mt-4 px-6 py-2 bg-white text-indigo-500 font-bold rounded-full transition-transform hover:translate-y-[-3px]">Try Again</button>
            <button v-else @click.stop="checkAnswer" class="mt-4 px-6 py-2 bg-white text-indigo-500 font-bold rounded-full transition-transform hover:translate-y-[-3px]">Submit</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-center py-20">
      <h2 class="text-3xl font-bold mb-5">Ready to Start Learning?</h2>
      <p class="text-xl max-w-2xl mx-auto">Join thousands of learners improving their English skills</p>
      <a href="#" class="cta-button inline-block px-6 py-3 bg-white text-indigo-500 font-bold rounded-full mt-10 transition-transform hover:translate-y-[-3px]">Get Started Now</a>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFlipped: false,
      userAnswer: '',
      feedback: '',
      isCorrect: false
    };
  },
  methods: {
    flipCard() {
      if (!this.isFlipped) {
        this.isFlipped = true;
      }
    },
    checkAnswer() {
      const correctAnswer = 'perseverance';
      if (this.userAnswer.toLowerCase().trim() === correctAnswer) {
        this.feedback = 'Correct! Well done!';
        this.isCorrect = true;
      } else {
        this.feedback = 'Incorrect. Try again.';
        this.isCorrect = false;
      }
    },
    tryAgain() {
      this.userAnswer = '';
      this.feedback = '';
      this.isCorrect = false;
      this.isFlipped = false;
    }
  }
}
</script>

<style scoped>
.flashcard-inner {
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.flashcard-front, .flashcard-back {
  backface-visibility: hidden;
}

.flashcard-back {
  transform: rotateY(180deg);
}
</style>
