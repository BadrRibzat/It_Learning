export const API_BASE_URL = 'http://localhost:8000/api';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/login/',
        REGISTER: '/register/',
        LOGOUT: '/logout/',
        REFRESH_TOKEN: '/token/refresh/',
        CHECK_USER: '/check-user/',
    },
    PROFILE: {
        DETAIL: '/profile/',
        UPLOAD_PICTURE: '/upload-profile-picture/',
        DELETE_PICTURE: '/delete-profile-picture/',
        RESET_PROGRESS: '/reset-progress/',
    },
    STATISTICS: {
        USER: '/statistics/',
        PROGRESS: '/user-progress/',
    },
    LEVELS: {
        LIST: '/levels/',
        DETAIL: (id) => `/levels/${id}/`,
        LESSONS: (id) => `/levels/${id}/lessons/`,
        TEST_QUESTIONS: (id) => `/level-test-questions/?level=${id}`,
        SUBMIT_TEST: (id) => `/level-test-submit/${id}/`,
    },
    LESSONS: {
        LIST: '/lessons/',
        DETAIL: (id) => `/lessons/${id}/`,
        RECOMMEND: '/recommend-next-lesson/',
    },
    FLASHCARDS: {
        LIST: '/flashcards/',
        DETAIL: (id) => `/flashcards/${id}/`,
        SUBMIT: (id) => `/flashcard-submit/${id}/`,
    },
    QUIZZES: {
        LIST: '/quizzes/',
        DETAIL: (id) => `/quizzes/${id}/`,
        SUBMIT: (id) => `/quiz-submit/${id}/`,
    },
    NOTES: {
        LIST: '/notes/',
        DETAIL: (id) => `/notes/${id}/`,
    },
    PROGRESS: {
        USER: '/user-progress/',
        FLASHCARD: '/user-flashcard-progress/',
        LEVEL: '/user-level-progress/',
        QUIZ_ATTEMPTS: '/user-quiz-attempts/',
    },
    CHAT: {
        SEND: '/chat/',
        BOT: '/chatbot/',
    },
};

export const APP_CONFIG = {
    name: 'Learn English',
    version: '1.0.0',
    description: 'An interactive platform for learning English',
    validation: {
        minPasswordLength: 8,
        maxNoteTitleLength: 100,
        maxNoteContentLength: 1000,
    },
};

export const THEME = {
    colors: {
        primary: '#4F46E5',
        secondary: '#34D399',
        accent: '#818CF8',
        background: '#F3F4F6',
        text: '#1F2937',
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
    },
    fonts: {
        main: 'Inter, sans-serif',
        headings: 'Poppins, sans-serif',
    },
};

export const LANGUAGES = {
    en: { name: 'English', dir: 'ltr', code: 'en' },
    ar: { name: 'العربية', dir: 'rtl', code: 'ar' },
    es: { name: 'Español', dir: 'ltr', code: 'es' },
    fr: { name: 'Français', dir: 'ltr', code: 'fr' },
    de: { name: 'Deutsch', dir: 'ltr', code: 'de' },
    ja: { name: '日本語', dir: 'ltr', code: 'ja' },
    ko: { name: '한국어', dir: 'ltr', code: 'ko' },
    zh: { name: '中文', dir: 'ltr', code: 'zh' },
    ru: { name: 'Русский', dir: 'ltr', code: 'ru' },
};

export default {
    API_BASE_URL,
    API_ENDPOINTS,
    APP_CONFIG,
    THEME,
    LANGUAGES,
};
