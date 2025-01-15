<template>
  <div class="login">
    <div class="flex justify-center items-center py-16">
      <div class="w-full max-w-md">
        <div class="card">
          <h1 class="text-3xl font-bold text-center mb-6">Login</h1>

          <form @submit.prevent="login">
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

            <button type="submit" class="btn-primary w-full px-4 py-2 text-lg">
              Login
            </button>

            <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
          </form>

          <div class="mt-6 text-center">
            <p class="text-gray-600">
              Don't have an account?
              <router-link to="/auth/register" class="text-primary hover:underline">Register</router-link>
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
  name: 'LoginView',
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref(null)

    const login = async () => {
      error.value = null

      try {
        // Simulate an API call (replace with actual API call later)
        const response = await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (email.value === 'test@example.com' && password.value === 'password') {
              resolve({ data: { success: true } })
            } else {
              reject(new Error('Invalid credentials'))
            }
          }, 1000)
        })

        if (response.data.success) {
          // Handle successful login (e.g., redirect to dashboard)
          console.log('Login successful!')
          // In a real app, you would redirect using the router:
          // this.$router.push('/dashboard')
        }
      } catch (err) {
        error.value = err.message || 'Invalid credentials'
      }
    }

    return {
      email,
      password,
      error,
      login
    }
  }
}
</script>
