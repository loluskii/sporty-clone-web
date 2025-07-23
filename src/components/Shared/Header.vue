<template>
  <div id="j_page_header" class="c-header c-header-on">
    <div class="x-top-wrapper">
      <div class="x-nav-wrapper">
        <div class="x-logo-bar">
          <div
            class="x-login-bar"
            v-if="utilsStore.showDefaultHeaderItems"
            :class="currentUser ? 'x-login-bar-fix' : ''"
          >
            <template v-if="currentUser">
              <div class="x-info on">
                <div class="x-bablance-wrapper">
                  <span id="j_balance" class="x-text x-balance"
                    >{{ utilsStore.SportsbookGlobalVariable.Currency }}{{ balance }}</span
                  ><!-- <i id="j_toggleBalance" class="x-icon-toggle on"></i -->
                  <i
                    @click="usersStore.loadCurrentUser()"
                    id="j_refreshBalance"
                    class="x-icon-refresh"
                    :class="usersStore.isLoadingCurrentUser ? 'loading' : ''"
                  ></i>
                </div>
                <a href="/Account/Deposit" class="x-text x-deposit"><span>Deposit</span></a>
                <div id="j_betHistory" class="x-text x-history">
                  <a href="/Account/BetHistory"><span>Bet History</span></a>
                </div>
                <div id="j_userInfo" class="x-text x-userInfo x-userInfo-fix">
                  <span data-cms-key="my_account">My Account</span>
                  <ul class="x-user-center x-list">
                    <li
                      class="x-list-item x-text-main"
                      @click="$router.push({ name: 'account-me' })"
                    >
                      <span><span data-cms-key="my_account_info">My Account Info</span> </span>
                    </li>

                    <li
                      class="x-list-item x-text-main"
                      @click="$router.push({ name: 'account-deposit' })"
                    >
                      <span><span data-cms-key="deposit">Deposit</span> </span>
                    </li>
                    <li
                      class="x-list-item x-text-main"
                      @click="$router.push({ name: 'account-withdraw' })"
                    >
                      <span><span data-cms-key="withdraw">Withdraw</span> </span>
                    </li>
                    <li
                      class="x-list-item x-text-main"
                      @click="$router.push({ name: 'account-bethistory' })"
                    >
                      <span><span data-cms-key="bet_history">Bet History</span> </span>
                    </li>
                    <li
                      class="x-list-item x-text-main"
                      @click="$router.push({ name: 'account-transactions' })"
                    >
                      <span><span data-cms-key="transactions">Transactions</span> </span>
                    </li>
                    <li
                      class="x-list-item x-text-main"
                      @click="$router.push({ name: 'account-security' })"
                    >
                      <span><span data-cms-key="security">Safety & Security</span> </span>
                    </li>
                    <li class="x-list-bar" @click="authStore.logout" data-cms-key="log_out">
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
              <div class="x-opt">
                <div class="x-error-toast"></div>
                <div style="display: flex">
                  <div class="x-phone-wrapper">
                    <div class="x-phone">
                      <span>{{ utilsStore.SportsbookGlobalVariable.DialCode }}</span
                      ><input
                        type="text"
                        name="phone"
                        value=""
                        autocomplete="off"
                        placeholder="Mobile Number"
                        class="fs-exclude"
                      />
                    </div>
                    <div class="x-error-wrapper"></div>
                  </div>
                  <div class="x-psd-wrapper">
                    <div class="x-psd">
                      <input
                        type="password"
                        name="psd"
                        value=""
                        autocomplete="off"
                        placeholder="Password"
                        class="fs-exclude"
                      /><button
                        type="button"
                        name="logIn"
                        class="x-btn x-btn-login"
                        data-cms-key="log_in"
                      >
                        Login
                      </button>
                    </div>
                    <div class="x-error-wrapper"></div>
                  </div>
                  <button
                    type="button"
                    name="register"
                    class="x-btn x-btn-register"
                    data-cms-key="register"
                  >
                    Register
                  </button>
                </div>
                <div class="x-operation">
                  <a href="/forgot-password" class="x-forgetPsd"
                    ><span data-cms-key="forgot_password">Forgot Password</span>?</a
                  >
                </div>
              </div>
            </template>
            <template v-else>
              <div class="x-login-bar">
                <div class="x-info">
                  <div class="x-bablance-wrapper">
                    <span id="j_balance" class="x-text x-balance"></span>
                    <i id="j_refreshBalance" class="x-icon-refresh"></i>
                  </div>
                  <a href="/Account/Deposit" class="x-text x-deposit"
                    ><span data-cms-key="deposit">Deposit</span></a
                  >
                  <div id="j_betHistory" class="x-text x-history">
                    <a href="/Account/BetHistory"
                      ><span data-cms-key="bet_history">Bet History</span></a
                    >
                    <div class="tips-wrapper"></div>
                  </div>
                  <div
                    id="j_userInfo"
                    class="x-text x-userInfo x-userInfo-fix"
                    @click="$router.push({ name: 'account-me' })"
                  >
                    <span>My Account</span>
                    <div class="dropDown-wraper"></div>
                  </div>
                </div>
                <form action="">
                  <div class="x-opt">
                    <div class="x-error-toast"></div>
                    <div class="x-phone-wrapper">
                      <div class="x-phone">
                        <span>{{ utilsStore.SportsbookGlobalVariable.DialCode }}</span
                        ><input
                          type="text"
                          name="phone"
                          value=""
                          autocomplete="off"
                          placeholder="Mobile Number"
                          class="fs-exclude"
                          v-model="phoneNumber"
                        />
                      </div>
                      <div class="x-error-wrapper"></div>
                    </div>
                    <div class="x-psd-wrapper">
                      <div class="x-psd">
                        <input
                          type="password"
                          name="psd"
                          value=""
                          autocomplete="off"
                          placeholder="Password"
                          class="fs-exclude"
                          v-model="password"
                        /><button
                          type="button"
                          @click.prevent="doLogin"
                          name="logIn"
                          class="x-btn x-btn-login"
                          :class="phoneNumber && password ? '' : 'disabled'"
                        >
                          Login
                        </button>
                      </div>
                      <div class="x-error-wrapper"></div>
                    </div>
                    <button
                      @click.prevent="showRegisterModal"
                      type="button"
                      name="register"
                      class="x-btn x-btn-register"
                    >
                      Register
                    </button>
                    <div class="x-operation">
                      <a href="/Account/ResetPassword" class="x-forgetPsd"
                        ><span>Forgot Password</span>?</a
                      >
                    </div>
                  </div>
                </form>
              </div>
            </template>
          </div>
          <div class="x-left">
            <div class="x-logo-wrapper">
              <a href="/" class="x-image-wrapper"
                ><img src="/default.png" alt="frapapa" class="x-img x-img--logo"
              /></a>
            </div>
          </div>
        </div>
        <div class="x-nav-main x-header-item">
          <nav id="topHeader" class="x-flex is-login">
            <a
              id="header_nav_sports"
              href="/"
              class="x-flex-item"
              :class="activeClass('home') ? 'x-flex-item--active' : ''"
              ><span data-cms-key="sports">Sports</span></a
            >
            <a
              id="header_nav_games"
              href="/Games"
              class="x-flex-item"
              :class="viewIsCasino ? 'x-flex-item--active' : ''"
              ><span data-cms-key="casino">Casino</span></a
            >
            <a
              id="header_nav_liveBetting"
              href="/Sport/LiveList"
              :class="viewIsLive ? 'x-flex-item--active' : ''"
              class="x-flex-item"
              ><span data-cms-key="live_betting">Live Betting</span></a
            >

            <a id="header_nav_liveBetting" @click.prevent="goToVirtuals" class="x-flex-item"
              ><span data-cms-key="live_betting">Virtuals</span></a
            >

            <!-- <a
              id="header_nav_jackpot"
              href="/"
              class="x-flex-item"
              :class="activeClass('jackpot') ? 'x-flex-item--active' : ''"
              ><span data-cms-key="jackpot">Jackpot</span></a
            > -->
            <a id="header_nav_livescore" class="x-flex-item" @click.prevent="goToLiveScore"
              ><span data-cms-key="live_betting">Livescore</span></a
            >
            <a id="header_nav_promotions" @click.prevent="goToStatistics" class="x-flex-item"
              ><span data-cms-key="promotions">Statistics</span></a
            >
            <a
              id="header_nav_mobile"
              href="/Promotions"
              class="x-flex-item"
              :class="activeClass('promotions') ? 'x-flex-item--active' : ''"
              ><span data-cms-key="app">Promotions</span></a
            >
          </nav>
          <div id="j_timezone" class="x-timezone">GMT {{ sign }}{{ offsetHours }}:00</div>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useAuthStore, useUsersStore, useUtilsStore } from '@/stores'
