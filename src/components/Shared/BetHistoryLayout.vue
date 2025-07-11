<template>
  <div class="x-page">
    <Header></Header>
    <div class="x-main x-layout-main">
      <div class="x-main-top"></div>
      <div class="x-table x-main-bottom">
        <div class="x-table-row">
          <div class="x-table-cell x-main-left" style="width: 150px; min-width: 150px">
            <div>
              <div class="x-user">
                <div class="x-user-info">
                  <div class="x-account">
                    <div class="x-user-txt">
                      <em>{{ getUserName }}</em>
                      {{ details.username }}
                    </div>
                  </div>
                  <div class="x-user-items">
                    <div class="x-user-item x-text-main">
                      <span class="x-text-second"><span data-cms-key="balance">Balance</span>
                      </span>
                      <span>NGN {{ balance }}</span>
                    </div>
                  </div>
                </div>
                <ul class="x-user-center x-list">
                  <li class="x-list-item x-text-main" @click="$router.push({ name: 'account-me' })"
                    :class="activeClass('account-me') ? 'x-list-item--active' : 'j'">
                    <span><span data-cms-key="my_account_info">My Account Info</span> </span>
                  </li>

                  <li class="x-list-item x-text-main" @click="$router.push({ name: 'account-deposit' })"
                    :class="activeClass('account-deposit') ? 'x-list-item--active' : 'j'">
                    <span><span data-cms-key="deposit">Deposit</span> </span>
                  </li>
                  <li class="x-list-item x-text-main" @click="$router.push({ name: 'account-withdraw' })"
                    :class="activeClass('account-withdraw') ? 'x-list-item--active' : 'j'">
                    <span><span data-cms-key="withdraw">Withdraw</span> </span>
                  </li>
                  <li class="x-list-item x-text-main"
                    :class="activeClass('account-bethistory') ? 'x-list-item--active' : 'j'"
                    @click="$router.push({ name: 'account-bethistory' })">
                    <span><span data-cms-key="bet_history">Bet History</span> </span>
                  </li>
                  <li class="x-list-item x-text-main" @click="$router.push({ name: 'account-transactions' })"
                    :class="activeClass('account-transactions') ? 'x-list-item--active' : 'j'">
                    <span><span data-cms-key="transactions">Transactions</span> </span>
                  </li>
                  <li 
                    class="x-list-item m-text-main"
                    @click="$router.push({ name: 'account-security' })"
                    :class="activeClass('account-security') ? 'x-list-item--active' : 'j'">
                    <span><span data-cms-key="gifts">Safety & Security</span> </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="x-table-cell x-main-mid" style="width: 615px; min-width: 615px">
            <slot></slot>
          </div>
          <div class="x-table-cell x-main-right" style="width: 235px; min-width: 235px">
            <div>
              <aside class="s-right">
                <!-- Betslip -->
                <BetContainer></BetContainer>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>
<script setup>
import BaseLayout from '@/components/Shared/BaseLayout.vue'
import BetContainer from './BetContainer.vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '@/stores'
import { computed } from 'vue'

const usersStore = useUsersStore()
const route = useRoute()

const balance = computed(() => {
  return usersStore.balance
})

const details = computed(() => {
  return usersStore.details
})
const activeClass = (name) => {
  return route.name === name
}

const getUserName = computed(() => {
  if(details.value.firstName && details.value.lastName){
    return `${details.value.firstName} ${details.value.lastName}`
  }
  return 'User'
})
</script>

<style>
.x-text-second {
  font-size: 13px;
  line-height: 1;
}

