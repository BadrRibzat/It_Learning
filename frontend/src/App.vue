<template>
  <div id="app">
    <HeaderComponent v-if="!isAuthenticated" />
    <SidebarComponent v-if="isAuthenticated" />
    <router-view />
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue';
import SidebarComponent from './components/SidebarComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
};
</script>
