import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LiveView from '../views/LiveView.vue'
// import SportsView from '../views/SportsView'
import FixtureView from '../views/Sport/FixtureView.vue'
import FixtureDetail from '@/views/Sport/FixtureDetail.vue'
import LiveFixtureDetail from '../views/Sport/LiveFixtureDetail.vue'

import CasinoView from '@/views/Games/CasinoView.vue'
import PlayView from '@/views/Games/PlayView.vue'

import DepositView from '@/views/Account/DepositView.vue'
import VerifyPaymentView from '@/views/Account/VerifyPaymentView.vue'
import WithDrawalView from '@/views/Account/WithdrawalView.vue'
import BetHistoryView from '@/views/Account/BetHistoryView.vue'
import BetHistoryDetail from '@/views/Account/BetHistoryDetail.vue'
import TransactionsView from '@/views/Account/TransactionsView.vue'
import MeView from '@/views/Account/MeView.vue'
import TermsandConditions from '@/views/CMS/TermsandConditions.vue'
import AboutUs from '@/views/CMS/AboutUs.vue'
import ResponsibleGaming from '@/views/CMS/ResponsibleGaming.vue'
import BettingRules from '@/views/CMS/BettingRules.vue'

import { useUtilsStore } from '@/stores'
import { unslugify } from '@/helpers'
// import LiveFixtureDetail from '@/views/Sport/LiveFixtureDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/Sport/LiveList',
      name: 'live-view',
      component: LiveView
    },
    {
      path: '/Sport/Live',
      name: 'live-fixtures-one-detail',
      component: LiveFixtureDetail
    },
    {
      path: '/Sports/Live/:sport/:category/:tournament/:match/:match_id',
      name: 'live-fixtures-specific-detail',
      component: LiveFixtureDetail
    },
    {
      path: '/Sports/Prematch/:sport',
      name: 'fixtures-by-sport',
      component: FixtureView
    },
    {
      path: '/Sports/Prematch/:sport/:categories',
      name: 'fixtures-by-categories',
      component: FixtureView
    },
    {
      path: '/Sports/Prematch/:sport/:categories/:tournaments',
      name: 'fixtures-by-tournaments',
      component: FixtureView
    },
    {
      path: '/Sports/Prematch/:sport/Upcoming',
      name: 'upcoming-fixtures-by-sport',
      component: FixtureView
    },
    {
      path: '/Sports/Prematch/:sport/:category/:tournament_name/:event_name/:event_id',
      name: 'fixtures-detail',
      component: FixtureDetail
    },
    // Casino
    {
      path: '/Games',
      name: 'game-view',
      component: CasinoView
    },
    {
      path: '/Games/:game_name/:game_id/Play',
      name: 'game-play',
      component: PlayView
    },
    // Account Routes
    {
      path: '/Account/Me',
      name: 'account-me',
      component: MeView
    },
    {
      path: '/Account/Deposit',
      name: 'account-deposit',
      component: DepositView
    },
    {
      path: '/payment-verification/:method',
      name: 'verify-deposit',
      component: VerifyPaymentView
    },
    {
      path: '/Account/Withdraw',
      name: 'account-withdraw',
      component: WithDrawalView
    },
    {
      path: '/Account/BetHistory',
      name: 'account-bethistory',
      component: BetHistoryView
    },
    {
      path: '/Account/BetHistory/:id/Detail',
      name: 'account-bethistory-detail',
      component: BetHistoryDetail
    },
    {
      path: '/Account/Transactions',
      name: 'account-transactions',
      component: TransactionsView
    },
    {
      path: '/CMS/AboutUs',
      name: 'about-us',
      component: AboutUs
    },
    {
      path: '/CMS/TandC',
      name: 't-and-c',
      component: TermsandConditions
    },
    {
      path: '/CMS/ResponsibleGaming',
      name: 'responsible-gaming',
      component: ResponsibleGaming
    },
    {
      path: '/CMS/BettingRules',
      name: 'betting-rules',
      component: BettingRules
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const utilsStore = useUtilsStore()

  if (to.params.sport) {
    let sport = utilsStore.sportsMenu.find((x) => x.sportName == unslugify(to.params.sport))
    if (sport) {
      utilsStore.activeSport = sport
    }
  }


  const mobileUrl = import.meta.env.VITE_MOBILE_URL;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.location.href = mobileUrl
  } else {
    next() // Proceed to the next route
  }
})

export default router
