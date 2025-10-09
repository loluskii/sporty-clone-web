<template>
  <div class="m-cashout">
    <div v-if="!openBets.length" class="m-cashout-error">
      <div>
        <i v-if="isLoading" class="m-icon-load"></i>
        <p class="m-text-msg" data-cms-key="no_bets_available" >
          {{ isLoading ? 'Loading' : 'No bets available' }}
        </p>
      </div>
    </div>
    <ul v-else class="m-cashout-list">
      <li
        v-for="(bet, index) in openBets"
        :key="index"
        class="m-cashout-item"
        style="margin-bottom: 5px"
      >
        <div class="m-cashout-title">
          <span class="m-label">
            {{ bet.betCategory }}
            <span class="combo"> (x{{ bet.totalSelections }}) </span>
          </span>
          <!-- <span class="m-desc" data-cms-key="live_now" data-cms-page="bet_history">Live Now</span> -->
        </div>
        <OpenBet
          v-show="selectionIsOpen(bet.id)"
          :selections="bet.selections"
          :bet="bet"
          :refresh-betslip="getBetHistory"
        ></OpenBet>
        <div v-show="!selectionIsOpen(bet.id)" class="m-cashout-bet">
          <div class="m-sel-item">
            <div v-for="(selection, s) in bet.selections.slice(0, 3)" :key="s" class="m-text-min">
              <span>{{ selection.eventName }}</span>
            </div>
          </div>
        </div>
        <!-- {{ bet }} -->

        <div @click="toggleSelectionsState(bet.id)" class="m-operation">
          <i class="m-fold m-icon-fold"></i>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore, useUtilsStore } from '@/stores'
import { getBets } from '@/helpers'
import OpenBet from './OpenBet.vue'

const openBets = ref([])
const usersStore = useUsersStore()
const isLoading = ref(false)
const openSelections = ref([])
const utilsStore = useUtilsStore()

const selectionIsOpen = (id) => {
  return openSelections.value.includes(id)
}

const toggleSelectionsState = (id) => {
  const i = openSelections.value.includes(id)
  if (i) {
    openSelections.value = openSelections.value.filter((x) => x !== id)
  } else {
    openSelections.value.push(id)
  }
}

async function getBetHistory() {
  if (!usersStore.currentUser) return
  let payload = {
    clientId: import.meta.env.VITE_CLIENT_ID,
    date: '',
    status: 0,
    userId: usersStore.currentUser.id
  }
  try {
    isLoading.value = true
    const response = await getBets(payload)
    isLoading.value = false
    if (response.bets) {
      openBets.value = response.bets
      utilsStore.openBetCount = response.bets.length
    } else {
      openBets.value = []
      utilsStore.openBetCount = 0
    }
  } catch (error) {
    isLoading.value = false
    openBets.value = []
  }
}

