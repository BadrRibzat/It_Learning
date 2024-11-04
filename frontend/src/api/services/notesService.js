import axiosInstance from '../axios';

export const notesService = {
  fetchNotes: async () => {
    try {
      const response = await axiosInstance.get('notes/');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  createNote: async (note) => {
    try {
      const response = await axiosInstance.post('notes/', note);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  updateNote: async (id, note) => {
    try {
      const response = await axiosInstance.put(`notes/${id}/`, note);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  deleteNote: async (id) => {
    try {
      const response = await axiosInstance.delete(`notes/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};
