import { useToast } from 'vue-toastification';

export default class NotificationService {
  private static toast = useToast();

  static success(message: string): void {
    this.toast.success(message);
  }

  static error(message: string): void {
    this.toast.error(message);
  }

  static info(message: string): void {
    this.toast.info(message);
  }

  static warning(message: string): void {
    this.toast.warning(message);
  }
}
