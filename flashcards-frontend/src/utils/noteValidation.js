export const validateNoteTitle = (title) => {
    if (!title) return 'Title is required';
    if (title.length < 3) return 'Title must be at least 3 characters';
    if (title.length > 100) return 'Title cannot exceed 100 characters';
    return '';
};

export const validateNoteContent = (content) => {
    if (!content) return 'Content is required';
    if (content.length < 10) return 'Content must be at least 10 characters';
    if (content.length > 1000) return 'Content cannot exceed 1000 characters';
    return '';
};

export const validateNote = (note) => {
    const titleError = validateNoteTitle(note.title);
    const contentError = validateNoteContent(note.content);

    return {
        isValid: !titleError && !contentError,
        titleError,
        contentError
    };
};
