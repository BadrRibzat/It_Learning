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
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import './assets/tailwind.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createI18n } from 'vue-i18n';
import messages from '@/locales/en/messages.js';
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
  faPhone
);

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: messages,
  },
});

const app = createApp(App);
app.use(router);
app.use(store);
app.use(i18n);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
