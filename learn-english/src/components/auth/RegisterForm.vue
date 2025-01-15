<template>
  <div class="register">
    <div class="flex justify-center items-center py-16">
      <div class="w-full max-w-md">
        <div class="card">
          <h1 class="text-3xl font-bold text-center mb-6">Register</h1>

          <form @submit.prevent="register">
            <div class="mb-4">
              <label for="username" class="block text-gray-700 font-bold mb-2">Username</label>
              <input
                type="text"
                id="username"
                v-model="username"
                required
                class="border border-gray-400 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-primary"
              />
            </div>

            <div class="mb-4">
              <label for="email" class="block text-gray-700 font-bold mb-2">Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                required
                class="border border-gray-400 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-primary"
              />
            </div>

            <div class="mb-4">
              <label for="password" class="block text-gray-700 font-bold mb-2">Password</label>
              <input
                type="password"
                id="password"
                v-model="password"
                required
                class="border border-gray-400 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-primary"
              />
            </div>

            <div class="mb-4">
              <label for="password_confirmation" class="block text-gray-700 font-bold mb-2"
                >Confirm Password</label
              >
              <input
                type="password"
                id="password_confirmation"
                v-model="password_confirmation"
                required
                class="border border-gray-400 px-4 py-2 rounded-lg w-full focus:outline-none focus:border-primary"
              />
            </div>

            <button type="submit" class="btn-primary w-full px-4 py-2 text-lg">
              Register
            </button>

            <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
          </form>

          <div class="mt-6 text-center">
            <p class="text-gray-600">
              Already have an account?
              <router-link to="/auth/login" class="text-primary hover:underline">Login</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'RegisterView',
  setup() {
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const password_confirmation = ref('')
    const error = ref(null)

    const register = async () => {
      error.value = null

      if (password.value !== password_confirmation.value) {
        error.value = 'Passwords do not match'
        return
      }

      try {
        // Simulate an API call (replace with actual API call later)
        const response = await new Promise((resolve, reject) => {
          setTimeout(() => {
            // For now, just consider registration successful
            resolve({ data: { success: true } })
          }, 1000)
        })

        if (response.data.success) {
          // Handle successful registration (e.g., redirect to login)
          console.log('Registration successful!')
          // In a real app, you would redirect using the router:
          // this.$router.push('/auth/login')
        }
      } catch (err) {
        error.value = err.message || 'Registration failed'
      }
    }

    return {
      username,
      email,
      password,
      password_confirmation,
      error,
      register
    }
  }
}
</script>
