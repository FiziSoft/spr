import { createApp } from 'vue'
import App from './App.vue'
import {router} from "./router"
import './assets/style.sass'
import './assets/neonCheckbox.scss'
import VueNativeSock from 'vue-native-websocket-vue3'


const app = createApp(App)

app.use(router)

// app.use(VueNativeSock, 'ws://localhost:8001/ws', {
//   format: 'json',
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 3000,
// })

app.mount('#app')