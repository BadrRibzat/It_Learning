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
  fetchUserProgress: async () => {
    const response = await axiosInstance.get('user-progress/');
    return response.data;
  },
  updateLessonProgress: async (lessonId, completed) => {
    const response = await axiosInstance.post(`update-lesson-progress/${lessonId}/`, { completed });
    return response.data;
  },
};