onMounted(async () => {
  await getBetHistory()
})
</script>
<style>
.m-cashout .m-cashout-title {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  display: grid;
  font-size: 12px;
  font-weight: bold;
  grid-template-columns: 1fr 60px;
  line-height: 16px;
  padding: 0 10px;
  text-transform: capitalize;
}
.m-cashout .m-cashout-title .m-label,
.m-cashout .m-cashout-title .m-desc {
  display: table-cell;
  vertical-align: middle;
}
.m-cashout .m-cashout-title .m-label {
  color: #000000;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-width: 1%;
}
.m-cashout .m-cashout-title .combo {
  text-transform: none;
}
.m-cashout .m-cashout-title .m-desc {
  color: var(--brand-primary);
  text-align: right;
  width: 60px;
}
.m-text-second {
  font-size: 13px;
  line-height: 1;
}
@-webkit-keyframes loading {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes loading {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.m-cashout .m-bet-money .m-col-title {
  font-size: 12px;
}
.m-cashout .m-cashout-detail {
  margin-top: 4px;
}
.m-cashout .m-cashout-detail .m-border {
  border-top: 1px solid #eaecef;
  margin: 0 10px;
}
.m-cashout .m-cashout-detail .m-bet-detail {
  border-bottom: 1px solid #eaecef;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 6px 10px 14px;
  position: relative;
}
.m-cashout .m-cashout-detail .m-bet-detail:last-of-type {
  border-bottom: none;
}
.m-cashout .m-cashout-detail .m-bet-detail .status-icon {
  cursor: pointer;
}
.m-cashout .m-cashout-detail .m-outcome-desc {
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
}
.m-cashout .m-cashout-detail .m-outcome-desc > span {
  display: table-cell;
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-width: 1%;
}
.m-cashout .m-cashout-detail .m-outcome-desc > span:nth-of-type(2) {
  margin-left: 5px;
  min-width: 65px;
  text-align: right;
}
.m-cashout .m-cashout-detail .m-outcome-odds {
  font-size: 0;
  margin: 3px 0 6px;
}
.m-cashout .m-cashout-detail .m-outcome-odds .m-icon-live {
  background-color: #33ea6a;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #1b1e25;
  display: inline-block;
  font-size: 10px;
  height: 14px;
  line-height: 14px;
  margin-top: 3px;
  padding: 0 3px;
  text-align: center;
  vertical-align: top;
}

.m-cashout .m-cashout-detail .m-text-main > span,
.m-cashout .m-cashout-detail .m-text-min > span {
  display: inline-block;
  vertical-align: top;
}
.m-cashout .m-cashout-detail .m-text-main {
  color: #353a45;
  font-size: 12px;
  /* font-weight:500; */
  line-height: 16px;
}
.m-cashout .m-cashout-detail .m-text-min,
.m-cashout .m-cashout-detail .m-score {
  font-size: 10px;
  line-height: 14px;
  width: 100%;
}
.m-cashout .m-cashout-detail .m-text-min {
  color: #353a45;
}
.m-cashout .m-cashout-detail .m-score {
  color: var(--brand-primary);
}
.m-cashout .m-cashout-detail .m-icon-banker {
  background: #353a45;
  border-radius: 50%;
  display: inline-block;
  height: 11px;
  line-height: 11px;
  margin-left: 5px;
  text-align: center;
  width: 11px;
}
.m-cashout .m-cashout-detail .m-icon-banker:before {
  color: #ffffff;
  content: 'B';
  font-size: 10px;
  line-height: 1;
}

.m-cashout .m-cashout-detail .m-btn-wrapper {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  margin: 15px 0 5px 0;
  text-align: right;
  width: 100%;
}
.m-cashout .m-cashout-detail .m-btn-wrapper .m-btn-item,
.m-cashout .m-cashout-detail .m-btn-wrapper .af-button {
  display: inline-block;
  vertical-align: top;
}
.m-cashout .m-cashout-detail .m-btn-wrapper .m-btn-item {
  border: 1px solid var(--brand-primary);
  border-radius: 2px;
  height: 36px;
  margin-right: 10px;
  width: 36px;
}
.m-cashout .m-cashout-detail .m-btn-wrapper .m-btn-item:hover,
.m-cashout .m-cashout-detail .m-btn-wrapper .m-btn-item:active {
  border-color: #9ca0ab;
}
.m-cashout .m-cashout-detail .m-btn-wrapper .af-button {
  border-radius: 2px;
  display: inline-block;
  height: 38px;
  vertical-align: top;
  text-align: center;
  border: none !important;
  font-size: 16px;
}
.m-cashout .m-cashout-detail .m-btn-wrapper .af-button--primary {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  background: var(--brand-primary) !important;
  color: #ffffff !important;
}

.m-cashout .m-cashout-detail .m-btn-wrapper .af-button--text {
  color: var(--brand-primary);
  font-size: 14px;
  font-weight: bold;
}

.m-cashout .m-cashout-detail .m-btn-wrapper .is-disabled {
  background: #dcdee5 !important;
  color: #ffffff !important;
}
.m-cashout .m-cashout-detail .m-btn-wrapper .is-disabled:hover,
.m-cashout .m-cashout-detail .m-btn-wrapper .is-disabled:active {
  background: #dcdee5 !important;
  color: #ffffff !important;
}
.m-cashout .m-cashout-detail .m-btn-wrapper .m-btn--success {
  background: #ffffff;
  border: 1px solid #dcdee5 !important;
  color: #353a45;
  font-size: 14px;
  line-height: 16px;
  width: 100%;
}
.m-cashout .m-cashout-detail .m-btn-wrapper .m-btn--success::before {
  content: '\e60b';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-cashout .m-cashout-detail .m-btn-wrapper .m-btn--success:before {
  color: var(--brand-primary);
  margin-right: 28px;
}
.m-cashout .m-cashout-detail .m-btn-wrapper .m-btn--success:hover,
.m-cashout .m-cashout-detail .m-btn-wrapper .m-btn--success:focus {
  background: #ffffff;
  border: 1px solid #dcdee5 !important;
  color: #353a45;
}
.m-cashout .m-cashout-detail .m-btn-wrapper-fix .af-button {
  font-size: 12px;
}

.m-cashout .m-cashout-detail .m-icon-loading::before {
  content: '\e648';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-cashout .m-cashout-detail .m-icon-loading:before {
  width: 36px;
  height: 36px;
  display: table-cell;
  font-size: 14px;
  text-align: center;
  color: #9ca0ab;
  vertical-align: middle;
  -webkit-animation: loading 1.5s infinite linear;
  animation: loading 1.5s infinite linear;
}
.m-cashout .m-cashout-detail .m-text-error {
  color: #e41827;
  font-size: 10px;
  line-height: 14px;
  margin-bottom: 4px;
  padding: 0 10px;
}
.m-cashout .m-cashout-detail .m-text--green {
  color: var(--brand-primary);
  font-weight: bold;
}
.m-cashout .m-cashout-detail .m-text--gray {
  color: #9ca0ab;
}
.m-cashout .m-cashout-detail .m-value-highlight {
  background: #ed94a5;
}

.m-cashout .m-cashout-detail .bold {
  font-weight: bold;
}

.m-cashout .m-cashout-container .m-body {
  padding: 0 12px 6px;
  position: relative;
  text-align: center;
}
.m-cashout .m-cashout-container .m-body .cashout-title {
  font-size: 16px;
  font-weight: bold;
  padding: 10px 0 0;
}
.m-cashout .m-cashout-container .m-body .m-remain-wrap {
  font-size: 12px;
  min-height: 20px;
  padding-bottom: 10px;
}
.m-cashout .m-cashout-container .m-body .m-text-mini {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #9ca0ab;
  font-size: 11px;
  line-height: 14px;
  padding: 0 7px;
  text-align: center;
}
.m-cashout .m-cashout-container .m-body.confirm {
  visibility: hidden;
}
.instant-dialog.es-dialog .es-dialog-head h1 {
  font-size: 18px;
}
.instant-dialog.es-dialog .es-dialog-head a {
  padding-top: 8px;
}
.instant-dialog.es-dialog .es-dialog-footer .es-dialog-btn {
  font-size: 12px;
  height: 32px;
  line-height: 32px;
  width: 84px;
}
.instant-dialog.es-dialog .es-dialog-footer .es-dialog-btn:first-of-type {
  background: #fff;
  color: var(--brand-primary);
  margin: 0;
}
.instant-dialog.es-dialog .es-dialog-footer .es-dialog-main {
  font-size: 14px;
}
.m-cashout .m-cashout-bet {
  margin-top: 4px;
}
.m-cashout .m-cashout-bet .m-sel-item {
  padding: 6px 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.m-cashout .m-cashout-bet .m-text-min,
.m-cashout .m-cashout-bet .m-text-mini {
  font-size: 10px;
  line-height: 14px;
}
.m-cashout .m-cashout-bet .m-text-min {
  color: #353a45;
}
.m-cashout .m-cashout-bet .m-text-mini {
  color: #9ca0ab;
}
.m-cashout .m-cashout-bet .m-rule-wrap {
  padding: 0 10px;
}

.m-cashout .m-operation {
  background: #ffffff;
  display: block;
  min-height: 16px;
  padding: 0 10px;
  text-align: center;
}

.m-cashout .m-operation .m-fold {
  background: #f2f3f5;
  border-radius: 2px;
  color: var(--brand-primary);
  cursor: pointer;
  display: inline-block;
  height: 16px;
  vertical-align: middle;
  width: 100%;
}
.m-cashout .m-operation .m-fold:before {
  display: inline-block;
}
.m-cashout .m-operation .m-icon-fold::before {
  content: '\e62d';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-cashout .m-operation .m-icon-fold:before {
  font-size: 12px;
}
.m-cashout .m-cashout-error {
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
  background: #50545e;
  height: 153px;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
}
.m-cashout .m-cashout-error > div {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
.m-cashout .m-cashout-error .m-text-msg {
  color: #9ca0ab;
  font-size: 12px;
  line-height: 16px;
}
</style>
