import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/main.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { 
  faUser, 
  faChartBar, 
  faBook,
  faStar,
  faStarHalf,
  faCrown,
  faLock,
  faLayerGroup,
  faStickyNote,
  faBars,
  faXmark,
  faCog,
  faCamera,
  faHome,
  faInfoCircle,
  faEnvelope,
  faGauge,
  faRightToBracket,
  faUserPlus,
  faRightFromBracket,
  faBookOpen,
  faClipboardCheck,
  faQuestionCircle,
  faExclamationTriangle,
  faGraduationCap,
  faSun,
  faMoon,
  faCircleCheck,
  faCircleXmark,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faUser, 
  faChartBar, 
  faBook,
  faStar,
  faStarHalf,
  faCrown,
  faLock,
  faLayerGroup,
  faStickyNote,
  faBars,
  faXmark,
  faCog,
  faCamera,
  faHome,
  faInfoCircle,
  faEnvelope,
  faGauge,
  faRightToBracket,
  faUserPlus,
  faRightFromBracket,
  faBookOpen,
  faClipboardCheck,
  faQuestionCircle,
  faExclamationTriangle,
  faGraduationCap,
  faSun,
  faMoon,
  faCircleCheck,
  faCircleXmark,
  faSpinner
);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.use(store);

// Global properties for theme colors
app.config.globalProperties.$theme = {
  primary: '#4F46E5',
  secondary: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  success: '#10B981'
};

app.mount('#app');
