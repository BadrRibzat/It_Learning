<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">{{ $t('levels.title') }}</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <BaseCard v-for="level in levels" :key="level.id" class="p-4">
        <h2 class="text-xl font-bold mb-2">{{ level.name }}</h2>
        <BaseButton
          @click="handleLevelClick(level)"
          :class="{
            'opacity-50 cursor-not-allowed':
              level.name !== 'Beginner' && !userCanAccessLevel(level),
          }"
          :disabled="level.name !== 'Beginner' && !userCanAccessLevel(level)"
        >
          {{ level.name === 'Beginner' ? $t('levels.start') : $t('levels.takeTest') }}
        </BaseButton>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import { key } from '@/store';
import { Level } from '@/store/modules/levels';

const router = useRouter();
const store = useStore(key);
const levels = ref<Level[]>([]);

const userLevel = computed(() => store.state.auth.user?.level || 1);

onMounted(async () => {
  try {
    await store.dispatch('levels/fetchLevels');
    levels.value = store.state.levels.levels;
  } catch (error) {
    console.error('Error fetching levels:', error);
  }
});

const userCanAccessLevel = (level: Level) => {
  return userLevel.value >= level.level_order;
};

const handleLevelClick = (level: Level) => {
  if (level.name === 'Beginner') {
    router.push({ name: 'lessons', params: { levelId: level.id } });
  } else if (userCanAccessLevel(level)) {
    router.push({ name: 'lessons', params: { levelId: level.id } });
  } else {
    router.push({ name: 'levelTest', params: { levelId: level.id } });
  }
};
</script>
