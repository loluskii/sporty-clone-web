import { fetchWrapper } from './fetch-wrapper'
import { BASE_API, CLIENT_ID, NEW_BASE_API } from './constants'

function today() {
  let today = new Date()
  let day = today.getDate().toString().padStart(2, '0') // Add leading zero if less than 10
  let month = (today.getMonth() + 1).toString().padStart(2, '0')
  let year = today.getFullYear()

  return year + '-' + month + '-' + day
}

function tomorrow() {
  let tomorrow = new Date()
  tomorrow.setDate((tomorrow.getDate() + 1).toString().padStart(2, '0'))
  return tomorrow.getFullYear() + '-' + (tomorrow.getMonth() + 1) + '-' + tomorrow.getDate()
}

function end() {
  let future = new Date()
  future.setDate(future.getDate() + 21)
  return (
    future.getFullYear() +
    '-' +
    (future.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    future.getDate()
  )
}

const date = new Date()
const offset = date.getTimezoneOffset()
const sign = offset >= 0 ? '-' : '+'
const offsetHours = Math.abs(offset / 60)

const parseData = async (response) => {
  return response instanceof Promise ? (await response)?.data : response.data
}

const startC27Game = async (payload) => {
  return parseData(
    fetchWrapper.post(`${import.meta.env.VITE_BASE_API}/api/c27/start-session`, payload)
  )
}

const startEvoPlayGame = async (payload) => {
  return parseData(
    fetchWrapper.post(`${import.meta.env.VITE_BASE_API}/api/evo-play/get-game-url`, payload)
  )
}

const startShackEvoGame = async (payload) => {
  return parseData(
    fetchWrapper.post(`${import.meta.env.VITE_BASE_API}/api/shacks-evo/start/${payload}`)
  )
}
const startTadaGame = async (payload) => {
  return parseData(
    fetchWrapper.post(`${import.meta.env.VITE_BASE_API}/api/tada/get-game-url`, payload)
  )
}

const playGame = async (payload) => {
  return parseData(
    fetchWrapper.post(`${import.meta.env.VITE_BASE_API}/api/c27/start-session`, payload)
  )
}

export const fetchGlobalVars = async () => {
  return fetchWrapper.get(`${import.meta.env.VITE_BASE_API}/api/utilities/globalvariables`)
}

export const fetchBanners = async () => {
  return parseData(
    fetchWrapper.get(`${import.meta.env.VITE_BASE_API}/api/sports/mobile/sliders?banner_type=web`)
  )
}

export const fetchBonusList = async () => {
  return fetchWrapper.get(
    `${import.meta.env.VITE_BASE_API}/api/utilities/bonuslist?section=onliners`
  )
}

export const getSplitPropsData = async (payload) => {
  return fetchWrapper.post(`${import.meta.env.VITE_BASE_API}/api/sports/get-split-props`, payload)
}

export const getCombosData = async (payload) => {
  return fetchWrapper.post(`${import.meta.env.VITE_BASE_API}/api/sports/get-combos`, {
    selections: payload.selections
  })
}

export const login = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/auth/login/`, payload))
}

export const register = async (payload) => {
  return fetchWrapper.post(`${NEW_BASE_API}/auth/register/`, payload)
}

export const sendOTP = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/notification/send-otp`, payload))
}

export const verifyOTP = async (payload) => {
  return fetchWrapper.post(`${NEW_BASE_API}/notification/verify-otp`, payload)
}

export const verifyUsername = async (payload) => {
  return parseData(
    fetchWrapper.post(`${import.meta.env.VITE_BASE_API}/api/auth/verify-username`, payload)
  )
}

export const resetPassword = async (payload) => {
  return parseData(
    fetchWrapper.post(`${import.meta.env.VITE_BASE_API}/api/auth/reset-password`, payload)
  )
}

export const updateProfile = async (payload) => {
  return parseData(fetchWrapper.put(`${NEW_BASE_API}/auth/update/details`, payload))
}

export const getUserDetailsByToken = async () => {
  return parseData(fetchWrapper.get(`${NEW_BASE_API}/auth/details/${CLIENT_ID}`))
}

