<template>
  <footer class="bg-gray-800 text-white relative">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-lg font-bold mb-4">Learn English</h3>
          <p class="text-gray-400">
            Enhance your English language skills with our interactive learning
            platform.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.path">
              <router-link
                :to="link.path"
                class="text-gray-400 hover:text-white transition-colors"
              >
                <i :class="link.icon" class="mr-2"></i>
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-4">Features</h3>
          <ul class="space-y-2">
            <li v-for="feature in features" :key="feature.name">
              <span class="text-gray-400">
                <i :class="feature.icon" class="mr-2"></i>
                {{ feature.name }}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-4">Contact Us</h3>
          <ul class="space-y-2 text-gray-400">
            <li>
              <i class="fas fa-envelope mr-2"></i>
              support@learnenglish.com
            </li>
            <li>
              <i class="fas fa-phone mr-2"></i>
              +1 234 567 890
            </li>
            <li>
              <i class="fas fa-map-marker-alt mr-2"></i>
              123 Learning Street, Education City
            </li>
          </ul>
        </div>
      </div>

      <div
        class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400"
      >
        <p>© {{ currentYear }} Learn English. All rights reserved.</p>
      </div>
    </div>
    <div class="absolute bottom-4 right-4">
      <ChatBot />
    </div>
  </footer>
</template>

<script>
import ChatBot from "@/components/common/ChatBot.vue";

export default {
  name: "Footer",
  components: {
    ChatBot,
  },
  data() {
    return {
      quickLinks: [
        { name: "Home", path: "/", icon: "fas fa-home" },
        { name: "About", path: "/about", icon: "fas fa-info-circle" },
        { name: "Features", path: "/features", icon: "fas fa-star" },
        { name: "Contact", path: "/contact", icon: "fas fa-envelope" },
      ],
      features: [
        { name: "Interactive Flashcards", icon: "fas fa-cards-blank" },
        { name: "Progress Tracking", icon: "fas fa-chart-line" },
        { name: "Personalized Learning", icon: "fas fa-user-graduate" },
        { name: "Real-time Feedback", icon: "fas fa-comments" },
      ],
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
};
</script>
