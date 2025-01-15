<template>
  <div class="contact">
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <p class="text-lg text-gray-600 leading-relaxed text-center mb-12">
          Have questions or feedback? We'd love to hear from you! Reach out to us
          using the form below, and we'll get back to you as soon as possible.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Contact Form -->
          <div class="card">
            <form @submit.prevent="submitForm">
              <div class="mb-4">
                <label for="name" class="block text-gray-700 font-bold mb-2"
                  >Your Name</label
                >
                <input
                  type="text"
                  id="name"
                  v-model="form.name"
                  required
                  class="border border-gray-400 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-primary"
                />
              </div>
              <div class="mb-4">
                <label for="email" class="block text-gray-700 font-bold mb-2"
                  >Your Email</label
                >
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  required
                  class="border border-gray-400 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-primary"
                />
              </div>
              <div class="mb-4">
                <label for="message" class="block text-gray-700 font-bold mb-2"
                  >Your Message</label
                >
                <textarea
                  id="message"
                  v-model="form.message"
                  required
                  rows="5"
                  class="border border-gray-400 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-primary"
                ></textarea>
              </div>
              <button
                type="submit"
                class="btn-primary px-6 py-2 text-lg"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
            </form>
          </div>

          <!-- Contact Information -->
          <div class="card">
            <h2 class="text-2xl font-bold mb-4">Our Contact Information</h2>
            <ul class="space-y-4">
              <li>
                <i class="fas fa-envelope text-primary mr-2"></i>
                <a href="mailto:support@learnenglish.com" class="text-gray-600 hover:text-primary"
                  >support@learnenglish.com</a
                >
              </li>
              <li>
                <i class="fas fa-phone text-primary mr-2"></i>
                <a href="tel:+1234567890" class="text-gray-600 hover:text-primary"
                  >+1 234 567 890</a
                >
              </li>
              <li>
                <i class="fas fa-map-marker-alt text-primary mr-2"></i>
                <span class="text-gray-600">123 Learning Street, Education City</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'ContactView',
  setup() {
    const form = reactive({
      name: '',
      email: '',
      message: ''
    })
    const isSubmitting = ref(false)

    const submitForm = async () => {
      isSubmitting.value = true

      // Simulate sending form data (replace with actual API call)
      try {
        // Example using a placeholder API endpoint:
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        })

        if (response.ok) {
          // Handle success (e.g., show a success message)
          alert('Message sent successfully!')
          form.name = ''
          form.email = ''
          form.message = ''
        } else {
          // Handle errors (e.g., show an error message)
          throw new Error('Failed to send message')
        }
      } catch (error) {
        console.error(error)
        alert('An error occurred while sending the message.')
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      form,
      isSubmitting,
      submitForm
    }
  }
}
</script>
