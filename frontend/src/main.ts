import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'
import { useAppStore } from '@/stores/app'
import { installDomI18n } from '@/i18n-dom'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

const appStore = useAppStore(pinia)
installDomI18n(() => appStore.language)
