import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import { createI18n } from 'vue-i18n'
import messages from '@/locales/en/messages'

// Font Awesome
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

// Use plugins
app.use(router)
app.use(store)
app.use(i18n)

// Register global components
app.component('font-awesome-icon', FontAwesomeIcon)

// Mount app
app.mount('#app')
