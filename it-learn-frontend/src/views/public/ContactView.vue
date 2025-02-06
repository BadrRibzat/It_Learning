<template>
  <div class="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact Us</h2>
      <p class="mt-2 text-lg leading-8 text-gray-600">
        Have questions about our platform? We're here to help!
      </p>
    </div>
    <form @submit.prevent="handleSubmit" class="mx-auto mt-16 max-w-xl sm:mt-20">
      <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <div>
          <label for="firstName" class="block text-sm font-semibold leading-6 text-gray-900">First name</label>
          <div class="mt-2.5">
            <input
              v-model="formData.firstName"
              type="text"
              name="firstName"
              id="firstName"
              autocomplete="given-name"
              class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            >
          </div>
        </div>
        <div>
          <label for="lastName" class="block text-sm font-semibold leading-6 text-gray-900">Last name</label>
          <div class="mt-2.5">
            <input
              v-model="formData.lastName"
              type="text"
              name="lastName"
              id="lastName"
              autocomplete="family-name"
              class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            >
          </div>
        </div>
        <div class="sm:col-span-2">
          <label for="email" class="block text-sm font-semibold leading-6 text-gray-900">Email</label>
          <div class="mt-2.5">
            <input
              v-model="formData.email"
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            >
          </div>
        </div>
        <div class="sm:col-span-2">
          <label for="subject" class="block text-sm font-semibold leading-6 text-gray-900">Subject</label>
          <div class="mt-2.5">
            <input
              v-model="formData.subject"
              type="text"
              name="subject"
              id="subject"
              class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            >
          </div>
        </div>
        <div class="sm:col-span-2">
          <label for="message" class="block text-sm font-semibold leading-6 text-gray-900">Message</label>
          <div class="mt-2.5">
            <textarea
              v-model="formData.message"
              name="message"
              id="message"
              rows="4"
              class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="mt-10">
        <button
          type="submit"
          :disabled="loading"
          class="block w-full rounded-md bg-primary-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Sending...</span>
          <span v-else>Send Message</span>
        </button>
      </div>
    </form>

    <!-- Additional Contact Information -->
    <div class="mx-auto mt-16 max-w-xl sm:mt-20">
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div class="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
          <svg class="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">

            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-4 text-base font-semibold text-gray-900">Email Support</h3>
          <p class="mt-2 text-sm text-gray-600">support@it-learning.com</p>
          <p class="mt-1 text-sm text-gray-600">Mon-Fri, 9AM-6PM UTC</p>
        </div>

        <div class="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
          <svg class="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-4 text-base font-semibold text-gray-900">FAQ</h3>
          <p class="mt-2 text-sm text-gray-600">Visit our FAQ section</p>
          <RouterLink to="/faq" class="mt-2 text-sm text-primary-600 hover:text-primary-500">
            View FAQ →
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { RouterLink } from 'vue-router';

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export default defineComponent({
  name: 'ContactView',
  components: {
    RouterLink,
  },
  setup() {
    const toast = useToast();
    const loading = ref(false);
    const formData = reactive<ContactForm>({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
    });

    const handleSubmit = async () => {
      loading.value = true;
      try {
        // Validate form
        if (!formData.email || !formData.message) {
          throw new Error('Please fill in all required fields');
        }

        // Here you would typically make an API call to send the message
        // For now, we'll just show a success message
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

        toast.success('Message sent successfully! We\'ll get back to you soon.');
        
        // Reset form
        formData.firstName = '';
        formData.lastName = '';
        formData.email = '';
        formData.subject = '';
        formData.message = '';
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to send message');
      } finally {
        loading.value = false;
      }
    };

    return {
      formData,
      loading,
      handleSubmit,
    };
  },
});
</script>
