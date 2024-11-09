import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const notesService = {
  getNotes: () => axiosInstance.get(API_ENDPOINTS.NOTES.LIST),
  getNote: (id) => axiosInstance.get(API_ENDPOINTS.NOTES.DETAIL(id)),
  createNote: (noteData) => axiosInstance.post(API_ENDPOINTS.NOTES.LIST, noteData),
  updateNote: (id, noteData) => axiosInstance.patch(API_ENDPOINTS.NOTES.DETAIL(id), noteData),
  deleteNote: (id) => axiosInstance.delete(API_ENDPOINTS.NOTES.DETAIL(id)),
};

export default notesService;
