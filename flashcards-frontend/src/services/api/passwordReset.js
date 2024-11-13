import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const passwordResetService = {
    requestPasswordReset: async (email) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_REQUEST, { email });
            return response.data;
        } catch (error) {
            console.error('Password reset request error:', error);
            throw error;
        }
    },

    confirmPasswordReset: async (token, newPassword, confirmPassword) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, {
                token,
                new_password: newPassword,
                confirm_password: confirmPassword
            });
            return response.data;
        } catch (error) {
            console.error('Password reset confirmation error:', error);
            throw error;
        }
    }
};

export default passwordResetService;
