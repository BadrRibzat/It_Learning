import axios from 'axios';
import { NotificationService } from '@/utils/NotificationService';

// Add axios interceptor to include token in requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const BASE_URL = 'http://localhost:8000/accounts';

const AuthService = {
  // Register a new user
  async register(userData) {
    try {
      const response = await axios.post(`${BASE_URL}/register/`, userData);
      NotificationService.showSuccess('Registration successful! Please check your email for verification.');
      return response.data;
    } catch (error) {
      NotificationService.showError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await axios.post(`${BASE_URL}/login/`, credentials);
      // Store tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      NotificationService.showSuccess('Login successful!');
      return response.data;
    } catch (error) {
      NotificationService.showError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }
      
      await axios.post(`${BASE_URL}/logout/`, { refresh_token: refreshToken });
      
      // Clear tokens and headers
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      delete axios.defaults.headers.common['Authorization'];
      
      NotificationService.showSuccess('Logout successful!');
    } catch (error) {
      NotificationService.showError('Logout failed');
      throw error;
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await axios.post(`${BASE_URL}/forgot-password/`, { email });
      NotificationService.showSuccess('Password reset email sent!');
      return response.data;
    } catch (error) {
      NotificationService.showError(error.response?.data?.message || 'Failed to send reset email');
      throw error;
    }
  },

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await axios.post(`${BASE_URL}/reset-password/`, { token, new_password: newPassword });
      NotificationService.showSuccess('Password reset successful!');
      return response.data;
    } catch (error) {
      NotificationService.showError(error.response?.data?.message || 'Password reset failed');
      throw error;
    }
  },

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await axios.post(`${BASE_URL}/verify-email/`, { token });
      NotificationService.showSuccess('Email verified successfully!');
      return response.data;
    } catch (error) {
      NotificationService.showError(error.response?.data?.message || 'Email verification failed');
      throw error;
    }
  },

  // Resend verification email
  async resendVerificationEmail() {
    try {
      const response = await axios.post(`${BASE_URL}/resend-verification/`);
      NotificationService.showSuccess('Verification email resent!');
      return response.data;
    } catch (error) {
      NotificationService.showError(error.response?.data?.message || 'Failed to resend verification email');
      throw error;
    }
  },

  // Setup MFA
  async setupMFA() {
    try {
      const response = await axios.post(`${BASE_URL}/mfa/setup/`);
      NotificationService.showSuccess('MFA setup successful!');
      return response.data;
    } catch (error) {
      NotificationService.showError(error.response?.data?.message || 'MFA setup failed');
      throw error;
    }
  },

  // Verify MFA code
  async verifyMFA(code) {
    try {
      const response = await axios.post(`${BASE_URL}/mfa/verify/`, { code });
      NotificationService.showSuccess('MFA verification successful!');
      return response.data;
    } catch (error) {
      NotificationService.showError(error.response?.data?.message || 'MFA verification failed');
      throw error;
    }
  },
};

export default AuthService;