import MD5 from 'crypto-js/md5'

import emitter from '@/plugins/emitter'
import { useRoute } from 'vue-router'
const usersStore = useUsersStore()
const authStore = useAuthStore()
const utilsStore = useUtilsStore()

const route = useRoute()

const phoneNumber = ref()
const password = ref()

const date = new Date()
const offset = date.getTimezoneOffset()
const sign = offset >= 0 ? '-' : '+'
const offsetHours = Math.abs(offset / 60)
const token = ref('111111')
const group = ref(import.meta.env.VITE_APP_KEY)
const mode = ref(0)

const currentUser = computed(() => {
  return usersStore.currentUser
})

const balance = computed(() => {
  return usersStore.balance
})

const viewIsCasino = computed(() => {
  return (
    route.name === 'game-view' || route.name === 'game-play' || route.name === 'casino-category'
  )
})

const viewIsLive = computed(() => {
  return route.name === "live-view" || route.name === "live-fixtures-one-detail";
});

const activeClass = (name) => {
  return route.name === name
}

const goToStatistics = () => {
  return window.open(`https://s5.sir.sportradar.com/bematrics`, 'stats', 'width=1078,height=768')
}

function showRegisterModal() {
  emitter.emit('showDialog', { dialogType: 'auth', dialogData: 'register' })
}

