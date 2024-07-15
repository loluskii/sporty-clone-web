import { defineStore } from 'pinia'

import { getUserDetailsByToken, formatNumber } from '@/helpers'

export const useUsersStore = defineStore({
  id: 'users',
  state: () => ({
    isLoadingCurrentUser: false,
    currentUser: null,
    activeBonus: null
  }),
  getters: {
    balance: (state) => (state.currentUser ? state.currentUser.availableBalance : 0),
    details: (state) => (state.currentUser ? state.currentUser : null),
    sportBonusBalance: (state) => (state.currentUser ? state.currentUser.sportBonusBalance : 0),
    casinoBonusBalance: (state) => (state.currentUser ? state.currentUser.casinoBonusBalance : 0),
    virtualBonusBalance: (state) => (state.currentUser ? state.currentUser.virtualBonusBalance : 0),
    TrustBalance: (state) => (state.currentUser ? state.currentUser.trustBalance : 0)
  },
  actions: {
    async loadCurrentUser() {
      this.isLoadingCurrentUser = true
      // this.currentUser contains all user properties. E.g. this.currentUser.first_name
      const res = await getUserDetailsByToken()
      this.isLoadingCurrentUser = false
      this.currentUser = res.data
    },
    setActiveBonus(bonus) {
      this.activeBonus = bonus
    }
  },
  persist: {
    storage: localStorage
  }
})
