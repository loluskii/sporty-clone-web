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
                      <!-- <em>{{ details.firstName + ' ' + details.lastName }}</em> -->
                      {{ details.username }}
                    </div>
                  </div>
                  <div class="x-user-items">
                    <div class="x-user-item m-text-main">
                      <span class="x-text-second"
                        ><span data-cms-key="balance">Balance</span>
                      </span>
                      <span>NGN {{ balance }}</span>
                    </div>
                  </div>
                </div>
                <ul class="x-user-center m-list">
                  <li
                    class="x-list-item x-text-main"
                    @click="$router.push({ name: 'account-me' })"
                    :class="activeClass('account-me') ? 'x-list-item--active' : 'j'"
                  >
                    <span><span data-cms-key="my_account_info">My Account Info</span> </span>
                  </li>

                  <li
                    class="x-list-item x-text-main"
                    @click="$router.push({ name: 'account-deposit' })"
                    :class="activeClass('account-deposit') ? 'x-list-item--active' : 'j'"
                  >
                    <span><span data-cms-key="deposit">Deposit</span> </span>
                  </li>
                  <li
                    class="x-list-item x-text-main"
                    @click="$router.push({ name: 'account-withdraw' })"
                    :class="activeClass('account-withdraw') ? 'x-list-item--active' : 'j'"
                  >
                    <span><span data-cms-key="withdraw">Withdraw</span> </span>
                  </li>
                  <li
                    class="x-list-item x-text-main"
                    :class="activeClass('account-bethistory') ? 'x-list-item--active' : 'j'"
                    @click="$router.push({ name: 'account-bethistory' })"
                  >
                    <span><span data-cms-key="bet_history">Bet History</span> </span>
                  </li>
                  <li
                    class="x-list-item x-text-main"
                    @click="$router.push({ name: 'account-transactions' })"
                    :class="activeClass('account-transactions') ? 'x-list-item--active' : 'j'"
                  >
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
          <div class="x-table-cell x-main-mid" style="width: 850px; min-width: 850px">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>
<script setup>
// import BaseLayout from '@/components/Shared/BaseLayout.vue'
// import BetContainer from './BetContainer.vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '@/stores'
import { computed } from 'vue'

const route = useRoute()

const usersStore = useUsersStore()

const balance = computed(() => {
  return usersStore.balance
})

const details = computed(() => {
  return usersStore.details
})
const activeClass = (name) => {
  return route.name === name
}
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
.x-user-info .x-account > div {
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
.x-user-info .x-user-item > span {
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
.x-user-info .withdrawable-container > *:not(:last-child) {
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
</style>
