import { createApp, type Component } from 'vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './style.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

// Create the Pinia store
const pinia = createPinia();
const app = createApp(App as Component);

// Toast configuration
const toastOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
};

app.use(pinia);
app.use(router);
app.use(Toast, toastOptions);

app.mount('#app');
