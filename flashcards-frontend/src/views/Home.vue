<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img class="h-8 w-auto" src="@/assets/logo.svg" alt="Logo" />
            </div>
          </div>
          <div class="flex items-center">
            <router-link
              to="/auth/login"
              class="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
            >
              {{ $t('login') }}
            </router-link>
            <router-link
              to="/auth/register"
              class="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary bg-white border-primary hover:bg-gray-50"
            >
              {{ $t('register') }}
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <HeroSection />

    <!-- Interactive Demo -->
    <DemoFlashcard />

    <!-- Features -->
    <FeatureSection />

    <!-- Footer -->
    <Footer />

    <!-- Chatbot -->
    <ChatBot />
  </div>
</template>

<script setup>
import HeroSection from '@/components/home/HeroSection.vue'
import DemoFlashcard from '@/components/home/DemoFlashcard.vue'
import FeatureSection from '@/components/home/FeatureSection.vue'
import Footer from '@/components/common/Footer.vue'
import ChatBot from '@/components/common/ChatBot.vue'
</script>
