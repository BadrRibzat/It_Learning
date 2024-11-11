// src/utils/validation.js
export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

export const validateUsername = (username) => {
  return username.length >= 3 && username.length <= 20;
};

export const validateNote = (note) => {
  return {
    title: note.title.length > 0 && note.title.length <= 100,
    content: note.content.length > 0 && note.content.length <= 1000
  };
};