export const getTopBets = async () => {
  return parseData(fetchWrapper.get(`${NEW_BASE_API}/admin/sports/${CLIENT_ID}/top-bets`))
}

export const getSportsMenu = async () => {
  return parseData(fetchWrapper.get(`${NEW_BASE_API}/sports/menu?timeoffset=${sign}${offsetHours}`))
}

export const getCategoriesBySport = async (sportID) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/sports/categories/${sportID}?timeoffset=${sign}${offsetHours}`
    )
  )
}

export const getTournamentsByCategories = async (categoryId) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/sports/categories/${categoryId}?timeoffset=${sign}${offsetHours}`
    )
  )
}

export const getFixturesBySport = async () => {
  return parseData(
    fetchWrapper.get(
      `${import.meta.env.VITE_BASE_API}/api/sports/group-fixtures-by-sport?date=${today()}&end_date=${end()}&timeoffset=+1`
    )
  )
}

export const getToday2 = async (sid, page) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/sports/highlight/prematch/${sid}?today=1&page=${page}&perPage=25&timeoffset=${sign}${offsetHours}`
    )
  )
}

export const getLiveHighlights = async () => {
  return parseData(
    fetchWrapper.get(`${NEW_BASE_API}/sports/highlight/live/0?source=website&markets=1`)
  )
}

export const getSportHighlights = async (sid, hours, page) => {
  if (hours) {
    return parseData(
      fetchWrapper.get(
        `${NEW_BASE_API}/sports/highlight/prematch/${sid}?upcoming=1&hours=${hours}&page=${page}&perPage=30&timeoffset=${sign}${offsetHours}`
      )
    )
  } else {
    return parseData(
      fetchWrapper.get(
        `${NEW_BASE_API}/sports/highlight/prematch/${sid}?upcoming=1&page=${page}&perPage=25&timeoffset=${sign}${offsetHours}`
      )
    )
  }
}

export const performCashout = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/bets/cashout/`, payload))
}

export const getHighlights2 = async (sid, perPage = 25) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/sports/highlight/prematch/${sid}?upcoming=1&page=1&perPage=${perPage}&timeoffset=${sign}${offsetHours}`
    )
  )
}

export const getFixturesByTournamentId = async (id, sid, page) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/sports/get-fixtures/${id}?sportID=${sid}&source=website&timeoffset=${sign}${offsetHours}&page=${page}`
    )
  )
}

export const getFixtureMarkets = async (id) => {
  return parseData(fetchWrapper.get(`${NEW_BASE_API}/sports/match/${id}`))
}

export const getFixturesByCategory = async (id, sid) => {
  return parseData(
    fetchWrapper.get(
      `${import.meta.env.VITE_SPORTS_BASE_API}/sports/get-fixtures-by-category/${id}?sportID=${sid}&source=website&timeoffset=+1`
    )
  )
}

export const getBets = async (payload, page = 1) => {
  return parseData(
    fetchWrapper.post(`${NEW_BASE_API}/bets/history?page=${page}&perPage=6`, payload)
  )
}

export const getOpenBets = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/bets/history`, payload))
}

export const getSettledBets = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/bets/history?page=1`, payload))
}

export const getTransactionsData = async (payload, page) => {
  return parseData(
    fetchWrapper.post(`${NEW_BASE_API}/user/wallet/transactions?source=website`, payload)
  )
}

export const getCouponById = async (id) => {
  return parseData(
    fetchWrapper.get(`${import.meta.env.VITE_BASE_API}/api/sports/find-coupon/${id}`)
  )
}

export const placeBet = async (payload) => {
  return parseData(
    fetchWrapper.post(
      `${import.meta.env.VITE_BASE_API}/api/sports/place-bet?channel=mobile`,
      payload
    )
  )
}

export const placeBet2 = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/bets/place-bet/${CLIENT_ID}`, payload))
}

export const bookBet = async (payload) => {
  return parseData(
    fetchWrapper.post(
      `${import.meta.env.VITE_BASE_API}/api/sports/book-bet?channel=mobile`,
      payload
    )
  )
}

export const bookBet2 = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/bets/book-bet/${CLIENT_ID}`, payload))
}

