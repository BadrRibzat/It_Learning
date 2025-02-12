<template>
  <footer class="bg-white mt-auto">
    <div class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
      <div class="flex justify-center space-x-6 md:order-2">
        <!-- Social Links -->
        <a
          v-for="item in socialLinks"
          :key="item.name"
          :href="item.href"
          :aria-label="item.name"
          class="text-gray-400 hover:text-gray-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          <component :is="item.icon" class="h-6 w-6" aria-hidden="true" />
        </a>
      </div>
      
      <!-- Copyright and Links -->
      <div class="mt-8 md:order-1 md:mt-0">
        <div class="flex justify-center space-x-6 mb-4">
          <RouterLink
            v-for="item in footerLinks"
            :key="item.name"
            :to="item.href"
            class="text-sm leading-6 text-gray-600 hover:text-gray-900"
          >
            {{ item.name }}
          </RouterLink>
        </div>
        <p class="text-center text-xs leading-5 text-gray-500">
          &copy; {{ currentYear }} IT Learning. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import {
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline';

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/yourusername',
    icon: CodeBracketIcon,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/yourusername',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/yourusername',
    icon: UserCircleIcon,
  },
];

const footerLinks = [
  { name: 'About', href: '/about' },
  { name: 'Privacy', href: '/privacy' },
  { name: 'Terms', href: '/terms' },
  { name: 'Contact', href: '/contact' },
];

export default defineComponent({
  name: 'AppFooter',
  components: {
    CodeBracketIcon,
    ChatBubbleLeftRightIcon,
    UserCircleIcon,
  },
  setup() {
    const currentYear = computed(() => new Date().getFullYear());

    return {
      currentYear,
      socialLinks,
      footerLinks,
    };
  },
});
</script>
