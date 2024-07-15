import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VOtpInput from "vue3-otp-input";

import App from './App.vue'
import router from './router'

import { VueQueryPlugin } from 'vue-query'
const app = createApp(App)
app.component('v-otp-input', VOtpInput)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin)

app.mount('#app')
