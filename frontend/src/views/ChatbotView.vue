<template>
  <div class="chatbot-view">
    <HeaderComponent />
    <SidebarComponent />
    <ChatbotInterfaceComponent />
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
import ChatbotInterfaceComponent from '../components/ChatbotInterfaceComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';

export default {
  name: 'ChatbotView',
  components: {
    HeaderComponent,
    SidebarComponent,
    ChatbotInterfaceComponent,
    FooterComponent,
  },
};
</script>

<style scoped>
.chatbot-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
