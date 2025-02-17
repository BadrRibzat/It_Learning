import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Important: Remove Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (!config || !config.retry) {
      config.retry = 0;
    }

    if (error.response?.status === 431) {
      console.error('Request header fields too large:', error);
    }

    if (config.retry < MAX_RETRIES) {
      config.retry += 1;

      // Delay before retry
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));

      // Retry the request
      return instance(config);
    }

    return Promise.reject(error);
  }
);

export type { AxiosError, AxiosResponse };
export default instance;