const formattedPhoneNumber = (phoneNumber) => {
  const pNumber = phoneNumber.toString()
  const first = pNumber.charAt(0)
  return first === '0' ? pNumber.substring(1) : pNumber
}

async function doLogin() {
  let payload = {
    username: formattedPhoneNumber(phoneNumber.value),
    password: password.value,
    clientId: import.meta.env.VITE_CLIENT_ID
  }
  await authStore.doLogin(payload)
}

// function getTimezone() {
//   const date = new Date()
//   const timezoneOffset = -date.getTimezoneOffset()
//   const sign = timezoneOffset > 0 ? '+' : '-'
//   const hours = Math.floor(Math.abs(timezoneOffset / 60))
//   const minutes = Math.abs(timezoneOffset % 60)
//   const formattedMinutes = minutes.toString().padStart(2, '0')

//   const formattedTimezone = `GMT${sign}${hours.toString().padStart(2, '0')}:${formattedMinutes}`

//   document.getElementById('j_timezone').innerText = formattedTimezone
// }

const goToLiveScore = () => {
  return window.open(`https://ls.sir.sportradar.com/bematrics`, 'stats', 'width=1078,height=768')
}

const hashStr = computed(() => {
  return MD5(
    `${token.value}10100${import.meta.env.VITE_SITE_URL}${mode.value}${
      group.value
    }mobile${import.meta.env.VITE_XPRESS_PRIVATE_KEY}`
  ).toString()
})

const generatedURL = computed(() => {
  return `${import.meta.env.VITE_XPRESS_LAUNCH_URL}?token=${
    token.value
  }&game=10100&backurl=${import.meta.env.VITE_SITE_URL}&mode=${mode.value}&group=${
    group.value
  }&clientPlatform=website&h=${hashStr.value}`
})

function goToVirtuals() {
  window.location.href = generatedURL.value
}

defineComponent({
  name: 'hea-der'
})

onMounted(() => {
  // getTimezone()
})
</script>

