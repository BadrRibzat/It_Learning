import axiosInstance from './axios';

const notesService = {
  getNotes: () => axiosInstance.get('/notes/'),
  getNote: (id) => axiosInstance.get(`/notes/${id}/`),
  createNote: (noteData) => axiosInstance.post('/notes/', noteData),
  updateNote: (id, noteData) => axiosInstance.put(`/notes/${id}/`, noteData),
  deleteNote: (id) => axiosInstance.delete(`/notes/${id}/`),
};

export default notesService;
