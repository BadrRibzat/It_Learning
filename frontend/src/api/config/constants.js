export const API_CONSTANTS = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedFileTypes: {
    images: ['image/jpeg', 'image/png', 'image/gif'],
    documents: ['application/pdf', 'application/msword', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  endpoints: {
    auth: '/api/auth',
    lessons: '/api/lessons',
    profile: '/api/profile',
    chat: '/api/chat',
    notes: '/api/notes'
  }
}

