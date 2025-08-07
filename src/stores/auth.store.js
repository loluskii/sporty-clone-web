import {
  defineStore
} from 'pinia'

import {
  login,
  getUserActiveBonus,
  getUserCashbackBonus
} from '@/helpers'
import {
  useUsersStore,
  useUtilsStore
} from '@/stores'
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
      this.loading = true;
      this.authError = "";
      try {
        const res = await login(payload);
        if (res.data && res.data.token) {
          this.token = res.data.token;
          this.mobile_number = payload.username;
          const userStore = useUsersStore();
          const data = await Promise.all([
            userStore.loadCurrentUser(),
            getUserActiveBonus(),
            getUserCashbackBonus()
          ]);

          userStore.activeCashback = data[2].data
          this.loading = false;
          if (this.returnUrl) {
            return router.push(this.returnUrl);
          } else {
            return router.push('/')
          }
        } else {
          throw Error(res.error)
        }
      } catch (error) {
        this.loading = false;
        alert(error);
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