<template>
  <div id="j_betslip" class="x-item x-betslip-wrapper">
    <div class="x-tabs x-tabs-no-animation betslip-tabs">
      <div class="x-tabs-nav">
        <div
          class="x-tabs-ink-bar"
          style="display: block; width: 101.5px"
          :style="currentView === 'betslip' ? 'left: 5px' : 'left: 115.5px'"
        ></div>
        <div class="x-tabs-tab x-tabs-tab-active" @click="switchBetContainerView('betslip')">
          <div>
            <span>Betslip</span
            ><span
              class="x-bet-count x-bet-count-fix"
              v-show="couponStore.coupon.selections.length"
              >{{ couponStore.coupon.selections.length }}</span
            >
          </div>
        </div>
        <div class="x-tabs-tab" @click="switchBetContainerView('open-bets')">
          <div>
            <span>Open Bets</span
            ><span class="x-bet-count x-bet-count-fix" v-show="utilsStore.openBetCount">{{
              utilsStore.openBetCount
            }}</span>
          </div>
        </div>
      </div>
      <div class="x-tabs-content" style="transform: translateX(0%) translateZ(0px)">
        <div class="x-tabs-tabpane" style=""></div>
        <div class="x-tabs-tabpane" style="display: none"></div>
      </div>
    </div>
    <div class="x-betslips" style="">
      <BetContainerBetslip v-if="currentView === 'betslip'"></BetContainerBetslip>
      <BetContainerOpenBets v-else></BetContainerOpenBets>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BetContainerBetslip from '@/components/Betslip/BetContainerBetslip.vue'
import BetContainerOpenBets from '@/components/Betslip/BetContainerOpenBets.vue'
import { useCouponStore, useUtilstStore } from '@/stores'

defineEmits(['toggle-betslip'])
const currentView = ref('betslip')
const couponStore = useCouponStore()
const utilsStore = useUtilstStore()

function switchBetContainerView(view) {
  currentView.value = view
}
</script>

<style>
.x-item {
  margin-bottom: 15px;
}
.x-betslip-wrapper {
  background: #353a45;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 5px;
}
.x-betslip-wrapper .x-item-title {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #fff;
  font-size: 16px;
  line-height: 22px;
  padding: 5px 5px 10px;
}
.x-betslip-wrapper .betslip-tabs {
  background: #353a45;
}
.x-betslip-wrapper .betslip-tabs .x-tabs-nav {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-bottom: 5px;
  padding: 5px 5px 0;
}
.x-betslip-wrapper .betslip-tabs .x-tabs-tab {
  color: #fff;
  font-size: 16px;
  line-height: 22px;
  padding: 8px 10px 6px;
  cursor: pointer;
}
.x-betslip-wrapper .betslip-tabs .x-tabs-tab-active {
  color: #fff;
}
.x-betslip-wrapper .betslip-tabs .x-tabs-ink-bar {
  height: 3px;
}
.x-betslip-wrapper .betslip-tabs.sim-theme .x-tabs-ink-bar {
  background-color: #fafd00;
}
.x-betslip-wrapper .x-bet-count {
  background: rgba(234, 236, 239, 0.15);
  border-radius: 50%;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  margin-left: 5px;
  vertical-align: top;
  width: 20px;
}

