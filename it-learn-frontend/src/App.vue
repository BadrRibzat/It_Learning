<template>
  <DefaultLayout>
    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>
  </DefaultLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DefaultLayout from './components/layout/DefaultLayout.vue';
import './assets/main.css';
import './style.css';

export default defineComponent({
  name: 'App',
  components: {
    DefaultLayout,
  },
});
</script>
