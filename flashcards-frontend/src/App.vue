<template>
  <div id="app" :dir="currentLanguageDir">
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" class="flex-shrink-0">
              <img class="h-8 w-auto" src="@/assets/logo.svg" alt="Logo" />
            </router-link>

            <!-- Navigation Links -->
            <div class="hidden md:flex ml-10 space-x-4">
              <router-link 
                to="/" 
                class="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {{ $t('home') }}
              </router-link>
              <router-link 
                to="/features" 
                class="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {{ $t('features') }}
              </router-link>
              <router-link 
                to="/pricing" 
                class="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {{ $t('pricing') }}
              </router-link>
            </div>
          </div>

          <!-- Right side navigation -->
          <div class="flex items-center space-x-4">
            <!-- Language Switcher -->
            <div class="relative" v-click-outside="closeLanguageMenu">
              <button 
                @click="toggleLanguageMenu"
                class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <span class="flag-icon" :class="`flag-icon-${currentLanguage.code}`"></span>
                <span>{{ currentLanguage.name }}</span>
                <font-awesome-icon icon="chevron-down" class="h-4 w-4" />
              </button>

              <!-- Language Menu -->
              <div 
                v-if="showLanguageMenu"
                class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
              >
                <div class="py-1">
                  <button
                    v-for="(lang, code) in SUPPORTED_LANGUAGES"
                    :key="code"
                    @click="changeLanguage(code)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :class="{ 'bg-gray-50': currentLocale === code }"
                  >
                    <span class="flag-icon mr-2" :class="`flag-icon-${lang.code}`"></span>
                    {{ lang.name }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Auth Navigation -->
            <template v-if="!isAuthenticated">
              <router-link 
                to="/auth/login" 
                class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                {{ $t('login') }}
              </router-link>
              <router-link 
                to="/auth/register" 
                class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md"
              >
                {{ $t('register') }}
              </router-link>
            </template>

            <!-- User Menu -->
            <div v-else class="relative" v-click-outside="closeUserMenu">
              <button 
                @click="toggleUserMenu"
                class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <img 
                  :src="userProfilePicture || '/default-avatar.png'"
                  class="h-8 w-8 rounded-full object-cover"
                  alt="Profile"
                />
                <span>{{ username }}</span>
                <font-awesome-icon icon="chevron-down" class="h-4 w-4" />
              </button>

              <!-- User Dropdown Menu -->
              <div 
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
              >
                <div class="py-1">
                  <router-link 
                    to="/dashboard"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {{ $t('dashboard') }}
                  </router-link>
                  <router-link 
                    to="/dashboard/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {{ $t('profile') }}
                  </router-link>
                  <button 
                    @click="logout"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {{ $t('logout') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Toast Notifications -->
    <notifications position="bottom right" />

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
    </div>
  </div>
</template>

<script setup>
import Notification from '@/components/global/Notification.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SUPPORTED_LANGUAGES } from '@/i18n';

const store = useStore();
const router = useRouter();
const { locale, t } = useI18n();

// State
const showLanguageMenu = ref(false);
const showUserMenu = ref(false);
const isLoading = ref(false);

// Computed
const isAuthenticated = computed(() => store.state.auth.isAuthenticated);
const username = computed(() => store.state.auth.user?.username);
const userProfilePicture = computed(() => store.state.profile.profile?.profilePicture);
const currentLocale = computed(() => locale.value);
const currentLanguage = computed(() => SUPPORTED_LANGUAGES[currentLocale.value]);
const currentLanguageDir = computed(() => SUPPORTED_LANGUAGES[currentLocale.value].dir);

// Methods
const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value;
  showUserMenu.value = false;
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  showLanguageMenu.value = false;
};

const closeLanguageMenu = (event) => {
  if (event) {
    showLanguageMenu.value = false;
  }
};

const closeUserMenu = (event) => {
  if (event) {
    showUserMenu.value = false;
  }
};

const changeLanguage = (langCode) => {
  locale.value = langCode;
  localStorage.setItem('userLanguage', langCode);
  document.documentElement.dir = SUPPORTED_LANGUAGES[langCode].dir;
  showLanguageMenu.value = false;
};

const logout = async () => {
  try {
    isLoading.value = true;
    await store.dispatch('auth/logout');
    router.push('/');
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  // Set initial direction based on language
  document.documentElement.dir = currentLanguageDir.value;
  
  // Load user profile if authenticated
  if (isAuthenticated.value) {
    store.dispatch('profile/fetchProfile');
  }
});

// Watch for route changes to handle loading state
watch(
  () => router.currentRoute.value,
  () => {
    isLoading.value = false;
  }
);

// Watch for auth state changes
watch(
  () => isAuthenticated.value,
  (newValue) => {
    if (newValue) {
      store.dispatch('profile/fetchProfile');
    }
  }
);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Adding for RTL languages */
[dir="rtl"] .ml-10 {
  margin-left: 0;
  margin-right: 2.5rem;
}

[dir="rtl"] .space-x-4 > * + * {
  margin-left: 0;
  margin-right: 1rem;
}
</style>
