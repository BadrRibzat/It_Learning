import axiosInstance from './axios';
import { API_ENDPOINTS } from '@/config';

const notesService = {
    getNotes() {
        return axiosInstance.get(API_ENDPOINTS.NOTES.LIST);
    },
    
    getNote(id) {
        if (!id) {
            throw new Error('Note ID is required');
        }
        return axiosInstance.get(API_ENDPOINTS.NOTES.DETAIL(id));
    },
    
    createNote(noteData) {
        // Validate note data
        if (!noteData.title || !noteData.content) {
            throw new Error('Title and content are required');
        }
        
        // Validate length constraints
        if (noteData.title.length < 3 || noteData.title.length > 100) {
            throw new Error('Title must be between 3 and 100 characters');
        }
        
        if (noteData.content.length < 10 || noteData.content.length > 1000) {
            throw new Error('Content must be between 10 and 1000 characters');
        }
        
        return axiosInstance.post(API_ENDPOINTS.NOTES.LIST, noteData);
    },
    
    updateNote(id, noteData) {
        if (!id) {
            throw new Error('Note ID is required');
        }
        
        // Validate note data
        if (!noteData.title || !noteData.content) {
            throw new Error('Title and content are required');
        }
        
        // Validate length constraints
        if (noteData.title.length < 3 || noteData.title.length > 100) {
            throw new Error('Title must be between 3 and 100 characters');
        }
        
        if (noteData.content.length < 10 || noteData.content.length > 1000) {
            throw new Error('Content must be between 10 and 1000 characters');
        }
        
        return axiosInstance.patch(API_ENDPOINTS.NOTES.DETAIL(id), noteData);
    },
    
    deleteNote(id) {
        if (!id) {
            throw new Error('Note ID is required');
        }
        return axiosInstance.delete(API_ENDPOINTS.NOTES.DETAIL(id));
    },
};

export default notesService;
