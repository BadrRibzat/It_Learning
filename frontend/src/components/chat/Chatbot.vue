<template>
  <div class="chatbot">
    <input v-model="input" type="text" placeholder="Ask me anything" />
    <button @click="handleSubmit">Send</button>
    <p>{{ response }}</p>
  </div>
</template>

<script>
import chatService from '../../api/services/chat';

export default {
  data() {
    return {
      input: '',
      response: '',
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await chatService.getResponse(this.input);
        this.response = response.data.response_text;
      } catch (error) {
        console.error('Chatbot response failed:', error);
      }
    },
  },
};
</script>

<style scoped>
.chatbot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
