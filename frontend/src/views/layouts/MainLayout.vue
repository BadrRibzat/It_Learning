<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-xl font-bold text-primary">{{ $t('app.title') }}</router-link>
            </div>
            <div class="hidden md:ml-6 md:flex md:items-center">
              <router-link to="/dashboard" class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">{{ $t('nav.dashboard') }}</router-link>
              <router-link to="/levels" class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">{{ $t('nav.levels') }}</router-link>
              <router-link to="/lessons" class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">{{ $t('nav.lessons') }}</router-link>
              <router-link to="/notes" class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">{{ $t('nav.notes') }}</router-link>
              <router-link to="/profile" class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">{{ $t('nav.profile') }}</router-link>
            </div>
          </div>
          <div class="flex items-center">
            <LanguageSwitcher />
            <div class="flex-shrink-0 ml-4">
              <router-link to="/auth/login" v-if="!isAuthenticated" class="text-sm font-medium text-gray-500 hover:text-gray-900">{{ $t('auth.login.link') }}</router-link>
              <router-link to="/auth/register" v-if="!isAuthenticated" class="ml-4 text-sm font-medium text-primary hover:text-primary-dark">{{ $t('auth.register.link') }}</router-link>
              <button v-else @click="logout" class="text-sm font-medium text-gray-500 hover:text-gray-900">{{ $t('auth.logout') }}</button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main class="flex-grow">
      <router-view />
    </main>
    <footer class="bg-white">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <p class="text-base text-gray-400">
          &copy; 2023 {{ $t('app.title') }}. {{ $t('app.allRightsReserved') }}
        </p>
        <button @click="toggleChatbot" class="text-gray-400 hover:text-gray-600">
          <font-awesome-icon :icon="['fas', 'comments']" size="lg" />
        </button>
      </div>
    </footer>
    <Chatbot v-if="showChatbot" @close="toggleChatbot" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Chatbot from '@/components/chat/Chatbot.vue';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import { useNotification } from '@/composables/useNotification';

const store = useStore();
const router = useRouter();
const { show } = useNotification();
const { t } = useI18n();

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
const showChatbot = ref(false);

const logout = async () => {
  if (isAuthenticated.value) {
    try {
      await store.dispatch('auth/logout');
      show(t('auth.logout.success'), 'success');
      router.push('/auth/login');
    } catch (error) {
      show(t('auth.logout.error'), 'error');
    }
  } else {
    router.push('/auth/login');
  }
};

const toggleChatbot = () => {
  showChatbot.value = !showChatbot.value;
};
</script>
