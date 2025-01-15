import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import './assets/main.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faLanguage, 
  faSyncAlt, 
  faChartLine, 
  faGlobe, 
  faUpload, 
  faEdit, 
  faTrash,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
  faLanguage, 
  faSyncAlt, 
  faChartLine, 
  faGlobe, 
  faUpload, 
  faEdit, 
  faTrash,
  faEye,
  faEyeSlash
);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(store)
   .use(router)
   .use(i18n)
   .mount('#app');
