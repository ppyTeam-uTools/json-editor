import { createApp } from 'vue'

import App from './App.vue'

import '@/utils/monacoWorker'

const app = createApp(App)

app.mount('#app')
