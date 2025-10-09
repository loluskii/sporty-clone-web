<template>
  <BetHistoryLayout>
    <div class="x-order-wrapper">
      <!-- <h1 id="oListPTit" class="print-subtitle print-item">Bet History - Sport Bets</h1> -->
      <div id="x-order-nav" class="x-nav-wrapper">
        <div class="x-wrap">
          <ul class="x-type">
            <li
              class="x-type-item"
              :class="activeBetStatus === status.key ? 'x-type-item--active' : ''"
              v-for="status in betStatus"
              @click="setBetStatus(status.key)"
              :key="status"
            >
              <span class="x-text-main">{{ status.name }}</span>
            </li>
          </ul>
        </div>
      </div>
      <template v-if="settledBets.length && !isLoading">
        <BetHistoryCard
          v-for="(bet, index) in settledBets"
          :key="index"
          :bet-data="bet"
          @click="redirectToBet(bet)"
        ></BetHistoryCard>
        <div v-if="currentPage" class="x-pg-container">
          <div class="pagination pagination">
            <span class="pageNum icon-prev icon-disabled" @click="prevPage"></span>
            <span
              v-for="pageNumber in getPageRange()"
              :key="pageNumber"
              @click="moveToSpecificPage(pageNumber)"
              class="pageNum"
              :class="pageNumber === currentPage ? 'selected' : ''"
              >{{ pageNumber }}</span
            >
            <span class="pageNum icon-next" @click="nextPage"></span>
          </div>
        </div>
      </template>
      <div v-else-if="!isLoading && settledBets.length === 0" class="x-nobet-wrap">
        <div class="x-order-none">
          <span class="no-bet-txt">No Bets Available</span>
        </div>
      </div>
      <LoadingSpinner v-else />
    </div>
  </BetHistoryLayout>
</template>

<script setup>
import BetHistoryLayout from '@/components/Shared/BetHistoryLayout.vue'
import BetHistoryCard from '@/components/BetHistoryCard.vue'
import { getBets } from '@/helpers'
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'

const currentPage = ref(1)
const lastPage = ref(null)
const settledBets = ref([])
const isLoading = ref(false)
const betStatus = [
  { name: 'All', key: '' },
  { name: 'Settled', key: 'settled' },
  { name: 'Unsettled', key: '0' }
]
const activeBetStatus = ref('')
const usersStore = useUsersStore()
const router = useRouter()

// const getDateWithoutTime = (dateString) => {
//   const dateObject = new Date(dateString)
//   // Extract components
//   const day = dateObject.getDate()
//   const month = dateObject.getMonth() + 1 // Month is zero-based, so we add 1
//   const year = dateObject.getFullYear()

//   const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
//   return formattedDate
// }

async function getBetHistory(key = null) {
  let payload = {
    clientId: import.meta.env.VITE_CLIENT_ID,
    // date: '',
    status: key !== null ? key : 'settled',
    userId: usersStore.currentUser.id
  }
  isLoading.value = true
  await getBets(payload, currentPage.value)
    .then((response) => {
      if (response.bets) {
        settledBets.value = response.bets
      } else {
        settledBets.value = []
      }
      lastPage.value = response.lastPage
      isLoading.value = false
    })
    .catch(() => {
      isLoading.value = false
    })
}

const getPageRange = () => {
  const thisPage = currentPage.value ?? 1
  const totalPages = lastPage.value
  const maxButtons = 5 // Maximum number of buttons to display

  // Calculate the starting and ending page numbers for the displayed range
  let startPage = Math.max(thisPage - Math.floor(maxButtons / 2), 1)
  let endPage = Math.min(startPage + maxButtons - 1, totalPages)

  // Adjust the starting page number if the range exceeds the total pages
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(endPage - maxButtons + 1, 1)
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
}

const nextPage = async () => {
  if (currentPage.value < lastPage.value) {
    currentPage.value++
    await getBetHistory()
  }
}

const prevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await getBetHistory()
  }
}