export const loadBetslip = async (betslipId) => {
  return parseData(
    fetchWrapper.post(`${NEW_BASE_API}/bets/find-coupon`, { clientId: CLIENT_ID, betslipId })
  )
}

export const getGames = async (page) => {
  return parseData(
    fetchWrapper.get(
      `${import.meta.env.VITE_BASE_API}/api/casino/web-games?paginate=1&page=${page}`
    )
  )
}

export const getCasinoStartUrl = async (provider, payload) => {
  switch (provider) {
    case 'c27':
      payload = { ...payload, demo: 0 }
      return await startC27Game(payload)
    case 'shack-evolution':
      return await startShackEvoGame(payload?.game_id)
    case 'tada-games':
      return await startTadaGame(payload)
    case 'golden-race':
      payload = { ...payload, demo: 0 }
      return await playGame({ provider, payload })
    case 'evo-play':
      payload = {
        ...payload,
        home_url: 'https://www.cubebet.ng/Games',
        deposit_url: 'https://www.cubebet.ng/Account/Deposit'
      }
      return await startEvoPlayGame(payload)
    default:
  }
}

export const getTopGameCategories = async () => {
  return parseData(
    fetchWrapper.get(`${import.meta.env.VITE_BASE_API}/api/casino/top-games-categories`)
  )
}

export const gamesByTopCategory = async (id) => {
  return parseData(fetchWrapper.get(`${import.meta.env.VITE_BASE_API}/api/casino/top-games/${id}`))
}

export const getPaymentMethods = async () => {
  return parseData(
    fetchWrapper.get(`${import.meta.env.VITE_BASE_API}/api/utilities/payment-methods`)
  )
}

export const getBanksList = async () => {
  return parseData(fetchWrapper.get(`${NEW_BASE_API}/user/wallet/${CLIENT_ID}/banks`))
}

export const fetchBankAssets = async () => {
  return parseData(fetchWrapper.get(`${NEW_BASE_API}/user/wallet/bank-accounts`))
}

export const verifyAccount = async (payload) => {
  return parseData(
    fetchWrapper.post(`${NEW_BASE_API}/user/wallet/verify-bank-account?source=website`, payload)
  )
}

export const getDepositURL = async (payload) => {
  return parseData(
    fetchWrapper.post(`${NEW_BASE_API}/user/wallet/initiate-deposit?source=website`, payload)
  )
}

export const verifyDeposit = async (channel, ref) => {
  return parseData(
    fetchWrapper.get(
      `${NEW_BASE_API}/user/wallet/verify-payment?paymentChannel=${channel}&transactionRef=${ref}&clientId=${CLIENT_ID}`
    )
  )
}

export const withdrawalRequest = async (payload) => {
  return parseData(fetchWrapper.post(`${NEW_BASE_API}/user/wallet/withdraw?source=website`, payload))
}

export const getUserBonus = async () => {
  return parseData(fetchWrapper.get(`${NEW_BASE_API}/bonus/user/list?client_id=${CLIENT_ID}`))
}

export const checkFirstDeposit = async () => {
  return parseData(
    fetchWrapper.get(`${NEW_BASE_API}/bonus/user/check-first-deposit?client_id=${CLIENT_ID}`)
  )
}

export const awardDeposit = async (payload) => {
  return parseData(
    fetchWrapper.post(`${NEW_BASE_API}/bonus/user/award?client_id=${CLIENT_ID}`, payload)
  )
}

export const AboutUs = async () => {
  return parseData(fetchWrapper.get(`${BASE_API}/api/utilities/cms/page/about-us`))
}

export const ResponsibleGaming = async () => {
  return parseData(fetchWrapper.get(`${BASE_API}/api/utilities/cms/page/responsible-gaming`))
}

export const TermsandConditions = async () => {
  return parseData(fetchWrapper.get(`${BASE_API}/api/utilities/cms/page/terms-and-conditions`))
}

export const BettingRules = async () => {
  return parseData(fetchWrapper.get(`${BASE_API}/api/utilities/cms/page/betting-rules`))
}
