import { defineStore } from 'pinia';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';
import AuthService from '../services/auth.service';
import { useToast } from 'vue-toastification';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: AuthService.isAuthenticated(),
    loading: false,
  }),

  actions: {
    async login(credentials: LoginRequest) {
      const toast = useToast();
      this.loading = true;
      try {
        const response = await AuthService.login(credentials);
        this.isAuthenticated = true;
        this.user = response.user || null;
        toast.success('Successfully logged in');
        return response;
      } catch (error: any) {
        const message = error.response?.data?.error || 'Login failed';
        toast.error(message);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(userData: RegisterRequest) {
      const toast = useToast();
      this.loading = true;
      try {
        const response = await AuthService.register(userData);
        this.isAuthenticated = true;
        this.user = response.user || null;
        toast.success('Successfully registered');
        return response;
      } catch (error: any) {
        const message = error.response?.data?.error || 'Registration failed';
        toast.error(message);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      const toast = useToast();
      try {
        await AuthService.logout();
        this.user = null;
        this.isAuthenticated = false;
        toast.success('Successfully logged out');
      } catch (error: any) {
        toast.error('Logout failed');
        throw error;
      }
    },
  },
});
