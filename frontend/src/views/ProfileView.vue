<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">{{ $t('profile.title') }}</h1>
    <div v-if="loading">{{ $t('common.loading') }}</div>
    <div v-else-if="error">{{ error }}</div>
    <BaseCard v-else-if="user">
      <h2 class="text-xl font-bold">{{ user.email }}</h2>
      <p>{{ $t('profile.welcomeMessage') }}</p>
      <p>{{ $t('profile.level', { level: user.level }) }}</p>
      <p>{{ $t('profile.points', { points: user.points }) }}</p>
    </BaseCard>
    <p v-else>{{ $t('profile.noUserData') }}</p>

    <NotesManager class="mt-8" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import BaseCard from '@/components/base/BaseCard.vue';
import NotesManager from '@/components/NotesManager.vue';
import { key } from '@/store';
import { User } from '@/types/api';

const store = useStore(key);
const loading = ref(false);
const error = ref('');

const user = computed(() => store.state.auth.user as User | null);

onMounted(async () => {
  loading.value = true;
  try {
    await store.dispatch('auth/fetchUserProfile');
  } catch (err) {
    console.error('Error fetching user profile:', err);
    error.value = 'Failed to load user profile. Please try again.';
  } finally {
    loading.value = false;
  }
});
</script>
