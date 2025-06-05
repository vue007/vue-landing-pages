import 'virtual:uno.css'
import 'virtual:svg-icons-register'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { basePlugin } from './utils/plugins/base-plugin'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)

app.use(basePlugin)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
})

app.mount('#app')
