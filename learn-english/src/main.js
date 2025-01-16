import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/main.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
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
  faLayerGroup 
} from '@fortawesome/free-solid-svg-icons'

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
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)
app.use(store)
app.mount('#app')
