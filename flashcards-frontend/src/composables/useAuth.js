import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export function useAuth() {
  const store = useStore();
  const router = useRouter();

  const isAuthenticated = computed(() => store.state.auth.isAuthenticated);
  const user = computed(() => store.state.auth.user);

  const login = async (credentials) => {
    try {
      await store.dispatch('auth/login', credentials);
      const redirect = router.currentRoute.value.query.redirect || '/dashboard';
      router.push(redirect);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await store.dispatch('auth/register', userData);
      router.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await store.dispatch('auth/logout');
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return {
    isAuthenticated,
    user,
    login,
    register,
    logout,
  };
}
