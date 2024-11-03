<template>
  <div class="chat-view">
    <Chatbot />
  </div>
</template>

<script>
import Chatbot from '../../components/chat/Chatbot.vue';

export default {
  components: {
    Chatbot,
  },
};
</script>

<style scoped>
.chat-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
