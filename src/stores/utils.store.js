import { defineStore } from 'pinia'

export const useUtilstStore = defineStore({
  id: 'utils',
  state: () => ({
    activeSport: {
      sportID: 1,
      sportName: 'Soccer'
    },
    sportID: 1,
    live: false,
    sportsMenu: [],
    marketGroups: [],
    activeLiveMarkets: [],
    homeCarousel: [],
    SportsbookBonusList: [],
    SportsbookGlobalVariable: {},
    showBetslipCount: true,
    showFooter: true,
    showMobileNavigation: true,
    errorMessage: null,
    activeCategories: [],
    openBetCount: 0
  }),
  getters: {},
  actions: {},
  persist: {
    storage: localStorage
  }
})
