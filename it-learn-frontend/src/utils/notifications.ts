import { type ToastInterface, useToast, type ToastOptions } from 'vue-toastification';

let toast: ToastInterface;

// Initialize toast in a function that will be called after Vue app is mounted
const initializeToast = () => {
  toast = useToast();
};

const defaultOptions: Partial<ToastOptions> = {
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  position: "top-right"
};

export const notifySuccess = (message: string, options?: Partial<ToastOptions>) => {
  if (!toast) initializeToast();
  toast.success(message, { ...defaultOptions, ...options });
};

export const notifyError = (message: string, options?: Partial<ToastOptions>) => {
  if (!toast) initializeToast();
  toast.error(message, { ...defaultOptions, ...options });
};

export const notifyInfo = (message: string, options?: Partial<ToastOptions>) => {
  if (!toast) initializeToast();
  toast.info(message, { ...defaultOptions, ...options });
};

export const notifyWarning = (message: string, options?: Partial<ToastOptions>) => {
  if (!toast) initializeToast();
  toast.warning(message, { ...defaultOptions, ...options });
};
