import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore, useUtilsStore } from '@/stores'
import { unslugify } from '@/helpers'
import emitter from '@/plugins/emitter'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/Register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue'),
      meta: {
        requiresAuth: false,
        showDefaultHeaderItems: false
      }
    },
    {
      path: '/Account/ResetPassword',
      name: 'reset-password',
      component: () => import('@/views/Account/ForgotPassword.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/Sport/LiveList',
      name: 'live-view',
      component: () => import('../views/LiveView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/Sport/Live',
      name: 'live-fixtures-one-detail',
      component: () => import('../views/Sport/LiveFixtureDetail.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/Sports/Live/:sport/:tournament/:match/:match_id',
      name: 'live-fixtures-specific-detail',
      component: () => import('../views/Sport/LiveFixtureDetail.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/Sports/Prematch/:sport',
      name: 'fixtures-by-sport',
      component: () => import('../views/Sport/FixtureView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/Sports/Prematch/:sport/:categories',
      name: 'fixtures-by-categories',
      component: () => import('../views/Sport/FixtureView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/Sports/Prematch/:sport/:categories/:tournaments',
      name: 'fixtures-by-tournaments',
      component: () => import('../views/Sport/FixtureView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/Sports/Prematch/:sport/Upcoming',
      name: 'upcoming-fixtures-by-sport',
      component: () => import('../views/Sport/FixtureView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/Sports/Prematch/:sport/:tournament_name/:event_name/:event_id',
      name: 'fixtures-detail',
      component: () => import('@/views/Sport/FixtureDetail.vue'),
      meta: {
        requiresAuth: false
      }
    },
    // Casino
    {
      path: '/Games',
      name: 'game-view',
      component: () => import('@/views/Games/CasinoView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/Games/Category/:category_id/:category_name',
      name: 'casino-category',
      component: () => import('@/views/Games/CasinoCategoryView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/Games/Providers',
      name: 'casino-providers',
      component: () => import('@/views/Games/CasinoProvidersView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/Games/Provider/:provider_id/:provider_name',
      name: 'casino-provider',
      component: () => import('@/views/Games/CasinoProviderView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/Games/:game_name/:game_id/Play',
      name: 'game-play',
      component: () => import('@/views/Games/PlayView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    // Account Routes
    {
      path: '/Account/Me',
      name: 'account-me',
      component: () => import('@/views/Account/MeView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Account/Deposit',
      name: 'account-deposit',
      component: () => import('@/views/Account/DepositView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/payment-verification/:method',
      name: 'verify-deposit',
      component: () => import('@/views/Account/VerifyPaymentView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Account/Withdraw',
      name: 'account-withdraw',
      component: () => import('@/views/Account/WithdrawalView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Account/BetHistory',
      name: 'account-bethistory',
      component: () => import('@/views/Account/BetHistoryView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Account/BetHistory/:id/Detail',
      name: 'account-bethistory-detail',
      component: () => import('@/views/Account/BetHistoryDetail.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Account/Transactions',
      name: 'account-transactions',
      component: () => import('@/views/Account/TransactionsView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Account/SafetySecurity',
      name: 'account-security',
      component: () => import('@/views/Account/SecurityView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Promotions',
      name: 'promotions',
      component: () => import('@/views/PromotionsView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/cms/:page',
      name: 'cms-page',
      component: () => import('@/views/CMSView.vue'),
      meta: {
        requiresAuth: false
      }
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
  const showDefaultHeaderItems =
    to.meta.showDefaultHeaderItems !== undefined ? to.meta.showDefaultHeaderItems : true
  utilsStore.showDefaultHeaderItems = showDefaultHeaderItems

  if (to.params.sport) {
    let sport = utilsStore.sportsMenu.find((x) => x.sportName == unslugify(to.params.sport))
    if (sport) {
      utilsStore.activeSport = sport
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    authStore.returnUrl = to.fullPath;
    emitter.emit('showDialog', { dialogType: 'auth', dialogData: 'login' })
  }

  const mobileUrl = import.meta.env.VITE_MOBILE_URL
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.location.href = mobileUrl
  } else {
    next() // Proceed to the next route
  }
})

export default router
