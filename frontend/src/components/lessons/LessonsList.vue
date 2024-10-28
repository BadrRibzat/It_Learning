<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ title || $t('lessons.availableLessons') }}
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          {{ subtitle || $t('lessons.exploreAndLearn') }}
        </p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <select
            v-model="filters.difficulty"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="">{{ $t('lessons.allLevels') }}</option>
            <option value="beginner">{{ $t('lessons.difficulty.beginner') }}</option>
            <option value="intermediate">{{ $t('lessons.difficulty.intermediate') }}</option>
            <option value="advanced">{{ $t('lessons.difficulty.advanced') }}</option>
          </select>
        </div>
        <div class="relative">
          <select
            v-model="filters.category"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="">{{ $t('lessons.allCategories') }}</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="relative">
          <select
            v-model="sortBy"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="newest">{{ $t('lessons.sort.newest') }}</option>
            <option value="rating">{{ $t('lessons.sort.rating') }}</option>
            <option value="popular">{{ $t('lessons.sort.popular') }}</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <font-awesome-icon
        :icon="['fas', 'circle-notch']"
        class="w-8 h-8 text-primary animate-spin"
      />
    </div>

    <div v-else-if="filteredLessons.length === 0" class="text-center py-12">
      <font-awesome-icon
        :icon="['fas', 'search']"
        class="w-12 h-12 text-gray-400 mb-4"
      />
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ $t('lessons.noLessonsFound') }}
      </h3>
      <p class="text-gray-500">
        {{ $t('lessons.tryAdjustingFilters') }}
      </p>
    </div>

    <div
      v-else
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <LessonCard
        v-for="lesson in filteredLessons"
        :key="lesson.id"
        :lesson="lesson"
      />
    </div>

    <div
      v-if="hasMoreLessons"
      class="flex justify-center mt-8"
    >
      <button
        @click="loadMore"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-50 hover:bg-primary-100"
        :disabled="loadingMore"
      >
        <font-awesome-icon
          v-if="loadingMore"
          :icon="['fas', 'circle-notch']"
          class="w-4 h-4 mr-2 animate-spin"
        />
        {{ loadingMore ? $t('common.loading') : $t('lessons.loadMore') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import LessonCard from './LessonCard.vue';

const props = defineProps({
  title: String,
  subtitle: String,
  category: String,
  difficulty: String,
});

const store = useStore();
const loading = computed(() => store.getters['lessons/loading']);
const lessons = computed(() => store.getters['lessons/lessons']);
const categories = computed(() => store.getters['lessons/categories']);
const loadingMore = ref(false);
const page = ref(1);
const limit = 9;

const filters = ref({
  difficulty: props.difficulty || '',
  category: props.category || '',
});

const sortBy = ref('newest');

const filteredLessons = computed(() => {
  let filtered = [...lessons.value];

  if (filters.value.difficulty) {
    filtered = filtered.filter(
      (lesson) => lesson.difficulty === filters.value.difficulty
    );
  }

  if (filters.value.category) {
    filtered = filtered.filter(
      (lesson) => lesson.category === filters.value.category
    );
  }

  switch (sortBy.value) {
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'popular':
      filtered.sort((a, b) => b.enrollments - a.enrollments);
      break;
    default: // newest
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return filtered;
});

const hasMoreLessons = computed(() => {
  return lessons.value.length >= page.value * limit;
});

const loadMore = async () => {
  if (loadingMore.value) return;

  loadingMore.value = true;
  page.value++;

  try {
    await store.dispatch('lessons/fetchLessons', {
      page: page.value,
      limit,
    });
  } finally {
    loadingMore.value = false;
  }
};

// Initial load
store.dispatch('lessons/fetchLessons', { page: 1, limit });
store.dispatch('lessons/fetchCategories');
</script>
