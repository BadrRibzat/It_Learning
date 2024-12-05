import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const authApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

authApi.interceptors.request.use(
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

export const register = async (userData) => {
    try {
        const response = await authApi.post('/accounts/register/', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Registration failed');
    }
};

export const verifyEmail = async (token) => {
    try {
        const response = await authApi.post('/accounts/verify-email/', { token });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Email verification failed');
    }
};

export const setupMFA = async () => {
    try {
        const response = await authApi.post('/accounts/mfa/setup/');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'MFA setup failed');
    }
};

export const verifyMFA = async (token) => {
    try {
        const response = await authApi.post('/accounts/mfa/verify/', { token });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'MFA verification failed');
    }
};

export const login = async (credentials) => {
    try {
        const response = await authApi.post('/accounts/login/', credentials);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Login failed');
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await authApi.post('/accounts/password-reset-request/', { email });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Password reset request failed');
    }
};

export const resetPassword = async (token, newPassword) => {
    try {
        const response = await authApi.post('/accounts/password-reset-confirm/', { token, newPassword });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Password reset failed');
    }
};

export const logout = async (refreshToken) => {
    try {
        const response = await authApi.post('/accounts/logout/', { refresh_token: refreshToken });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Logout failed');
    }
};
