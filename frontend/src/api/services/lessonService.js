import axiosInstance from '../axios';

export const lessonService = {
  fetchLessons: async () => {
    const response = await axiosInstance.get('lessons/');
    return response.data;
  },
  fetchLesson: async (id) => {
    const response = await axiosInstance.get(`lessons/${id}/`);
    return response.data;
  },
  fetchCurrentLesson: async () => {
    const response = await axiosInstance.get('recommend-next-lesson/');
    return response.data;
  },
};
