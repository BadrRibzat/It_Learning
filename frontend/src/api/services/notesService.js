import axiosInstance from '../axios';

export const notesService = {
  fetchNotes: async () => {
    const response = await axiosInstance.get('notes/');
    return response.data;
  },
  createNote: async (note) => {
    const response = await axiosInstance.post('notes/', note);
    return response.data;
  },
  updateNote: async (id, note) => {
    const response = await axiosInstance.put(`notes/${id}/`, note);
    return response.data;
  },
  deleteNote: async (id) => {
    const response = await axiosInstance.delete(`notes/${id}/`);
    return response.data;
  },
};
