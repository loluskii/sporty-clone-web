import { createRouter, createWebHistory } from 'vue-router'
// Remove static imports for views
// import HomeView from '../views/HomeView.vue'
// import LiveView from '../views/LiveView.vue'
// import FixtureView from '../views/Sport/FixtureView.vue'
// import FixtureDetail from '@/views/Sport/FixtureDetail.vue'
// import LiveFixtureDetail from '../views/Sport/LiveFixtureDetail.vue'
// import CasinoView from '@/views/Games/CasinoView.vue'
// import CasinoCategoryView from '@/views/Games/CasinoCategoryView.vue'
// import PlayView from '@/views/Games/PlayView.vue'
// import DepositView from '@/views/Account/DepositView.vue'
// import VerifyPaymentView from '@/views/Account/VerifyPaymentView.vue'
// import WithDrawalView from '@/views/Account/WithdrawalView.vue'
// import BetHistoryView from '@/views/Account/BetHistoryView.vue'
// import BetHistoryDetail from '@/views/Account/BetHistoryDetail.vue'
// import TransactionsView from '@/views/Account/TransactionsView.vue'
// import MeView from '@/views/Account/MeView.vue'
// import ForgotPassword from '@/views/Account/ForgotPassword.vue'
// import Promotions from '@/views/Promotions.vue'

import { useAuthStore, useUtilsStore } from '@/stores'
import { unslugify } from '@/helpers'

const authRoutes = ["Register"]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/Register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue'),
      meta: { showDefaultHeaderItems: false }
    },
    {
      path: '/Account/ResetPassword',
      name: 'reset-password',
      component: () => import('@/views/Account/ForgotPassword.vue')
    },
    {
      path: '/Sport/LiveList',
      name: 'live-view',
      component: () => import('../views/LiveView.vue')
    },
    {
      path: '/Sport/Live',
      name: 'live-fixtures-one-detail',
      component: () => import('../views/Sport/LiveFixtureDetail.vue')
    },
    {
      path: '/Sports/Live/:sport/:tournament/:match/:match_id',
      name: 'live-fixtures-specific-detail',
      component: () => import('../views/Sport/LiveFixtureDetail.vue')
    },
    {
      path: '/Sports/Prematch/:sport',
      name: 'fixtures-by-sport',
      component: () => import('../views/Sport/FixtureView.vue')
    },
    {
      path: '/Sports/Prematch/:sport/:categories',
      name: 'fixtures-by-categories',
      component: () => import('../views/Sport/FixtureView.vue')
    },
    {
      path: '/Sports/Prematch/:sport/:categories/:tournaments',
      name: 'fixtures-by-tournaments',
      component: () => import('../views/Sport/FixtureView.vue')
    },
    {
      path: '/Sports/Prematch/:sport/Upcoming',
      name: 'upcoming-fixtures-by-sport',
      component: () => import('../views/Sport/FixtureView.vue')
    },
    {
      path: '/Sports/Prematch/:sport/:tournament_name/:event_name/:event_id',
      name: 'fixtures-detail',
      component: () => import('@/views/Sport/FixtureDetail.vue')
    },
    // Casino
    {
      path: '/Games',
      name: 'game-view',
      component: () => import('@/views/Games/CasinoView.vue')
    },
    {
      path: '/Games/Category/:category_id/:category_name',
      name: 'casino-category',
      component: () => import('@/views/Games/CasinoCategoryView.vue')
    },
    {
      path: '/Games/Providers',
      name: 'casino-providers',
      component: () => import('@/views/Games/CasinoProvidersView.vue')
    },
    {
      path: '/Games/Provider/:provider_id/:provider_name',
      name: 'casino-provider',
      component: () => import('@/views/Games/CasinoProviderView.vue')
    },
    {
      path: '/Games/:game_name/:game_id/Play',
      name: 'game-play',
      component: () => import('@/views/Games/PlayView.vue')
    },
    // Account Routes
    {
      path: '/Account/Me',
      name: 'account-me',
      component: () => import('@/views/Account/MeView.vue')
    },
    {
      path: '/Account/Deposit',
      name: 'account-deposit',
      component: () => import('@/views/Account/DepositView.vue')
    },
    {
      path: '/payment-verification/:method',
      name: 'verify-deposit',
      component: () => import('@/views/Account/VerifyPaymentView.vue')
    },
    {
      path: '/Account/Withdraw',
      name: 'account-withdraw',
      component: () => import('@/views/Account/WithdrawalView.vue')
    },
    {
      path: '/Account/BetHistory',
      name: 'account-bethistory',
      component: () => import('@/views/Account/BetHistoryView.vue')
    },
    {
      path: '/Account/BetHistory/:id/Detail',
      name: 'account-bethistory-detail',
      component: () => import('@/views/Account/BetHistoryDetail.vue')
    },
    {
      path: '/Account/Transactions',
      name: 'account-transactions',
      component: () => import('@/views/Account/TransactionsView.vue')
    },
    {
      path: '/Account/SafetySecurity',
      name: 'account-security',
      component: () => import('@/views/Account/SecurityView.vue')
    },
    {
      path: '/Promotions',
      name: 'promotions',
      component: () => import('@/views/Promotions.vue')
    },
    {
      path: '/cms/:page',
      name: 'cms-page',
      component: () => import('@/views/CMSView.vue')
    },
    // Catch-all route to redirect to home
    {
      path: '/:pathMatch(.*)*', // Catch-all pattern
      redirect: '/'
    }
  ]
})

router.beforeEach(async (to, from, next) => {

  const utilsStore = useUtilsStore()
  const authStore = useAuthStore()
  const showDefaultHeaderItems = to.meta.showDefaultHeaderItems !== undefined ? to.meta.showDefaultHeaderItems : true
  utilsStore.showDefaultHeaderItems = showDefaultHeaderItems

  if (to.params.sport) {
    let sport = utilsStore.sportsMenu.find((x) => x.sportName == unslugify(to.params.sport))
    if (sport) {
      utilsStore.activeSport = sport
    }
  }

  if(authRoutes.includes(to.name) && authStore.isAuthenticated){
    router.push({name:'home'})
  }


  const mobileUrl = import.meta.env.VITE_MOBILE_URL;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.location.href = mobileUrl
  } else {
    next() // Proceed to the next route
  }
})

export default router
