<template>
  <div class="about p-8">
    <h1 class="text-4xl font-bold mb-8">About Us</h1>

    <!-- Introduction Section -->
    <section class="mb-12">
      <h2 class="text-3xl font-semibold mb-4">Our Mission</h2>
      <p class="text-lg">
        At FlashLearn, our mission is to make learning English fun, interactive, and effective. We believe that mastering a new language should be an enjoyable journey, and our platform is designed to make that journey as smooth and rewarding as possible.
      </p>
    </section>

    <!-- Flashcards System Section -->
    <section class="mb-12">
      <h2 class="text-3xl font-semibold mb-4">Interactive Flashcards</h2>
      <div class="flex items-center">
        <div class="w-1/2 pr-8">
          <p class="text-lg">
            Our interactive flashcards are at the heart of our learning system. Each flashcard presents a word or phrase, along with its definition and usage examples. Users can flip the cards to test their knowledge and receive instant feedback.
          </p>
          <p class="text-lg mt-4">
            The flashcards are designed to be engaging and easy to use, making it simple for learners to reinforce their understanding of new vocabulary and concepts.
          </p>
        </div>
        <div class="w-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="w-full h-auto">
            <!-- Add your SVG illustration here -->
            <circle cx="100" cy="100" r="80" fill="#6366f1" />
            <text x="100" y="120" text-anchor="middle" fill="white" font-size="20" font-family="Arial">Flashcards</text>
          </svg>
        </div>
      </div>
    </section>

    <!-- Real-Time Progress Tracking Section -->
    <section class="mb-12">
      <h2 class="text-3xl font-semibold mb-4">Real-Time Progress Tracking</h2>
      <div class="flex items-center">
        <div class="w-1/2 pr-8">
          <p class="text-lg">
            We understand the importance of tracking progress to stay motivated and focused. Our platform provides real-time progress tracking, allowing users to see their improvement over time.
          </p>
          <p class="text-lg mt-4">
            Detailed analytics and reports help users identify areas where they need more practice and celebrate their achievements as they advance through the lessons.
          </p>
        </div>
        <div class="w-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="w-full h-auto">
            <!-- Add your SVG illustration here -->
            <rect x="20" y="20" width="160" height="160" fill="#8b5cf6" />
            <text x="100" y="120" text-anchor="middle" fill="white" font-size="20" font-family="Arial">Progress</text>
          </svg>
        </div>
      </div>
    </section>

    <!-- Challenges and Quizzes Section -->
    <section class="mb-12">
      <h2 class="text-3xl font-semibold mb-4">Challenges and Quizzes</h2>
      <div class="flex items-center">
        <div class="w-1/2 pr-8">
          <p class="text-lg">
            Each lesson is designed to challenge users with interactive quizzes that test their understanding and retention of the material. These quizzes are an essential part of the learning process, helping users solidify their knowledge.
          </p>
          <p class="text-lg mt-4">
            After completing each level, users must pass a level test with a score of at least 80% to unlock the next level. This ensures that users are well-prepared before moving on to more advanced content.
          </p>
        </div>
        <div class="w-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="w-full h-auto">
            <!-- Add your SVG illustration here -->
            <polygon points="100,20 180,180 20,180" fill="#4c51bf" />
            <text x="100" y="120" text-anchor="middle" fill="white" font-size="20" font-family="Arial">Challenges</text>
          </svg>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="text-center">
      <h2 class="text-3xl font-semibold mb-4">Ready to Start Learning?</h2>
      <p class="text-lg mb-8">Join thousands of learners improving their English skills with FlashLearn.</p>
      <a href="#" class="cta-button inline-block px-6 py-3 bg-indigo-500 text-white font-bold rounded-full transition-transform hover:translate-y-[-3px]">Get Started Now</a>
    </section>
  </div>
</template>

<script>
export default {
  // Component logic can be added here if needed
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
