import { defineStore } from 'pinia'

import { login } from '@/helpers'
import { getActivePinia } from 'pinia'
import { useUsersStore } from '@/stores'
import router from '../router'
import emitter from '@/plugins/emitter'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    mobile_number: null,
    token: null,
    returnUrl: null,
    loading: false,
    authError: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async doLogin(payload) {
      this.loading = true
      this.authError = null
      try {
        const res = await login(payload)
        if (res?.data?.token) {
          this.token = res.data.token
          this.mobile_number = payload.username
          const userStore = useUsersStore()
          userStore.loadCurrentUser()
          this.loading = false
          emitter.emit('hideDialog')
          if (!this.returnUrl || this.returnUrl === '/') {
            return router.push('/')
          } else {
            return router.push(this.returnUrl)
          }
        } else {
          throw Error(res.error)
        }
      } catch (error) {
        this.loading = false
        this.authError = error
      }
    },
    clearStores() {
      const authStore = useAuthStore()
      authStore.$reset()
      const userStore = useUsersStore()
      userStore.$reset()
      // map through that list and use the **$reset** fn to reset the state
      // getActivePinia()._s.forEach((store) => store.$reset())
    },
    async logout() {
      this.token = null
      this.mobile_number = null
      this.clearStores()
      return await router.push('/')
    }
  },
  persist: {
    storage: localStorage
  }
})
