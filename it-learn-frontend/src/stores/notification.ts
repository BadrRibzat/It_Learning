import { defineStore } from 'pinia';
import NotificationService from '@/services/notification.service';

export const useNotificationStore = defineStore('notification', {
  actions: {
    success(message: string): void {
      NotificationService.success(message);
    },
    error(message: string): void {
      NotificationService.error(message);
    },
    info(message: string): void {
      NotificationService.info(message);
    },
    warning(message: string): void {
      NotificationService.warning(message);
    }
  }
});
