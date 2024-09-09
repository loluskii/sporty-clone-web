const redirectToMobileIfNeeded = () => {
  const mobileUrl = import.meta.env.VITE_MOBILE_URL;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    window.location.replace(mobileUrl); // Faster and avoids extra page history entry
  }
};

// Call the redirection function as early as possible
redirectToMobileIfNeeded();

import './assets/css/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VOtpInput from 'vue3-otp-input'
import applyBranding from './helpers/utils'

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

    app.mount('#app')
  } catch (error) {
    console.error('Failed to load branding config:', error)
  }
}

;(async () => {
  await startApp()
})()
