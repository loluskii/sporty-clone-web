import { defineStore } from 'pinia'

import { login, getUserActiveBonus, getUserCashbackBonus } from '@/helpers'
import { useUsersStore, useUtilsStore } from '@/stores'
import router from '../router'

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
      this.authError = ''
      try {
  const res = await login(payload)
  if (res.data && res.data.token) {
    this.token = res.data.token
    this.mobile_number = payload.username
    const userStore = useUsersStore()

    const results = await Promise.allSettled([
      userStore.loadCurrentUser(),
      getUserActiveBonus(),
      getUserCashbackBonus()
    ])

    // handle per-result safely
    if (results[0].status !== "fulfilled") {
      console.error("Failed to load user", results[0].reason)
    }

    if (results[1].status === "fulfilled") {
      // optional: assign activeBonus
      userStore.activeBonus = results[1].value.data
    } else {
      console.warn("Active bonus fetch failed", results[1].reason)
    }

    if (results[2].status === "fulfilled") {
      userStore.activeCashback = results[2].value.data
    } else {
      console.warn("Cashback bonus fetch failed", results[2].reason)
      userStore.activeCashback = null
    }

    this.loading = false
    return router.push(this.returnUrl || '/')
  } else {
    throw Error(res.error)
  }
} catch (error) {
  this.loading = false
  alert(error)
}

    },
    clearStores() {
      const authStore = useAuthStore()
      authStore.$reset()
      const userStore = useUsersStore()
      userStore.$reset()
      const utilsStore = useUtilsStore()
      utilsStore.openBetCount = 0
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
