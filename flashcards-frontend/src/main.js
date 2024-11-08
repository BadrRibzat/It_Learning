import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './stores';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faUpload, 
  faUser, 
  faBook, 
  faGraduationCap, 
  faChartPie, 
  faComment, 
  faTimes, 
  faBars,
  faPaperPlane,
  faEnvelope,
  faChevronDown,
  faLightbulb,
  faClock,
  faPhone,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import './assets/tailwind.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createI18n } from 'vue-i18n';
import messages from '@/locales/en/messages.js';

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: messages,
    ar: messages,
    es: messages,
    fr: messages,
    de: messages,
    ja: messages,
    ko: messages,
    zh: messages,
    ru: messages,
  },
});

library.add(
  faUpload,
  faUser,
  faBook,
  faGraduationCap,
  faChartPie,
  faComment,
  faTimes,
  faBars,
  faPaperPlane,
  faEnvelope,
  faChevronDown,
  faLightbulb,
  faClock,
  faPhone,
  faEdit,
  faTrash
);

const app = createApp(App);
app.use(router);
app.use(store);
app.use(i18n);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
