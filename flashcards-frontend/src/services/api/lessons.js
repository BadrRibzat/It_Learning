import axiosInstance from './axios';

const lessonsService = {
  getLessons: () => axiosInstance.get('/lessons/'),
  getLesson: (id) => axiosInstance.get(`/lessons/${id}/`),
  recommendNextLesson: () => axiosInstance.get('/recommend-next-lesson/'),
};

export default lessonsService;