<style>
.x-text-second {
  font-size: 13px;
  line-height: 1;
}
@-webkit-keyframes rotating-055d6cc9 {
  0% {
    -webkit-transform: rotate(0deg) translateZ(0);
    transform: rotate(0deg) translateZ(0);
  }
  100% {
    -webkit-transform: rotate(360deg) translateZ(0);
    transform: rotate(360deg) translateZ(0);
  }
}
@keyframes rotating-055d6cc9 {
  0% {
    -webkit-transform: rotate(0deg) translateZ(0);
    transform: rotate(0deg) translateZ(0);
  }
  100% {
    -webkit-transform: rotate(360deg) translateZ(0);
    transform: rotate(360deg) translateZ(0);
  }
}
.c-header .x-login-bar {
  float: right;
  font-size: 0;
  height: 34px;
  line-height: 34px;
  position: relative;
  display: flex;
}
.c-header .x-login-bar:after {
  clear: both;
  content: '.';
  display: block;
  height: 0;
  visibility: hidden;
}
.c-header .x-login-bar ::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.5);
}
.c-header .x-login-bar ::-moz-placeholder {
  color: rgba(255, 255, 255, 0.5);
}
.c-header .x-login-bar ::-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.5);
}
.c-header .x-login-bar ::placeholder {
  color: rgba(255, 255, 255, 0.5);
}
.c-header .x-login-bar .x-info {
  display: none;
}
.c-header .x-login-bar .x-info .x-icon-toggle {
  color: #fff;
  cursor: pointer;
  display: inline-block;
  height: 34px;
  margin-right: 5px;
  vertical-align: top;
}
.c-header .x-login-bar .x-info .x-icon-toggle::before {
  content: '\e76b';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.c-header .x-login-bar .x-info .x-icon-toggle:before {
  font-size: 14px;
}
.c-header .x-login-bar .x-info .x-icon-toggle.on::before {
  content: '\e641';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.c-header .x-login-bar .x-info .x-icon-refresh {
  color: #fff;
  display: inline-block;
  height: 34px;
  vertical-align: top;
}
.c-header .x-login-bar .x-info .x-icon-refresh::before {
  content: '\e645';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.c-header .x-login-bar .x-info .x-icon-refresh:before {
  display: inline-block;
  font-size: 14px;
}
.c-header .x-login-bar .x-info .x-icon-refresh:hover {
  cursor: pointer;
}
.c-header .x-login-bar .x-info .x-icon-refresh.loading:before {
  -webkit-animation: rotating-055d6cc9 1s infinite;
  animation: rotating-055d6cc9 1s infinite;
}
.c-header .x-login-bar .x-info:not(.on) .x-icon-toggle {
  display: none;
}
.c-header .x-login-bar .x-opt {
  display: block;
}
.c-header .x-login-bar .x-opt.int-login .x-psd input {
  width: auto;
}
.c-header .x-login-bar .x-opt.int-login .x-phone > input {
  width: 173px;
}
.c-header .x-login-bar.x-login-bar-fix .x-info {
  display: block;
}
.c-header .x-login-bar.x-login-bar-fix .x-opt {
  display: none;
}
.c-header .x-login-bar.x-login-bar-fix .x-forgetPsd {
  display: none;
}
.c-header .x-login-bar .x-phone-wrapper,
.c-header .x-login-bar .x-psd-wrapper {
  display: inline-block;
  position: relative;
  z-index: 20;
}
.c-header .x-login-bar .x-phone-wrapper .x-error-wrapper,
.c-header .x-login-bar .x-psd-wrapper .x-error-wrapper {
  background: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: var(--brand-primary);
  font-size: 12px;
  left: 0;
  line-height: 16px;
  padding: 10px;
  position: absolute;
  text-align: left;
  top: 38px;
  word-break: break-word;
}
.c-header .x-login-bar .x-phone-wrapper .x-error-wrapper:before,
.c-header .x-login-bar .x-psd-wrapper .x-error-wrapper:before {
  border-bottom: 6px solid #fff;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  content: '';
  height: 0;
  left: 6px;
  position: absolute;
  top: -6px;
  width: 0;
}
.c-header .x-login-bar .x-phone-wrapper:not(.on) .x-error-wrapper,
.c-header .x-login-bar .x-psd-wrapper:not(.on) .x-error-wrapper {
  display: none;
}
.c-header .x-login-bar .x-phone,
.c-header .x-login-bar .x-psd,
.c-header .x-login-bar .x-text,
.c-header .x-login-bar .x-phone-wrapper,
.c-header .x-login-bar .x-psd-wrapper,
.c-header .x-login-bar .x-bablance-wrapper {
  display: inline-block;
  vertical-align: top;
}
.c-header .x-login-bar .x-bablance-wrapper:after {
  background: #fff;
  content: '';
  display: inline-block;
  height: 14px;
  margin: 0 8px 0 16px;
  vertical-align: middle;
  width: 1px;
}
.c-header .x-login-bar .x-deposit:after,
.c-header .x-login-bar .x-history:after {
  background: #fff;
  content: '';
  display: inline-block;
  height: 14px;
  margin: 0 0 0 16px;
  vertical-align: middle;
  width: 1px;
}
.c-header .x-login-bar .x-history {
  position: relative;
}
.c-header .x-login-bar .x-history a {
  color: #fff;
  text-decoration: none;
}
.c-header .x-login-bar .x-history a:hover,
.c-header .x-login-bar .x-history a:active {
  color: #fff;
}
.c-header .x-login-bar .x-history .tips-wrapper {
  display: inline-block;
}
.c-header .x-login-bar .x-phone-wrapper {
  height: 32px;
  margin-right: 5px;
}
.c-header .x-login-bar .x-phone-wrapper.on {
  border: 1px solid var(--brand-secondary);
  border-radius: 2px;
}
.c-header .x-login-bar .x-psd-wrapper.on input {
  border: 1px solid var(--brand-secondary);
  border-right: 0;
}
.c-header .x-login-bar .x-error-toast {
  color: #fff;
  display: inline-block;
  font-size: 12px;
  margin-right: 5px;
  vertical-align: middle;
}
.c-header .x-login-bar .x-phone,
.c-header .x-login-bar .x-psd {
  border-radius: 2px;
  height: 32px;
  overflow: hidden;
}
.c-header .x-login-bar .x-phone,
.c-header .x-login-bar .x-psd {
  background: #fff;
}
.c-header .x-login-bar .x-phone input,
.c-header .x-login-bar .x-psd input {
  background: #fff;
  border: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #000;
  font-size: 12px;
  height: 100%;
  outline: none;
  padding: 10px;
}
.c-header .x-login-bar .x-phone > input,
.c-header .x-login-bar .x-phone > span {
  display: inline-block;
  vertical-align: middle;
}
.c-header .x-login-bar .x-phone > span {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #000;
  font-size: 12px;
  padding: 0 0 0 15px;
}
.c-header .x-login-bar .x-psd input {
  vertical-align: top;
  width: 173px;
}
.c-header .x-login-bar .x-psd .x-btn-login {
  border-radius: 0 2px 2px 0;
}
.c-header .x-login-bar .x-text,
.c-header .x-login-bar .x-btn {
  color: #fff;
}
.c-header .x-login-bar .x-text {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 14px;
  padding: 0 8px;
}
.c-header .x-login-bar .x-balance {
  color: yellow;
  /* font-weight: bold; */
}
.c-header .x-login-bar a:hover {
  text-decoration: none;
}
.c-header .x-login-bar .x-error-wrapper {
  color: #fff;
  display: block;
  font-size: 12px;
  line-height: 1.5;
  max-width: 280px;
  text-align: right;
  width: -webkit-max-content;
  width: -moz-max-content;
  width: max-content;
}
.c-header .x-login-bar .x-error-wrapper .x-text-highlight {
  color: #3656a3;
}
.c-header .x-login-bar .x-error-wrapper .x-icon-tips {
  color: var(--brand-primary);
}
.c-header .x-login-bar .x-error-wrapper .x-icon-tips::before {
  content: '\e623';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.c-header .x-login-bar .x-error-wrapper .x-icon-tips:before {
  display: inline-block;
  font-size: 12px;
  margin-right: 4px;
}
.c-header .x-login-bar .x-userInfo {
  outline: none;
  position: relative;
  z-index: 999;
}
.c-header .x-login-bar .x-userInfo .x-user-center {
  -webkit-box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  display: none;
}
.c-header .x-login-bar .x-userInfo:hover {
  cursor: pointer;
}
.c-header .x-login-bar .x-userInfo:hover .x-user-center {
  display: block;
}
.c-header .x-login-bar .x-userInfo:hover .x-balance-tips {
  display: none;
}
.c-header .x-login-bar .x-userInfo::before {
  content: '\e6a3';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.c-header .x-login-bar .x-userInfo:before {
  color: rgba(255, 255, 255, 0.7);
  float: right;
  font-size: 10px;
  -webkit-transform: translate3d(5px, 0, 0);
  transform: translate3d(5px, 0, 0);
}
.c-header .x-login-bar .x-userInfo .x-user-center {
  background: #fff;
  border: none;
  color: #000;
  font-size: 12px;
  position: absolute;
  right: -8px;
  width: 163px;
}
.c-header .x-login-bar .x-userInfo .x-user-center .x-list-item--active {
  margin: 0;
}
.c-header .x-login-bar .x-userInfo .x-list-bar {
  border-top: 1px solid #f2f3f5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 1;
  padding: 10px 6px 12px 6px;
}
.c-header .x-login-bar .x-userInfo .x-list-bar:last-of-type {
  color: var(--brand-primary);
}
.c-header .x-login-bar .x-userInfo .x-balance div > * {
  display: inline-block;
  height: 100%;
  line-height: 18px;
  vertical-align: top;
}
.c-header .x-login-bar .x-userInfo .x-list-item {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 12px;
  line-height: 1;
  padding: 9px 13px;
}
.c-header .x-login-bar .x-userInfo .x-list-item:hover {
  color: #22199f;
  cursor: pointer;
}
.c-header .x-login-bar .x-userInfo .x-list-item--active:hover {
  background: #fff;
}
.c-header .x-login-bar .x-userInfo.x-userInfo-fix .x-list-item--active {
  background: #fff;
  color: #000;
}
.c-header .x-login-bar .x-userInfo.x-userInfo-fix .x-list-item--active:hover {
  color: #32ce62;
}
.c-header .x-login-bar .x-operation {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: end;
  -webkit-justify-content: flex-end;
  -ms-flex-pack: end;
  justify-content: flex-end;
}
.c-header .x-login-bar .x-operation .check-option {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.c-header .x-login-bar .x-operation .check-option .opt-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  padding-left: 4px;
  line-height: 16px;
}
.c-header .x-login-bar .x-forgetPsd {
  color: rgba(255, 255, 255, 0.6);
  display: inline-block;
  font-size: 12px;
  font-weight: bold;
  line-height: 16px;
  text-decoration: none;
  margin-left: 15px;
}
.c-header .x-login-bar .x-activate {
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: inline-block;
  font-size: 12px;
  font-weight: bold;
  line-height: 16px;
  margin-left: 15px;
}
.c-header .x-btn-register,
.c-header .x-btn-login,
.c-header .x-third-party {
  color: #fff;
  display: inline-block;
  vertical-align: top;
}
.c-header .x-btn-register,
.c-header .x-btn-login {
  cursor: pointer;
  font-size: 12px;
  height: 32px;
  width: 65px;
}
.c-header .x-btn-login {
  background: var(--brand-secondary);
  border: none;
  border-radius: 2px;
}
.c-header .x-btn-login.disabled {
  background: var(--brand-secondary);
  opacity: 0.5;
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
}
.c-header .x-btn-register {
  background: transparent;
  border: 1px solid #fff !important;
  border: none;
  border-radius: 2px;
  margin-left: 10px;
}
.c-header .x-third-party {
  border: 1px solid #fff;
  border-radius: 2px;
  cursor: pointer;
  height: 30px;
  margin-left: 10px;
  width: 30px;
}
.c-header .x-third-party::before {
  content: '\e6e2';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.c-header .x-third-party:before {
  display: inline-block;
  font-size: 20px;
  text-align: center;
  vertical-align: middle;
  width: 100%;
}
.c-header {
  width: 100%;
}
.c-header .x-top-wrapper {
  background: var(--brand-primary);
}
.c-header .x-nav-wrapper {
  margin: 0 auto;
  min-width: 1000px;
  position: relative;
  width: 1000px;
}
.c-header .x-logo-bar {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 20px 0 18px;
}
.c-header .x-logo-bar .x-logo-wrapper {
  display: inline-block;
  text-decoration: none;
}
.c-header .x-logo-bar .x-image-wrapper {
  display: inline-block;
  height: 100%;
  vertical-align: middle;
  width: 130px;
}
.c-header .x-logo-bar .x-image-wrapper.region-select {
  cursor: pointer;
  height: 20px;
  margin-right: 15px;
  width: 100px;
}
.c-header .x-logo-bar .x-image-wrapper.region-select.global {
  margin: 0 10px 0 20px;
  text-align: right;
  width: 20px;
}
.c-header .x-logo-bar .x-image-country {
  height: 20px;
  width: 100px;
}
.c-header .x-nav-main {
  margin: 0 auto;
  min-width: 1000px;
  width: 1000px;
}
.c-header .x-nav-main #topHeader {
  -webkit-box-align: stretch;
  -webkit-align-items: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding-right: 10px;
}
.c-header .x-nav-main .x-image-wrapper {
  display: inline-block;
  height: 50px;
  width: 50px;
  display: none;
}
.c-header .x-nav-main .x-timezone {
  color: #fff;
  float: right;
  font-size: 14px;
  text-align: right;
}
.c-header .x-nav-main .x-timezone:after {
  clear: both;
  content: '.';
  display: block;
  height: 0;
  visibility: hidden;
}
.c-header .x-nav-main .x-login-wapper {
  display: none;
}
.c-header .x-nav-main .x-flex-item {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #fff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-size: 14px;
  /* font-weight: 500; */
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  line-height: 1;
  min-height: 50px;
  position: relative;
  -webkit-transform-origin: bottom left;
  -ms-transform-origin: bottom left;
  transform-origin: bottom left;
}
.c-header .x-nav-main .x-flex-item > span {
  display: inline-block;
  max-width: 80px;
  text-align: center;
}
.c-header .x-nav-main .x-flex-item:hover {
  background: rgba(0, 0, 0, 0.15);
  color: #fff;
  cursor: pointer;
  text-decoration: none;
}

.c-header .x-nav-main .x-flex-item--active,
.c-header .x-nav-main .x-flex-item.router-link-exact-active {
  background: #fff;
  color: var(--brand-primary);
  padding: 18px 0;
}

.c-header .x-nav-main .x-flex-item--fix {
  position: relative;
}
.c-header .x-image-wrapper > img {
  height: 100%;
  width: 100%;
}
.c-header .x-header-item {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 0;
}
.c-header .x-header-item .x-flex {
  display: table-cell;
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-width: 1%;
  vertical-align: middle;
}
.c-header .x-item-badge {
  height: 16px;
  position: absolute;
  right: 12px;
  top: 0px;
  width: 26px;
}

.c-header-fix {
  -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 999;
}
.c-header-fix .x-logo-wrapper {
  display: block !important;
}
.c-header-fix .x-logo-bar {
  padding: 0;
}
.c-header-fix .x-logo-bar .x-left {
  display: none;
}
.c-header-fix .x-logo-bar .x-login-bar {
  position: absolute;
  right: 0;
  top: 9px;
}
.c-header-fix .x-logo-bar .x-phone {
  display: none;
}
.c-header-fix .x-logo-bar .x-psd input {
  display: none;
}
.c-header-fix .x-logo-bar .x-operation {
  display: none;
}
.c-header-fix .x-logo-bar .x-error-wrapper {
  display: none !important;
}
.c-header-fix .x-logo-bar .x-phone-wrapper,
.c-header-fix .x-logo-bar .x-psd-wrapper {
  border: none !important;
}
.c-header-fix .x-login-bar-fix .x-text {
  font-size: 12px;
}
.c-header-fix .x-nav-main .x-image-wrapper {
  display: inline-block;
}
.c-header-fix .x-nav-main #topHeader {
  padding-right: 190px;
}
.c-header-fix .x-nav-main #topHeader.is-login {
  padding-right: 265px;
}
.c-header-fix .x-nav-main #topHeader .x-flex-item--active {
  margin-right: 10px;
}
.c-header-fix .x-nav-main #topHeader .x-item-badge {
  right: 0;
}
.c-header-fix .x-bablance-wrapper {
  position: absolute;
  right: 100px;
  text-align: right;
  top: -5px;
  width: 180px;
  z-index: 2;
}
.c-header-fix .x-bablance-wrapper:after {
  display: none !important;
}
.c-header-fix .x-bablance-wrapper .x-balance {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.c-header-fix .x-deposit {
  line-height: 16px;
  margin-top: 4px;
  padding-right: 20px !important;
  position: absolute;
  right: 0;
  top: 0;
}
.c-header-fix .x-deposit:after {
  display: none !important;
}
.c-header-fix .x-history {
  display: none !important;
}
.c-header-fix .x-userInfo {
  display: inline-block;
  line-height: 16px;
  position: absolute;
  right: 0;
  text-align: right;
  top: 18px;
  width: 100px;
}
.c-header-fix .x-userInfo .x-user-center {
  text-align: left;
  -webkit-transform: translate3d(-8px, 4px, 0);
  transform: translate3d(-8px, 4px, 0);
}
.c-header-fix .x-timezone {
  display: none;
}
.c-header-fix.c-header-on .x-timezone {
  bottom: 2px;
  font-size: 12px;
  position: absolute;
  right: 100px;
  display: block;
}
.c-header-fix.c-header-on .x-error-wrapper {
  display: none;
}
.c-header-fix.c-header-on .x-login-bar .x-text {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  min-width: 120px;
  padding-bottom: 4px;
  text-align: right;
  z-index: 1;
}
.c-header-fix.c-header-on .x-userInfo {
  margin-top: 3px;
}
.c-header-fix + .c-page {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-left {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
}
</style>
