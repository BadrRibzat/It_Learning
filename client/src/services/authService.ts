// src/services/authService.ts
import api from './api';

export const login = async (email: string, password: string) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  } catch (err: any) {
    return err.response?.data?.message || 'Login failed';
  }
};

export const register = async (username: string, email: string, password: string) => {
  try {
    await api.post('/auth/register', {
      username,
      email,
      password,
      confirmPassword: password,
    });
    return 'success';
  } catch (err: any) {
    return err.response?.data?.message || 'Registration failed';
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const res = await api.get(`/auth/verify/${token}`);
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || 'Verification failed';
  }
};
