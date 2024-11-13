import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const emailVerificationService = {
    verifyEmail: async (token) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
            return response.data;
        } catch (error) {
            console.error('Email verification error:', error);
            throw error;
        }
    },

    resendVerificationEmail: async () => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION);
            return response.data;
        } catch (error) {
            console.error('Resend verification email error:', error);
            throw error;
        }
    }
};

export default emailVerificationService;
