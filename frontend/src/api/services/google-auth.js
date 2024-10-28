import axios from '../axios';

export const googleAuthService = {
  initialize: () => axios.get('/api/auth/google/initialize/'),
  callback: (code) => axios.post('/api/auth/google/callback/', { code }),
  disconnect: () => axios.post('/api/auth/google/disconnect/'),
  getStatus: () => axios.get('/api/auth/google/status/'),
};
