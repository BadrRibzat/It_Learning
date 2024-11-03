<template>
  <footer class="footer">
    <p>&copy; 2024 Learn English. All rights reserved.</p>
    <div class="chatbot-icon" @click="openChatbot">
      <span>Chat</span>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
  methods: {
    openChatbot() {
      // Logic to open chatbot interface
      console.log('Open chatbot');
    },
  },
};
</script>

<style scoped>
.footer {
  background-color: #35495e;
  color: white;
  padding: 1rem;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
}

.chatbot-icon {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background-color: #42b983;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50%;
  cursor: pointer;
}

.chatbot-icon:hover {
  background-color: #35495e;
}
</style>
