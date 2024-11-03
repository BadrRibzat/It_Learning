import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faLock, faEnvelope, faPhone, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUser, faLock, faEnvelope, faPhone, faInfoCircle)

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .use(store)
  .use(i18n)
  .mount('#app')
