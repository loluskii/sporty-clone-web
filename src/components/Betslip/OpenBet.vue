<template>
  <div class="m-cashout-container m-cashout-detail" style="position: relative">
    <div class="m-border"></div>
    <div v-for="(selection, index) in selections" :key="index" class="m-bet-detail">
      <div class="m-text-main m-outcome-desc">
        <span>{{ selection.outcomeName }} @{{ selection.odds.toFixed(2) }}</span>
      </div>
      <!-- <div class="m-outcome-odds">
        <span class="m-icon-live" data-cms-key="live_odds" data-cms-page="bet_history"
          >Live Odds</span
        >
        <span class="m-odds">{{ selection.odds.toFixed(2) }}</span>
      </div> -->
      <div class="m-text-min">
        <span>{{ selection.marketName }}</span>
      </div>
      <div class="m-text-min">
        <span>{{ selection.eventName }}({{ formatDate(selection.eventDate, 'DD/MM hh:mm') }})</span>
      </div>
    </div>
    <div class="m-bet-money">
      <div>
        <div class="m-col">
          <div class="m-col-title" data-cms-key="bet_stake" data-cms-page="cashout">Bet Stake</div>
          <div class="m-col-text">{{ bet.stake.toFixed(2) }}</div>
        </div>

        <div class="m-col">
          <div class="m-col-title" data-cms-key="pot_win" data-cms-page="bet_history">Pot. Win</div>
          <div class="m-col-text">{{ bet.possibleWin.toFixed(2) }}</div>
        </div>
      </div>
    </div>
    <div class="m-body">
      <div v-if="isCashoutMode" class="m-comfirm-wrapper">
        <p class="m-confirm-title" data-cms-key="confirm_cashout" data-cms-page="cashout">
          Confirm Cashout
        </p>
        <div class="m-text-wrapper">
          <p>
            <span class="m-label" data-cms-key="full_cashout" data-cms-page="cashout"
              >Full Cashout</span
            >
            <span class="m-value">NGN {{ bet.cashOutAmount.toFixed(2) }} </span>
          </p>
        </div>
        <div class="m-btn-wrapper">
          <button @click="isCashoutMode = false" class="af-button af-button--text">
            <span><span data-cms-key="cancel" data-cms-page="common_functions">Cancel</span></span>
          </button>
          <button @click.prevent="confirmCashout" class="af-button confirm-sub af-button--primary">
            <span
              ><span data-cms-key="confirm" data-cms-page="common_functions">Confirm</span></span
            >
          </button>
        </div>
      </div>
      <div class="m-btn-wrapper">
        <button
          :disabled="!bet.cashOutAmount || cashingOut"
          @click.prevent="handleCashout(bet)"
          :class="!bet.cashOutAmount || cashingOut ? 'is-disabled' : ''"
          class="af-button af-button--opt af-button--primary"
        >
          <span v-if="!cashingOut">
            {{
              bet.cashOutAmount && bet.cashOutAmount > 0 ? `Cashout` : 'Cashout Unavailable'
            }}</span
          >
          <img v-else src="/loader.gif" height="24" width="24" alt="" srcset="" />
        </button>
      </div>
      <p class="m-text-error" style="display: none"></p>
    </div>
  </div>
</template>

<script setup>
import { formatDate, performCashout } from '@/helpers'
import emitter from '@/plugins/emitter'
import { ref } from 'vue'
const cashingOut = ref(false)
const isCashoutMode = ref(false)

defineEmits(['refresh-betslip'])

const props = defineProps({
  selections: Array,
  bet: Object
})

function handleCashout() {
  isCashoutMode.value = true
}

async function confirmCashout() {
  cashingOut.value = true
  isCashoutMode.value = false
  const res = await performCashout({
    betId: props.bet.id,
    amount: props.bet.cashOutAmount
  })
  cashingOut.value = false
  isCashoutMode.value = false

  if (res.success) {
    console.log('cashout successful')
    
    // emitter.emit('showDialogueToaster', 'Cashout Successful!')
    // await getBetsData()
  } else {
    // emitter.emit('showDialogueToaster', res.message)
  }
}
</script>

