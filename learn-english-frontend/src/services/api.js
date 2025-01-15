import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const register = (userData) => {
  return api.post('/accounts/register/', userData);
};

export const login = (credentials) => {
  return api.post('/accounts/login/', credentials);
};

export const forgotPassword = (email) => {
  return api.post('/accounts/password-reset-request/', { email });
};

export const resetPassword = (token, newPassword) => {
  return api.post('/accounts/password-reset-confirm/', { token, newPassword });
};

export const verifyEmail = (token) => {
  return api.post('/accounts/email-verification/', { token });
};

export const logout = (refreshToken) => {
  return api.post('/accounts/logout/', { refresh_token: refreshToken });
};

export const getUserProfile = () => {
  return api.get('/accounts/profile/');
};

export const updateUserProfile = (profileData) => {
  return api.put('/accounts/profile/', profileData);
};

export const getUserStatistics = () => {
  return api.get('/accounts/statistics/');
};
