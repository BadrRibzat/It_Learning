<template>
  <nav class="bg-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <router-link to="/" class="flex items-center">
          <i class="fas fa-book-open text-2xl text-primary mr-2"></i>
          <span class="text-xl font-bold text-primary">Learn English</span>
        </router-link>

        <div class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="link in navigationLinks"
            :key="link.path"
            :to="link.path"
            class="text-gray-600 hover:text-primary transition-colors"
          >
            <i :class="link.icon" class="mr-2"></i>
            {{ link.name }}
          </router-link>
        </div>

        <div class="flex items-center space-x-4">
          <language-switcher />

          <router-link
            to="/profile"
            class="text-gray-600 hover:text-primary transition-colors"
          >
            <i class="fas fa-user mr-2"></i>
            Profile
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import LanguageSwitcher from "./LanguageSwitcher.vue";

export default {
  name: "Header",
  components: {
    LanguageSwitcher,
  },
  data() {
    return {
      navigationLinks: [
        { name: "Home", path: "/", icon: "fas fa-home" },
        { name: "About", path: "/about", icon: "fas fa-info-circle" },
        { name: "Features", path: "/features", icon: "fas fa-star" },
        { name: "Contact", path: "/contact", icon: "fas fa-envelope" },
      ],
    };
  },
};
</script>
