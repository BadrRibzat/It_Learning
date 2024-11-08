<!-- src/views/Home.vue -->
<template>
  <div class="min-h-screen">
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