/*  */
.x-betslips .x-list-nav .x-table-cell {
  background: var(--brand-secondary);
  border-radius: 2px 2px 0 0;
  color: #ffffff;
  font-size: 12px;
  height: 36px;
  line-height: 36px;
  margin-right: 3px;
  max-width: 33%;
  text-align: center;
  text-transform: capitalize;
}
.x-betslips .x-list-nav .x-table-cell:last-of-type {
  margin-right: 0;
}
.x-betslips .x-list-nav .x-table-cell:hover {
  cursor: pointer;
}
.x-betslips .x-list-nav .x-table-cell--active {
  background: #ffffff;
  color: #353a45;
}
.x-betslips .x-list-nav .x-table-cell-disabled {
  background: rgba(13, 151, 55, 0.5);
  color: rgba(255, 255, 255, 0.5);
  text-decoration: line-through;
}
.x-betslips .x-list-nav:last-of-type {
  text-align: right;
}
.x-betslips .x-opertaion {
  padding: 8px 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #ffffff;
}
.x-betslips .x-opertaion .x-align--right {
  text-align: right;
}
.x-betslips .x-opertaion .x-text-min {
  font-size: 12px;
  -webkit-transform: scale(0.833);
  -ms-transform: scale(0.833);
  transform: scale(0.833);
  color: #3656a3;
  display: inline-block;
  height: 24px;
  line-height: 24px;
  padding: 0 5px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid #eaecef;
  border-radius: 2px;
  cursor: pointer;
}
.x-betslips .x-opertaion .x-icon--tips,
.x-betslips .x-opertaion .x-icon--switch {
  display: inline-block;
  vertical-align: middle;
}
.x-betslips .x-opertaion .x-icon--switch {
  color: #dcdee5;
}
.x-betslips .x-opertaion .x-icon--switch::before {
  content: '\e628';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-betslips .x-opertaion .x-icon--switch + span {
  font-size: 12px;
  color: #000000;
  display: inline-block;
  vertical-align: middle;
  margin: 0 4px;
}
.x-betslips .x-opertaion .x-icon--switch-active {
  color: var(--brand-secondary);
}
.x-betslips .x-opertaion .x-icon--switch-active::before {
  content: '\e63f';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-betslips .x-opertaion .x-icon--tips {
  color: #dcdee5;
}
.x-betslips .x-opertaion .x-icon--tips::before {
  content: '\e651';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-betslips .x-opertaion .x-icon--tips:before {
  font-size: 14px;
}
.x-betslips .x-opertaion-fix {
  padding: 5px 6px;
}
.x-text-second {
  font-size: 13px;
  line-height: 1;
}
.x-betslips {
  position: relative;
}
.x-betslips .x-betslips-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 888;
  background: rgba(255, 255, 255, 0.9);
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding-top: 45%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
}
.x-betslips .x-betslips-loading > div {
  display: table-cell;
  text-align: center;
}
.x-betslips .x-betslips-loading .x-text-msg {
  color: #353a45;
  font-size: 12px;
  line-height: 14px;
}
.x-betslips .x-betslips-loading .x-icon-loading::before {
  content: '\e648';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-betslips .x-betslips-loading .x-icon-loading:before {
  width: 14px;
  height: 14px;
  display: table-cell;
  font-size: 12px;
  text-align: center;
  color: #9ca0ab;
  vertical-align: middle;
  -webkit-animation: loading 1.5s infinite linear;
  animation: loading 1.5s infinite linear;
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
.x-betslips .x-btn-wrapper {
  width: 204px;
  margin: 0 auto;
}
.x-betslips .af-button {
  width: 100%;
  height: 38px;
  padding-left: 0;
  padding-right: 0;
  text-align: center;
  border: none !important;
  font-size: 14px;
  border-radius: 2px;
}
.x-betslips .af-button--primary {
  background: var(--brand-secondary) !important;
  color: #ffffff !important;
}
.x-betslips .is-disabled,
.x-betslips .is-disabled:hover,
.x-betslips .is-disabled:active {
  background: #dcdee5 !important;
  color: #9ca0ab !important;
}
.x-betslips .x-input-wrapper {
  width: 78px;
}
.x-betslips .x-input-wrapper .x-input {
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  font-size: 12px;
  height: 100%;
  padding: 0 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 20px;
  line-height: 20px;
  text-align: right;
}
.x-betslips .x-input-wrapper.x-input-wrapper--error .x-input {
  border-color: #e41827 !important;
}
.x-betslips .x-input-wrapper.x-input-wrapper--error .x-input-icon--clickable:hover {
  color: #e41827 !important;
}
.x-betslips .x-input-wrapper.x-input-wrapper--error .x-input-icon--clickable:hover + .x-input {
  border-color: #e41827 !important;
}
.x-betslips .x-input-wrapper.x-input-wrapper--active .x-input {
  border-color: var(--brand-secondary);
}
.x-betslips .x-input-wrapper.x-input-wrapper--active .x-input-icon--clickable:hover {
  color: var(--brand-secondary) !important;
}
.x-betslips .x-input-wrapper.x-input-wrapper--active .x-input-icon--clickable:hover + .x-input {
  border-color: var(--brand-secondary) !important;
}
.x-betslips .x-input-wrapper .x-input-icon--clickable:hover {
  color: #9ca0ab !important;
}
.x-betslips .x-input-wrapper .x-input-icon--clickable:hover + .x-input {
  border-color: #b4b4b4 !important;
}
.x-betslips .x-stake {
  background: #ffffff;
}
.x-betslips .x-stake .x-input {
  background: #ffffff;
  height: 20px;
  line-height: 20px;
}
.x-betslips .x-stake .x-label {
  color: #353a45;
  font-size: 12px;
  font-weight: 500;
}
.x-betslips .x-stake .x-label.bold {
  font-weight: bold;
}
.x-betslips .x-stake .x-stake-tips {
  background: #ffffff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #9ca0ab;
  font-size: 10px;
  line-height: 13px;
  padding: 7px;
  width: 100%;
}
.x-betslips .x-stake .x-stake-tips .x-icon--tips {
  color: #9ca0ab;
}
.x-betslips .x-stake .x-stake-tips .x-icon--tips::before {
  content: '\e651';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-betslips .x-stake .x-stake-tips .x-icon--tips:before {
  font-size: 12px;
}
.x-betslips .x-stake .x-plays-wrapper {
  background: #ffffff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 10px 7px;
  width: 100%;
}
.x-betslips .x-stake .x-plays-wrapper .x-type,
.x-betslips .x-stake .x-plays-wrapper .x-num,
.x-betslips .x-stake .x-plays-wrapper .x-money,
.x-betslips .x-stake .x-plays-wrapper .x-label {
  display: inline-block;
  font-size: 12px;
  vertical-align: middle;
}
.x-betslips .x-stake .x-plays-wrapper .x-value {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  font-size: 12px;
}
.x-betslips .x-stake .x-plays-wrapper .x-type {
  text-align: left;
  width: 70px;
}
.x-betslips .x-stake .x-plays-wrapper .x-num {
  text-align: center;
  width: 40px;
}
.x-betslips .x-stake .x-plays-wrapper .x-money {
  float: right;
  text-align: right;
  width: 95px;
}
.x-betslips .x-stake .x-plays-title {
  color: #353a45;
  font-size: 0;
  font-weight: bold;
  height: 16px;
  margin-bottom: 6px;
}
.x-betslips .x-stake .x-plays-title > * {
  line-height: 16px;
}
.x-betslips .x-stake .x-plays-item {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 0;
  overflow: hidden;
  padding: 8px 0;
}
.x-betslips .x-stake .x-plays-item .x-type,
.x-betslips .x-stake .x-plays-item .x-num,
.x-betslips .x-stake .x-plays-item .x-money,
.x-betslips .x-stake .x-plays-item .x-label {
  line-height: 20px;
}
.x-betslips .x-stake .x-plays-item .x-value {
  float: right;
}
.x-betslips .x-stake .x-plays-item .x-value .x-currency {
  margin-right: 0.33333333rem;
}
.x-betslips .x-stake .x-line-wrapper {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  min-height: 22px;
}
.x-betslips .x-stake .x-opt-assist {
  font-size: 0;
  margin-bottom: 13px;
}
.x-betslips .x-stake .x-opt-assist .x-opt-assist-input {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
.x-betslips .x-stake .x-opt-assist .x-opt-assist-input .x-label {
  display: inline-block;
  vertical-align: middle;
  width: 40%;
}
.x-betslips .x-stake .x-opt-assist .x-opt-assist-input .x-content {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  float: right;
  height: 28px;
  line-height: 28px;
  text-align: right;
}
.x-betslips .x-stake .x-opt-assist .x-opt-assist-input .x-s-unit {
  font-size: 10px;
  line-height: 14px;
  margin-right: 0.33333333rem;
}
.x-betslips .x-stake .x-money-wrapper {
  background: #ffffff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  padding: 5px 0 10px;
}
.x-betslips .x-stake .x-money-wrapper > div {
  color: #1b1e25;
  font-size: 0;
  overflow: hidden;
}
.x-betslips .x-stake .x-money-wrapper .order-first {
  -webkit-box-ordinal-group: 0;
  -webkit-order: -1;
  -ms-flex-order: -1;
  order: -1;
}
.x-betslips .x-stake .x-money-wrapper .x-label,
.x-betslips .x-stake .x-money-wrapper .x-value {
  display: inline-block;
  line-height: 28px;
  vertical-align: middle;
}
.x-betslips .x-stake .x-money-wrapper .x-label {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 12px;
  margin-right: 8px;
  max-width: 120px;
  padding-left: 8px;
}
.x-betslips .x-stake .x-money-wrapper .x-label-fix {
  max-width: 60px;
}
.x-betslips .x-stake .x-money-wrapper .x-value {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  float: right;
  font-size: 14px;
  max-width: calc(100% - 88px);
  padding-right: 10px;
  text-align: right;
}
.x-betslips .x-stake .x-money-wrapper .x-value-fix {
  max-width: calc(100% - 68px);
}
.x-betslips .x-stake .x-money-wrapper .warn {
  background-color: #feffe4;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #1b1e25;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 12px;
  margin: 0 8px;
  margin-bottom: -10px;
  padding: 10px;
}
.x-betslips .x-stake .x-coupon-title {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  white-space: nowrap;
}
.x-betslips .x-stake .x-coupon-title .x-value {
  max-width: auto;
}
.x-betslips .x-stake .x-coupon-title .x-label {
  max-width: 126px;
}
.x-betslips .x-stake .x-btn-wrapper {
  margin-top: 8px;
}
.x-betslips .x-stake .x-btn--submit {
  background: #ffffff;
  border: 1px solid var(--brand-secondary) !important;
  color: var(--brand-secondary);
  font-size: 14px;
  line-height: 16px;
  width: 100%;
}
.x-betslips .x-stake .x-btn--submit .af-icon-loading:before {
  font-size: 14px;
}
/* .x-betslips .x-stake .x-btn--submit:hover,
.x-betslips .x-stake .x-btn--submit:focus {
  background: #ffffff;
  border: 1px solid #26448a !important;
  color: #32ce62;
} */
.x-betslips .x-stake .x-icon--error:before {
  display: inline-block;
  font-size: 10px;
  line-height: 1;
  -webkit-transform: translate3d(0, -1px, 0);
  transform: translate3d(0, -1px, 0);
}
.x-betslips .x-stake .x-error-wrap + .x-coins {
  margin-top: 0;
}
.x-betslips .x-coupon-wrapper .x-coupon-opt,
.x-betslips .x-coupon-wrapper .x-error-wrapper {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
}
.x-betslips .x-betslip-search {
  background: #ffffff;
  padding: 18px 11px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-betslips .x-betslip-search .x-text-main {
  color: #000000;
  font-size: 12px;
  line-height: 16px;
}
.x-betslips .x-betslip-search .x-opt-wrapper {
  margin: 8px 0 12px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
}
.x-betslips .x-betslip-search .x-opt-wrapper .x-input-wrapper,
.x-betslips .x-betslip-search .x-opt-wrapper .af-button {
  display: inline-block;
  vertical-align: top;
}
.x-betslips .x-betslip-search .x-opt-wrapper .x-input-wrapper {
  height: 38px;
  width: 100%;
  margin-bottom: 8px;
}
.x-betslips .x-betslip-search .x-opt-wrapper .x-input {
  height: 100%;
  text-align: left;
  padding-left: 10px;
}
.x-betslips .x-betslip-search .x-opt-wrapper .af-button {
  border-radius: 2px;
  width: 100%;
}
.x-betslips .x-betslip-search .x-opt-wrapper .country-select {
  width: 100%;
  height: 38px;
  margin-bottom: 8px;
}
.x-betslips .x-betslip-search .x-opt-wrapper .country-select .af-select-list {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 12px;
}
.x-betslips .x-betslip-search .x-opt-wrapper .country-select .af-select-list .af-select-item {
  padding: 8px 0;
}
.x-betslips .x-betslip-search .x-opt-wrapper .country-select.selected .af-select-title {
  border-color: var(--brand-secondary);
}
.x-betslips .x-betslip-search .x-opt-wrapper .country-select .af-select-title {
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  font-size: 12px;
  height: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  line-height: 100%;
  text-align: left;
  padding: 0 10px;
}
.x-betslips .x-betslip-search .x-opt-wrapper .country-select .af-select-title .af-select-icon-item {
  vertical-align: middle;
}
.x-betslips
  .x-betslip-search
  .x-opt-wrapper
  .country-select
  .af-select-title
  .af-select-icon-item:before {
  vertical-align: middle;
  font-family: 'iconfont';
  display: inline-block;
  content: '\e603';
  font-size: 1rem;
  color: #c2c2c2;
}
.x-betslips
  .x-betslip-search
  .x-opt-wrapper
  .country-select
  .af-select-title
  .af-select-icon-item
  .icon {
  display: none;
  font-size: 0px;
}
.x-betslips .x-betslip-search .x-opt-wrapper .country-select .af-select-title .af-select-input {
  padding: 0;
  vertical-align: middle;
}
.x-betslips
  .x-betslip-search
  .x-opt-wrapper
  .country-select
  .af-select-title
  .af-select-input
  .placeholder {
  color: #c2c2c2;
}
.x-betslips .x-betslip-search .x-text-tips {
  font-size: 12px;
  line-height: 16px;
  color: #dcdee5;
}
.x-betslips .x-betslip-search .x-error-wrap {
  display: block;
}
.x-betslips .x-betslip-search .x-error-wrap .x-error {
  padding: 7px 5px;
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}
.x-betslips .x-betslip-search .x-error-wrap .x-icon--error {
  max-width: 20px;
  display: table-cell;
}
.x-betslips .x-betslip-search .x-error-wrap .x-text-info {
  display: table-cell;
  min-width: 1%;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  max-width: calc(100% - 20px);
  line-height: 12px;
}
.x-betslips .x-stake .x-error-tips,
.x-betslips .x-stake .x-text-error {
  font-size: 10px;
  line-height: 14px;
  color: #e41827;
  text-align: right;
}
.x-betslips .x-stake .x-error-wrap {
  width: 100%;
  padding: 0 10px 5px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-top: -10px;
}
.x-betslips .x-stake .x-error-wrap .x-error {
  margin: 0;
  width: 100%;
  position: relative;
  padding: 5px;
  background: transparent;
}
.x-betslips .x-stake .x-error-wrap .x-text-info {
  position: absolute;
  left: 0;
  top: 50%;
  -webkit-transform: translate3d(0, -50%, 0);
  transform: translate3d(0, -50%, 0);
  padding-left: 18px;
}
</style>
