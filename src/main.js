import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VOtpInput from 'vue3-otp-input'
import applyBranding from './helpers/utils'
import { createGtag } from "vue-gtag";

import { VueFbq } from 'vue3-facebook-pixel';

import App from './App.vue'
import router from './router'

import { VueQueryPlugin } from 'vue-query'

const startApp = async () => {
  try {
    const app = createApp(App)
    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate)
    app.use(pinia)
    await applyBranding()

    app.use(router)
    app.use(VueQueryPlugin)
    app.component('v-otp-input', VOtpInput)

    const gtag = createGtag({
      tagId: "G-QS32GCT1W3"
    })
    app.use(gtag);
    
    app.use(VueFbq, {
      pixelId: '2678472575859316', // Replace with your actual Pixel ID
      debug: true
    });

    app.mount('#app')
  } catch (error) {
    console.error('Failed to load branding config:', error)
  }
}

;(async () => {
  await startApp()
})()
