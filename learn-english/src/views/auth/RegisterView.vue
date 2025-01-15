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

            <button type="submit" class="btn-primary w-full px-4 py-2 text-lg" :disabled="isLoading">
              {{ isLoading ? 'Registering...' : 'Register' }}
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
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'RegisterView',
  setup() {
    const store = useStore()
    const router = useRouter()
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const password_confirmation = ref('')
    const error = ref(null)
    const isLoading = ref(false)

    const register = async () => {
      isLoading.value = true
      error.value = null

      if (password.value !== password_confirmation.value) {
        error.value = 'Passwords do not match'
        isLoading.value = false
        return
      }

      try {
        await store.dispatch('auth/register', {
          username: username.value,
          email: email.value,
          password: password.value,
          password_confirmation: password_confirmation.value
        })
        router.push('/auth/login') // Redirect to login after successful registration
      } catch (err) {
        error.value = err.message || 'Registration failed'
      } finally {
        isLoading.value = false
      }
    }

    return {
      username,
      email,
      password,
      password_confirmation,
      error,
      isLoading,
      register
    }
  }
}
</script>
