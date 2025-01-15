import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/css/main.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { NotificationService } from '@/utils/NotificationService';

// Import all necessary icons
import {
  faUser,
  faChartBar,
  faThumbsUp,
  faLevelUpAlt,
  faClipboardCheck,
  faQuestionCircle,
  faStickyNote,
  faBars,
  faTimes,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

// Add icons to the library
library.add(
  faUser,
  faChartBar,
  faThumbsUp,
  faLevelUpAlt,
  faClipboardCheck,
  faQuestionCircle,
  faStickyNote,
  faBars,
  faTimes,
  faLayerGroup
);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);

app.config.errorHandler = (err, instance, info) => {
  console.error('Global error handler caught:', err, info);
  NotificationService.showError(
    `An unexpected error occurred: ${err.message || err}`,
    { position: 'top-center', duration: 5000 }
  );
};

app.mount('#app');
