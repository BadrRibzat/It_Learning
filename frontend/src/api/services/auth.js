import axios from '../axios';

export const authService = {
  login: (credentials) => axios.post('/api/login/', credentials),
  register: (userData) => axios.post('/api/register/', userData),
  logout: (token) => axios.post('/api/logout/', {}, {
  headers: { Authorization: `Bearer ${token}` }
}),
  resetPassword: (email) => axios.post('/api/password-reset/', { email }),
  confirmResetPassword: (data) => axios.post('/api/password-reset-confirm/', data),
  getProfile: () => axios.get('/api/profile/'),
  updateProfile: (profileData) => axios.put('/api/profile/', profileData),
  uploadProfilePicture: (formData) => axios.post('/api/upload-profile-picture/', formData),
  getStatistics: () => axios.get('/api/statistics/'),
  checkUser: (email, password) => axios.post('/api/check-user/', { email, password }),
};
