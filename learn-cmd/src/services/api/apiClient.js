import axios from 'axios';

const apiClient = axios.create({
  baseURl: 'http://127.0.0.1:5000',
//  baseURL: 'http://192.168.58.2',  // Using your Minikube IP
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Handle lesson access restrictions
      NotificationService.showError('You don\'t have access to this content yet');
    } else if (error.response?.status === 404) {
      // Handle not found resources
      NotificationService.showError('The requested content was not found');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
