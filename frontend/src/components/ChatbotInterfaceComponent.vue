<template>
  <div class="chatbot-interface">
    <div class="chat-header">
      <h3>Chatbot</h3>
      <button @click="closeChatbot">Close</button>
    </div>
    <div class="chat-messages" ref="chatMessages">
      <div v-for="(message, index) in chatHistory" :key="index" :class="message.sender">
        <p>{{ message.content }}</p>
      </div>
    </div>
    <div class="chat-input">
      <input v-model="inputText" @keyup.enter="sendMessage" placeholder="Type a message..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ChatbotInterfaceComponent',
  data() {
    return {
      inputText: '',
    };
  },
  computed: {
    ...mapGetters(['chatHistory']),
  },
  methods: {
    ...mapActions(['sendMessage']),
    async handleSendMessage() {
      if (this.inputText.trim() === '') return;
      await this.sendMessage(this.inputText);
      this.inputText = '';
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    closeChatbot() {
      this.$emit('close');
    },
    scrollToBottom() {
      const chatMessages = this.$refs.chatMessages;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    },
  },
  watch: {
    chatHistory() {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
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
  height: 400px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.chat-header {
  background-color: #42b983;
  color: white;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
}

.chat-input {
  display: flex;
  padding: 0.5rem;
  border-top: 1px solid #ccc;
}

.chat-input input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-left: 0.5rem;
}

button:hover {
  background-color: #35495e;
}

.user {
  text-align: right;
}

.bot {
  text-align: left;
}

.user p, .bot p {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  max-width: 80%;
}

.user p {
  background-color: #42b983;
  color: white;
}

.bot p {
  background-color: #f1f1f1;
}
</style>
