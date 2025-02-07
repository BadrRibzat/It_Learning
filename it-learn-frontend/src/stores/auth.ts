import { defineStore } from 'pinia';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';
import AuthService from '../services/auth.service';
import { useNotificationStore } from './notification';

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
      const notificationStore = useNotificationStore();
      this.loading = true;
      try {
        const response = await AuthService.login(credentials);
        this.setUser(response.user);
        this.setToken(response.access_token);
        notificationStore.success('Welcome back! Redirecting to your learning space...');
        return true;
      } catch (error) {
        notificationStore.error('Login failed. Please check your credentials.');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(userData: RegisterRequest) {
      const notificationStore = useNotificationStore();
      this.loading = true;
      try {
        const response = await AuthService.register(userData);
        this.isAuthenticated = true;
        this.user = response.user || null;
        notificationStore.success('Successfully registered');
        return response;
      } catch (error: any) {
        const message = error.response?.data?.error || 'Registration failed';
        notificationStore.error(message);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      const notificationStore = useNotificationStore();
      try {
        await AuthService.logout();
        this.clearAuth();
        notificationStore.info('You have been successfully logged out.');
      } catch (error) {
        notificationStore.error('There was a problem logging out.');
        throw error;
      }
    },

    setUser(user: User | null) {
      this.user = user;
    },

    setToken(token: string) {
      localStorage.setItem('access_token', token);
      this.isAuthenticated = !!token;
    },

    clearAuth() {
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('access_token');
    },
  },
});
