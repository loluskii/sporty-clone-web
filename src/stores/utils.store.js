import { defineStore } from 'pinia'

export const useUtilsStore = defineStore({
  id: 'utils',
  state: () => ({
    activeSport: {
      sportID: 1,
      sportName: 'Soccer'
    },
    sportID: 1,
    live: false,
    banners: [],
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
    openBetCount: 0,
    liveListSingleMatch: null,
    showDefaultHeaderItems: true,
    bonusModalShown: null,
    popupDialogShown: null
  }),
  getters: {},
  actions: {},
  persist: {
    storage: localStorage
  }
})
