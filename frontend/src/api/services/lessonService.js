import axiosInstance from '../axios';

export const lessonService = {
  fetchLessons: async () => {
    try {
      const response = await axiosInstance.get('lessons/');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  fetchCurrentLesson: async () => {
    try {
      const response = await axiosInstance.get('current-lesson/');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};
