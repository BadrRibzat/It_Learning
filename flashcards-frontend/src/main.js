import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import { createI18n } from 'vue-i18n'
import messages from '@/locales/en/messages'
import Notifications from '@kyvg/vue3-notification'

// Font Awesome imports...
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
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
} from '@fortawesome/free-solid-svg-icons'

// Tailwind CSS
import './assets/tailwind.css'

// Configure i18n
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: messages
  }
})

// Configure Font Awesome
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
)

// Create Vue app
const app = createApp(App)

// Register click-outside directive
app.directive('click-outside', {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
});

// Use plugins
app.use(router)
app.use(store)
app.use(i18n)
app.use(Notifications)

// Register global components
app.component('font-awesome-icon', FontAwesomeIcon)

// Mount app
app.mount('#app')
