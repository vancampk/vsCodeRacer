import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import './style.css'
import './themes.css'
import App from './App.vue'
import { useFavicon } from './composables/useFavicon'
import { useSettingsStore } from './stores/settingsStore'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(vuetify)
app.mount('#app')

// Setup dynamic favicon based on theme
const settingsStore = useSettingsStore()
const { setupFaviconWatcher } = useFavicon()
setupFaviconWatcher(settingsStore)
