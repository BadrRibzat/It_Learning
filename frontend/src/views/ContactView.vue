<template>
  <div class="contact">
    <h1>Contact Us</h1>
    <form @submit.prevent="submitContactForm">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="message">Message:</label>
        <textarea id="message" v-model="message" required></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ContactView',
  data() {
    return {
      name: '',
      email: '',
      message: '',
    };
  },
  methods: {
    submitContactForm() {
      // Logic to submit contact form
      console.log('Contact form submitted:', {
        name: this.name,
        email: this.email,
        message: this.message,
      });
      alert('Thank you for contacting us!');
    },
  },
};
</script>

<style scoped>
.contact {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
}

form {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 2rem;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

label {
  margin-bottom: 0.5rem;
}

input, textarea {
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 3px;
}

textarea {
  resize: vertical;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #35495e;
}
</style>
