<template>
  <footer class="bg-gray-800">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="col-span-1 md:col-span-2">
          <img class="h-8 w-auto" src="@/assets/logo-white.svg" alt="Logo" />
          <p class="mt-4 text-gray-300">
            {{ $t('footer_description') }}
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-white font-semibold mb-4">
            {{ $t('quick_links') }}
          </h3>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/about"
                class="text-gray-300 hover:text-white transition"
              >
                {{ $t('about_us') }}
              </router-link>
            </li>
            <li>
              <router-link
                to="/features"
                class="text-gray-300 hover:text-white transition"
              >
                {{ $t('features') }}
              </router-link>
            </li>
            <li>
              <router-link
                to="/pricing"
                class="text-gray-300 hover:text-white transition"
              >
                {{ $t('pricing') }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-white font-semibold mb-4">
            {{ $t('contact_us') }}
          </h3>
          <ul class="space-y-2">
            <li class="text-gray-300">
              <font-awesome-icon icon="envelope" class="h-5 w-5 inline mr-2" />
              support@example.com
            </li>
            <li class="text-gray-300">
              <font-awesome-icon icon="phone" class="h-5 w-5 inline mr-2" />
              +1 (555) 123-4567
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-8 border-t border-gray-700 pt-8">
        <p class="text-center text-gray-400">
          © {{ new Date().getFullYear() }} Your Company. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>
