import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './stores';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload, faUser, faBook, faGraduationCap, faChartPie, faComment, faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// If using Vue i18n, uncomment the following lines and ensure i18n is correctly set up
import { createI18n } from 'vue-i18n';
import messages from '@/locales/en/messages.js'; // Update the import path

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: messages,
  },
});

library.add(faUpload, faUser, faBook, faGraduationCap, faChartPie, faComment, faTimes, faBars);

const app = createApp(App);
app.use(router);
app.use(store);
app.component('font-awesome-icon', FontAwesomeIcon);

// If using Vue i18n, uncomment the following line
app.use(i18n);

app.mount('#app');
