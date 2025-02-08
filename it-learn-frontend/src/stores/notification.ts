import { defineStore } from 'pinia';
import { notifySuccess, notifyError, notifyInfo, notifyWarning } from '@/utils/notifications';

export const useNotificationStore = defineStore('notification', {
  actions: {
    success(message: string): void {
      notifySuccess(message);
    },
    error(message: string): void {
      notifyError(message);
    },
    info(message: string): void {
      notifyInfo(message);
    },
    warning(message: string): void {
      notifyWarning(message);
    }
  }
});
