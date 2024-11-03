<template>
  <div class="chatbot-interface">
    <div class="chat-header">
      <h3>Chatbot</h3>
      <button @click="closeChatbot">Close</button>
    </div>
    <div class="chat-messages">
      <div v-for="(message, index) in messages" :key="index" :class="message.sender">
        <p>{{ message.text }}</p>
      </div>
    </div>
    <div class="chat-input">
      <input v-model="inputText" @keyup.enter="sendMessage" placeholder="Type a message..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ChatbotInterfaceComponent',
  data() {
    return {
      inputText: '',
      messages: [],
    };
  },
  methods: {
    ...mapActions(['sendMessage']),
    async sendMessage() {
      if (this.inputText.trim() === '') return;
      this.messages.push({ sender: 'user', text: this.inputText });
      const response = await this.sendMessage(this.inputText);
      this.messages.push({ sender: 'bot', text: response });
      this.inputText = '';
    },
    closeChatbot() {
      // Logic to close chatbot interface
      console.log('Close chatbot');
    },
  },
};
</script>

<style scoped>
.chatbot-interface {
  position: fixed;
  bottom: 5rem;
  right: 1rem;
  width: 300px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.chat-header {
  background-color: #42b983;
  color: white;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header button {
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}

.chat-header button:hover {
  background-color: #ff4500;
}

.chat-messages {
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
}

.chat-messages div {
  margin: 0.5rem 0;
}

.chat-messages .user {
  text-align: right;
}

.chat-input {
  display: flex;
  padding: 0.5rem;
  border-top: 1px solid #ccc;
}

.chat-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.chat-input button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #35495e;
}
</style>
