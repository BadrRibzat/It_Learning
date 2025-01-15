import axiosInstance from './axios';

const lessonsService = {
  getLessons: (levelId) => axiosInstance.get(`/lessons/?level=${levelId}`),
  getLesson: (id) => axiosInstance.get(`/lessons/${id}/`),
  recommendNextLesson: () => axiosInstance.get('/recommend-next-lesson/'),
  updateCurrentLesson: (lessonId) => axiosInstance.post('/update-current-lesson/', { lesson_id: lessonId }),
};

export default lessonsService;
