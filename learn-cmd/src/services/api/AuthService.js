import axios from 'axios';
import { NotificationService } from '@/utils/NotificationService';

const API_URL = 'http://127.0.0.1:8000/accounts';

const AuthService = {
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/register/`, {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password_confirmation,
        language: userData.language,
        date_of_birth: userData.date_of_birth,
      });
      NotificationService.showSuccess('Registration successful!');
      return response.data;
    } catch (error) {
      NotificationService.handleAuthError(error);
      throw error;
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/login/`, credentials);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      NotificationService.showSuccess('Login successful!');
      return response.data;
    } catch (error) {
      NotificationService.handleAuthError(error);
      throw error;
    }
  },

  async logout() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      await axios.post(`${API_URL}/logout/`, { refresh_token: refreshToken }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      NotificationService.showSuccess('Logout successful!');
    } catch (error) {
      NotificationService.handleAuthError(error);
      throw error;
    }
  },

  async verifyEmail(token) {
    try {
      const response = await axios.post(`${API_URL}/verify-email/`, { token });
      NotificationService.showSuccess('Email verified successfully!');
      return response.data;
    } catch (error) {
      NotificationService.handleAuthError(error);
      throw error;
    }
  },

  async requestPasswordReset(email) {
    try {
      const response = await axios.post(`${API_URL}/password-reset/`, { email });
      NotificationService.showSuccess('Password reset link sent to your email!');
      return response.data;
    } catch (error) {
      NotificationService.handleAuthError(error);
      throw error;
    }
  },

  async confirmPasswordReset(token, newPassword) {
    try {
      const response = await axios.post(`${API_URL}/password-reset-confirm/`, {
        token,
        new_password: newPassword,
        confirm_password: newPassword,
      });
      NotificationService.showSuccess('Password reset successfully!');
      return response.data;
    } catch (error) {
      NotificationService.handleAuthError(error);
      throw error;
    }
  },

  async setupMFA() {
    try {
      const response = await axios.post(`${API_URL}/mfa/setup/`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      NotificationService.showSuccess('MFA setup initiated!');
      return response.data;
    } catch (error) {
      NotificationService.handleAuthError(error);
      throw error;
    }
  },

  async verifyMFA(token) {
    try {
      const response = await axios.post(`${API_URL}/mfa/setup/`, { token }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      NotificationService.showSuccess('MFA verified successfully!');
      return response.data;
    } catch (error) {
      NotificationService.handleAuthError(error);
      throw error;
    }
  },
};

export default AuthService;
