<template>
  <div class="login-form">
    <form @submit.prevent="login">
      <input
        type="email"
        v-model="email"
        placeholder="Email"
        required
        autocomplete="email"
      />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
        autocomplete="current-password"
      />
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
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
          console.log('Login successful!')
          this.$router.push('/profile')
        }
      } catch (err) {
        error.value = err.message || 'Invalid credentials'
        console.error('Login failed:', err)
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