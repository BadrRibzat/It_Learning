import type { ApiError } from '@/types/api';

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || 'An error occurred',
      errors: error.response.data?.errors,
    };
  }
  return {
    status: 500,
    message: error.message || 'Network error occurred',
  };
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};