<style>
.m-cashout .m-cashout-error .m-icon-load::before {
  content: '\e648';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-cashout .m-cashout-error .m-icon-load:before {
  width: 30px;
  height: 30px;
  display: table-cell;
  font-size: 14px;
  text-align: center;
  color: #9ca0ab;
  vertical-align: middle;
  -webkit-animation: loading 1.5s infinite linear;
  animation: loading 1.5s infinite linear;
}
.m-cashout .m-cashout-error .af-button--text {
  margin-top: 8px;
  border: 1px solid #9ca0ab;
  color: #eaecef;
  font-size: 10px;
  line-height: 14px;
  border-radius: 2px;
  height: 20px;
  width: 63px;
  padding: 0;
}
.m-cashout .m-bet-money {
  border-top: 5px solid #eaecef;
}
.m-cashout .m-bet-money.no-border {
  border-top: 0;
}
.m-cashout .m-bet-money > div:not(.cashout-nav) {
  padding: 10px 10px 8px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: table;
  width: 100%;
}
.m-cashout .m-bet-money .m-col {
  display: table-cell;
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-width: 33.333%;
}
.m-cashout .m-bet-money .m-col:last-of-type {
  text-align: right;
}

.m-cashout .m-bet-money .m-col-title {
  font-size: 12px;
  color: #353a45;
  line-height: 14px;
  margin-bottom: 4px;
}
.m-cashout .m-bet-money .m-col-text {
  font-size: 12px;
  line-height: 14px;
  color: #353a45;
  font-weight: bold;
}

.m-cashout .m-comfirm-wrapper {
  margin: 0 auto;
  padding: 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid #eaecef;
  -webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2);
  position: absolute;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin: auto;
  width: 90%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  background: #ffffff;
  text-align: left;
  visibility: initial;
  z-index: 25;
  color: #353a45;
}
.m-cashout .m-comfirm-wrapper span {
  padding-bottom: 5px;
}
.m-cashout .m-comfirm-wrapper .m-confirm-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}
.m-cashout .m-comfirm-wrapper .m-text-wrapper p {
  overflow: hidden;
  width: 100%;
}
.m-cashout .m-comfirm-wrapper .m-text-wrapper .m-label,
.m-cashout .m-comfirm-wrapper .m-text-wrapper .m-value {
  display: inline-block;
  font-size: 12px;
  line-height: 14px;
  color: #000000;
  vertical-align: top;
}
.m-cashout .m-comfirm-wrapper .m-text-wrapper .m-value {
  float: right;
  text-align: right;
  padding: 0 2px;
  font-weight: bold;
}
.m-cashout .m-comfirm-wrapper .m-text-wrapper-fix p:nth-of-type(1) {
  margin-bottom: 3px;
}
.m-cashout .m-comfirm-wrapper .m-text-wrapper-fix p:nth-of-type(2) {
  line-height: 17px;
}
.m-cashout .m-comfirm-wrapper .m-btn-wrapper {
  padding: 0 !important;
  margin-bottom: 0 !important;
  margin-top: 0;
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: end;
  -webkit-justify-content: flex-end;
  -ms-flex-pack: end;
  justify-content: flex-end;
}
.m-cashout .m-comfirm-wrapper .m-btn-wrapper .af-button--text {
  margin-right: 5px;
  font-size: 12px;
}
.m-cashout .m-comfirm-wrapper .m-btn-wrapper .confirm-sub {
  font-size: 12px;
  padding: 0 15px;
  -webkit-box-flex: initial;
  -webkit-flex: initial;
  -ms-flex: initial;
  flex: initial;
  margin-left: 5px;
}
.m-cashout .m-comfirm-wrapper .m-btn--submit {
  background: #ffffff;
  color: #262262;
  border: 1px solid #262262 !important;
  font-size: 14px;
  line-height: 16px;
  width: 100%;
}
.m-cashout .m-comfirm-wrapper .m-btn--submit .af-icon-loading:before {
  font-size: 14px;
}
.m-cashout .m-comfirm-wrapper .m-btn--submit:hover,
.m-cashout .m-comfirm-wrapper .m-btn--submit:focus {
  background: #ffffff;
  color: #262262;
  border: 1px solid #262262 !important;
}
.m-cashout.m-cashout-fix {
  margin-bottom: -5px;
}
.m-cashout .m-cashout-item {
  background: #ffffff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 8px 0;
  width: 100%;
}
.m-cashout .m-cashout-list {
  border-radius: 2px;
  margin-top: 6px;
}
.m-cashout .m-cashout-list:first-of-type {
  margin-top: 0;
}
.m-cashout .x-of-y-text {
  color: #9ca0ab;
  margin-left: 16px;
  text-transform: lowercase;
}
</style>
