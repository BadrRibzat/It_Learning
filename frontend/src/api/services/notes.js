import axios from '../axios';

export const noteService = {
  getNotes: () => axios.get('/api/notes/'),
  getNote: (id) => axios.get(`/api/notes/${id}/`),
  createNote: (noteData) => axios.post('/api/notes/', noteData),
  updateNote: (id, noteData) => axios.put(`/api/notes/${id}/`, noteData),
  deleteNote: (id) => axios.delete(`/api/notes/${id}/`),
  searchNotes: (query) => axios.get(`/api/notes/search/?q=${query}`),
  getNotesByLesson: (lessonId) => axios.get(`/api/notes/lesson/${lessonId}/`),
  getNotesByLevel: (levelId) => axios.get(`/api/notes/level/${levelId}/`),
};