.x-user-info {
  background: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.x-user-info .x-account {
  background: #000;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 48px;
  padding: 7px 0 0 12px;
}

.x-user-info .x-account>div {
  display: inline-block;
  vertical-align: middle;
}

.x-user-info .x-account .x-user-txt {
  color: #fff;
  font-size: 10px;
  line-height: 1.3;
  width: 95px;
}

.x-user-info .x-account .x-user-txt em {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  font-size: 14px;
}

.x-user-info .x-img-wrapper {
  border-radius: 31px;
  height: 31px;
  margin-right: 8px;
  overflow: hidden;
  width: 31px;
}

.x-user-info .x-user-items {
  border-top-color: #e0e0e0;
  padding: 2px 5px 4px;
}

.x-user-info .x-icon-infos {
  display: inline-block;
  height: 100%;
  margin-left: 5px;
  position: relative;
  vertical-align: middle;
}

.x-user-info .x-icon-infos:before {
  background: #e41827;
  border-radius: 50%;
  content: '';
  display: inline-block;
  height: 10px;
  vertical-align: middle;
  width: 10px;
}

.x-user-info .x-icon-infos .x-blance-tips {
  background: #fff;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.5);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.5);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: none;
  font-size: 12px;
  left: 0;
  line-height: 14px;
  padding: 10px;
  position: absolute;
  top: 50%;
  -webkit-transform: translate3d(20px, -50%, 0);
  transform: translate3d(20px, -50%, 0);
  width: 376px;
}

.x-user-info .x-icon-infos .x-blance-tips:before {
  background: #fff;
  border-left-color: transparent;
  border-top-color: transparent;
  -webkit-box-shadow:
    2px 2px 2px -1px rgba(0, 0, 0, 0.2),
    2px 2px 2px -1px rgba(0, 0, 0, 0.2);
  box-shadow:
    2px 2px 2px -1px rgba(0, 0, 0, 0.2),
    2px 2px 2px -1px rgba(0, 0, 0, 0.2);
  content: '';
  display: block;
  height: 10px;
  left: -3px;
  position: absolute;
  top: 50%;
  -webkit-transform: translate3d(0, -50%, 0) rotate(135deg);
  transform: translate3d(0, -50%, 0) rotate(135deg);
  width: 10px;
}

.x-user-info .x-icon-infos:hover .x-blance-tips {
  display: block;
}

.x-user-info .x-text-second {
  margin-bottom: 7px;
}

.x-user-info .x-user-item {
  padding: 8px 0 8px 8px;
}

.x-user-info .x-user-item:last-child {
  border-top: 1px solid #eaecef;
}

.x-user-info .x-user-item>span {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: block;
}

.x-user-info .x-text-main {
  font-size: 15px;
  line-height: 1;
  word-break: break-word;
  font-size: 14px;
}

.x-user-info .withdrawable-container {
  color: #50545e;
  font-size: 12px;
}

.x-user-info .withdrawable-container>*:not(:last-child) {
  margin-bottom: 7px;
}

.x-user .x-user-center {
  background: #fff;
  margin-top: 10px;
}

.x-user-center .x-list-item {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
  padding: 10px;
  position: relative;
}

.x-user-center .x-list-item em {
  float: right;
}

.x-user-center .x-list-item .x-gift-value {
  text-align: right;
  width: 25%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.x-user-center .x-list-item .free-wrapper {
  border: solid 1px var(--brand-primary);
  border-radius: 7.5px;
  padding: 1px 4px;
}

.x-user-center .x-list-item .free-wrapper .free-text {
  color: var(--brand-primary);
  display: inline-block;
  font-size: 10px;
  font-weight: bold;
  -webkit-transform: scale(0.8);
  -ms-transform: scale(0.8);
  transform: scale(0.8);
  -webkit-transform-origin: 50% 50%;
  -ms-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
}

.x-user-center .x-list-item .transaction-tip {
  background-color: #e41827;
  border-radius: 50%;
  height: 5px;
  position: absolute;
  top: 5px;
  width: 5px;
}

.x-user-center .x-list-item--active {
  background: var(--brand-secondary);
  color: #fff;
  margin: 0 -1px 0 -1px;
}

.x-user-center .x-list-item--active .kyc-status {
  color: #fff;
}

.x-user-center .x-list-item--active .free-wrapper {
  border-color: #fff;
}

.x-user-center .x-list-item--active .free-wrapper .free-text {
  color: #fff;
}

.x-user-center .x-text-main {
  font-size: 15px;
  line-height: 1;
  word-break: break-word;
  font-size: 12px;
}

.x-user-center .x-list-item-icon {
  float: left;
  margin: 0px 8px 8px 0px;
  width: 12px;
}

.x-user-center .red-dot {
  background-color: #e31826;
  border-radius: 50%;
  display: inline-block;
  height: 7px;
  margin-right: 0.1rem;
  width: 7px;
}

.x-user-center .identity-verification {
  color: var(--brand-primary);
  font-size: 10px;
  margin-top: 3px;
  padding-left: 20px;
}

.x-order-wrapper {
  margin: 0 19px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #eaecef;
  min-height: 695px;
}

.x-order-wrapper .x-title-bar {
  background: #f2f2f2;
  border-top: none;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.x-order-wrapper .x-pg-container {
  background-color: #fff;
  padding: 3px 0;
  margin-top: 3px;
}

.x-order-wrapper .x-pg-container .pageNum {
  font-weight: bold;
  color: #353a45;
}

.x-order-wrapper .x-pg-container .pageNum.selected {
  color: #fff;
  background-color: var(--brand-secondary);
}

.x-order-wrapper .x-pg-container .pageNum.icon-prev::before,
.x-order-wrapper .x-pg-container .pageNum.icon-next::before {
  color: var(--brand-secondary);
}

.x-order-wrapper .x-pg-container .pageNum.icon-prev.icon-disabled::before,
.x-order-wrapper .x-pg-container .pageNum.icon-next.icon-disabled::before {
  color: #eaecef;
}

.x-order-wrapper .x-txt-b {
  font-weight: bold !important;
}

.x-order-wrapper .x-icon-arrow--down {
  position: relative;
  display: inline-block;
  text-align: center;
  width: 16px;
  height: 16px;
  background: #eaecef;
  border-radius: 2px;
}

.x-order-wrapper .x-icon-arrow--down:before {
  content: '';
  position: absolute;
  left: 4px;
  top: 6px;
  border-width: 4px 4px 0;
  border-color: var(--brand-primary) transparent transparent;
  border-style: solid;
}

.x-order-wrapper .x-icon-ques {
  display: inline-block;
  vertical-align: middle;
  color: #000;
  font-size: 8px;
  font-weight: bold;
  width: 9px;
  height: 9px;
  line-height: 9px;
  background: #fff;
  border-radius: 50%;
  margin-left: 2px;
  text-align: center;
}

.x-order-wrapper .x-text-main {
  font-size: 15px;
  line-height: 1;
  word-break: break-word;
}

.x-order-wrapper .x-text-min {
  color: #353a45;
  font-size: 10px;
  line-height: 1;
}

.x-order-wrapper .x-bet-title {
  background: #1b1e25;
  padding: 6px 5px 7px 7px;
  line-height: 18px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #fff;
}

.x-order-wrapper .x-bet-title .x-text-min {
  color: #fff;
}

.x-order-wrapper .x-row-container {
  border: 1px solid #eaecef;
  margin-bottom: 4px;
  position: relative;
}

.x-order-wrapper .x-row-container:last-of-type {
  margin-bottom: 0;
}

.x-order-wrapper .x-row-container.x-row-open {
  border-color: #dcdee5;
  border-width: 3px;
}

.x-order-wrapper .x-row-container.x-row-open .x-icon-arrow--down {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

.x-order-wrapper .x-row-container .x-row-pflag {
  font-size: 8px;
  color: #e41827;
  font-weight: bold;
  position: absolute;
  left: 11px;
  top: 0;
}

.x-order-wrapper .x-row-container .x-row-pflag:before {
  position: absolute;
  left: -4px;
  top: 0;
  content: '';
  width: 0;
  height: 0;
  overflow: hidden;
  border-width: 5px 5px 0;
  border-color: #e41827 transparent transparent;
  border-style: solid;
  -webkit-transform-origin: left top;
  -ms-transform-origin: left top;
  transform-origin: left top;
  -webkit-transform: rotate(135deg);
  -ms-transform: rotate(135deg);
  transform: rotate(135deg);
}

.x-order-wrapper .x-detail-title {
  padding: 5px 0;
}

.x-order-wrapper .x-detail-subtit {
  font-weight: bold;
  padding-left: 12px;
  position: relative;
}

.x-order-wrapper .x-detail-subtit:before {
  content: '';
  background: #000;
  width: 6px;
  height: 6px;
  border-radius: 6px;
  font-size: 0;
  position: absolute;
  left: 0;
  top: 4px;
}

.x-order-wrapper .x-detail-thead {
  color: #4a4a4a;
  font-size: 10px;
}

.x-order-wrapper .x-detail-thead .x-table-row {
  padding: 8px 0;
}

.x-order-wrapper .x-table-cell>span:not(.x-bet-type):not(.x-no-ellipse) {
  display: block;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.x-order-wrapper .x-table-cell>span:not(.x-bet-type):not(.x-no-ellipse):last-of-type {
  margin-bottom: 0;
}

.x-order-wrapper .x-table-cell>span.x-bet-team {
  line-height: 20px !important;
}

.x-order-wrapper .x-icon--dollar {
  margin-left: 5px;
}

.x-order-wrapper .x-icon--dollar::before {
  content: '\e627';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.x-order-wrapper .x-icon--dollar::before {
  color: var(--brand-primary);
  font-size: 11px;
  line-height: 11px;
}

.x-order-wrapper .x-popOver-wrapper {
  color: #000;
  white-space: nowrap;
  padding: 8px 10px;
  border: none;
}

.x-order-wrapper .x-popOver-wrapper .x-popOver-arrow {
  width: 6px;
  height: 6px;
}

.x-order-wrapper .x-popOver-wrapper .x-popOver-arrow.x-popOver-arrow--top {
  bottom: -3px;
  border: none;
}

.x-order-wrapper .x-gift-tip {
  text-align: left;
  margin-left: 3px;
  width: 214px !important;
  padding-left: 23px !important;
  font-weight: normal;
}

.x-order-wrapper .x-gift-tip .x-t-green {
  font-size: 10px;
  margin-left: 10px;
}

.x-print-txt {
  text-transform: capitalize;
  cursor: pointer;
  color: #3656a3;
  font-weight: bold;
}

.x-print-txt::before {
  content: '\e77b';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.x-print-txt:before {
  font-size: 12px;
  margin-right: 6px;
}
</style>
