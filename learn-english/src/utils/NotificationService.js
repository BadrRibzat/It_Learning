import { reactive } from 'vue';

export const notificationState = reactive({
  show: false,
  message: '',
  type: 'info',
  duration: 3000,
  position: 'bottom-right',
});

export const NotificationService = {
  show(message, type = 'info', options = {}) {
    notificationState.show = true;
    notificationState.message = message;
    notificationState.type = type;
    notificationState.duration = options.duration || 3000;
    notificationState.position = options.position || 'bottom-right';

    // Immediately hide any existing notification
    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, notificationState.duration);
  },

  showSuccess(message, options = {}) {
    this.show(message, 'success', options);
  },

  showError(message, options = {}) {
    this.show(message, 'error', options);
  },

  showInfo(message, options = {}) {
    this.show(message, 'info', options);
  },

  showWarning(message, options = {}) {
    this.show(message, 'warning', options);
  },

  hide() {
    notificationState.show = false;
    notificationState.message = '';
  },
};