const moveToSpecificPage = async (page) => {
  if (page >= 1 && page <= lastPage.value) {
    currentPage.value = page
    await getBetHistory()
  }
}

function redirectToBet(bet) {
  localStorage.setItem('betDetail', JSON.stringify(bet))
  router.push({ name: 'account-bethistory-detail', params: { id: bet.betslipId } })
}

async function setBetStatus(status) {
  activeBetStatus.value = status
  await getBetHistory(status)
}

onMounted(async () => {
  try {
    await getBetHistory('')
  } catch (error) {
    console.error(error)
  }
})
</script>

<style>
#x-order-nav.x-nav-wrapper {
  background-color: #fff;
  padding: 8px 20px;
}
#x-order-nav.x-nav-wrapper .x-nav {
  border-bottom: 1px solid #eaecef;
  margin-bottom: -3px;
}
#x-order-nav.x-nav-wrapper .x-nav-item {
  display: inline-block;
  padding: 7px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-transform: capitalize;
  font-size: 14px;
  margin-right: 22px;
  cursor: pointer;
}
#x-order-nav.x-nav-wrapper .x-nav-item--active {
  font-size: 16px;
  font-weight: bold;
  border-bottom: 3px solid var(--brand-primary);
}
#x-order-nav.x-nav-wrapper .x-wrap {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  padding: 15px 0 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
#x-order-nav.x-nav-wrapper .x-wrap .x-type {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  text-transform: capitalize;
}
#x-order-nav.x-nav-wrapper .x-wrap .x-type .x-type-item {
  display: inline-block;
  height: 32px;
  padding: 0 20px;
  margin-right: 4px;
  text-align: center;
  line-height: 32px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
  border: 1px solid #eaecef;
  background-color: #fff;
  color: #353a45;
}
#x-order-nav.x-nav-wrapper .x-wrap .x-type .x-type-item .x-text-main {
  font-size: 12px;
}
#x-order-nav.x-nav-wrapper .x-wrap .x-type .x-type-item--active {
  border: 1px solid var(--brand-secondary);
  background-color: var(--brand-secondary);
  color: #fff;
}
#x-order-nav.x-nav-wrapper .x-wrap .x-type .x-type-item--active .x-text-main {
  font-size: 12px;
}
#x-order-nav.x-nav-wrapper .x-wrap .x-date {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}
#x-order-nav.x-nav-wrapper .x-wrap .x-date .date-label {
  width: 128px;
  border: 1px solid #dcdee5;
  font-size: 12px;
  line-height: 30px;
  color: #353a45;
  padding: 0 21px 0 10px;
  position: relative;
}
#x-order-nav.x-nav-wrapper .x-wrap .x-date .date-label .arrow-icon {
  position: absolute;
  top: 2px;
  right: 3px;
  color: var(--brand-primary);
}
#x-order-nav.x-nav-wrapper .x-wrap .x-date .date-label .arrow-icon::before {
  content: '\e6a3';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
#x-order-nav.x-nav-wrapper .x-wrap .x-date .date-value {
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
}
#x-order-nav.x-nav-wrapper .x-wrap .x-date .date-value .date-input {
  cursor: pointer;
  height: 32px;
  line-height: 32px;
  width: 68px;
  background-color: #fff;
  border: 1px solid #eaecef;
}
#x-order-nav.x-nav-wrapper .x-wrap .x-date .action {
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  height: 22px;
  line-height: 22px;
  width: 48px;
  text-align: center;
  background-color: #fff;
  border: 1px solid #eaecef;
}
#x-order-nav.x-nav-wrapper .x-wrap .x-date .action.green {
  margin-right: 6px;
  color: #fff;
  background-color: #0d9737;
  border-color: #0d9737;
}
#x-order-nav.x-nav-wrapper .x-text-main {
  font-size: 15px;
  line-height: 1;
  word-break: break-word;
  font-size: 12px;
  font-weight: 500;
}
.x-order-none {
  margin: 6px auto 39px;
  padding: 45px 0;
  text-align: center;
}
/*  */
</style>
