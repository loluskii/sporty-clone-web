<template>
  <AccountLayout>
    <div id="withdraw-container">
      <div class="x-wd-ng">
        <section>
          <div id="j_ngBank" class="x-bank">
            <div class="f-line">
              <span class="f-label" data-cms-key="bank_account_info" data-cms-page="page_withdraw"
                >Bank Account Info</span
              >
              <div class="f-line-item i-bank">
                <div tabindex="9" class="f-list-wrapper" :class="showBanks ? 'on' : ''">
                  <div class="f-content" @click="toggleShowBanks">
                    <span class="f-btn" :class="selectedBank ? 'f-btn--fixed' : ''">{{
                      selectedBank ? selectedBank.name : 'Please select a Bank'
                    }}</span>
                    <i class="i-icon--more" :class="showBanks ? 'on' : ''"></i>
                  </div>
                  <ul class="f-list" :style="showBanks ? 'display: block' : ''">
                    <li
                      v-for="(bank, index) in banksList"
                      :key="index"
                      @click="selectBank(bank)"
                      class="l-item"
                      :class="{ 'l-item--checked': selectedBank && selectedBank.code == bank.code }"
                    >
                      <div class="x-bank-item">
                        <span class="f-text">{{ bank.name }}</span>
                        <i
                          v-if="selectedBank && selectedBank.code == bank.code"
                          class="i-icon-checked"
                        ></i>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="f-line-item i-num">
                <div class="x-fix-input">
                  <div class="x-value">
                    <input
                      type="input"
                      placeholder="Account Number"
                      onpaste="return true"
                      class="x-input fs-exclude"
                      v-model="accountNumber"
                    />
                  </div>
                </div>
                <div v-if="accountError" class="f-error">
                  <p>{{ accountErrorMessage }}.</p>
                </div>
              </div>
            </div>
            <div class="f-line">
              <span class="f-label"
                ><span data-cms-key="amount">Amount</span>
                (NGN)
              </span>
              <div class="f-line-item i-amount">
                <div
                  tabindex="6"
                  class="x-input-wrapper"
                  :class="{ 'x-input-wrapper--error': amountError }"
                >
                  <span class="x-input-com"
                    ><i class="x-input-icon x-input-icon--clickable x-icon-delete"></i>
                    <input
                      type="input"
                      placeholder="min. 1"
                      class="x-input fs-exclude"
                      v-model="withdrawalAmount"
                      @input="checkWithdrawableAmount"
                  /></span>
                </div>
                <div v-if="amountError" class="f-error">
                  <p>{{ amountErrorMessage }}</p>
                </div>
              </div>
            </div>
            <div class="f-line f-line--opt">
              <span class="f-label"></span>
              <button
                :class="!isFormComplete || buttonLoader ? 'is-disabled' : ''"
                @click.prevent="submit"
                :disabled="!isFormComplete || buttonLoader"
                class="af-button af-button--primary"
              >
                <span> Withdraw </span>
              </button>
            </div>
          </div>
        </section>
        <div class="payment-tips-wrap">
          <div class="wrap">
            <div class="title" data-cms-key="note">Note</div>
            <ul class="x-dp-tips f-count">
              <li class="l-item">1. Minimum per transaction is NGN 1.00.</li>
              <li class="l-item">2. Maximum per transaction is NGN 9,999,999.00.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </AccountLayout>
</template>

<script setup>
import AccountLayout from '@/components/Shared/AccountLayout.vue'
import { ref, onMounted, computed } from 'vue'
import emitter from '../../plugins/emitter'
import { useRouter } from 'vue-router'
import { useUsersStore } from '../../stores'
import {
  CLIENT_ID,
  fetchBankAssets,
  getBanksList,
  verifyAccount,
  withdrawalRequest
} from '@/helpers'

const showBanks = ref(false)
// const showBanksAssets = ref(false)
const { currentUser } = useUsersStore()
const router = useRouter()

const banksList = ref([])
const bankAssets = ref([])
const selectedBank = ref(null)
const accountNumber = ref(null)
const withdrawalAmount = ref()
const isLoading = ref(false)
const buttonLoader = ref(false)

const withdrawalSuccess = ref(false)
const withdrawalSuccessData = ref({})

const accountError = ref(false)
const accountErrorMessage = ref('')

const amountError = ref(false)
const amountErrorMessage = ref('')

async function getBanks() {
  isLoading.value = true
  const res = await getBanksList()
  isLoading.value = false
  banksList.value = res.data
}

function toggleShowBanks() {
  showBanks.value = !showBanks.value
}

const isFormComplete = computed(() => {
  return (
    selectedBank.value !== null &&
    accountNumber.value !== null &&
    withdrawalAmount.value !== undefined &&
    !amountError.value &&
    !accountError.value
  )
})

const checkWithdrawableAmount = () => {
  // if (withdrawalAmount.value > currentUser.availableBalance) {
  //   amountError.value = true
  //   amountErrorMessage.value = `Amount exceeds your Withdrawable Balance (NGN ${currentUser.availableBalance.toFixed(2)})`
  // } else if (withdrawalAmount.value.length < 2 && withdrawalAmount.value == '0') {
  //   amountError.value = true
  //   amountErrorMessage.value = 'Enter a valid amount'
  // } else {
  //   amountError.value = false
  //   amountErrorMessage.value = null
  // }
}

const balance = computed(() => {
  return currentUser ? currentUser.availableBalance : 0
})

function selectBank(bank) {
  selectedBank.value = bank
  showBanks.value = !showBanks.value
}

async function submit() {
  buttonLoader.value = true
  let payload = {
    accountNumber: accountNumber.value,
    bankCode: selectedBank.value.code,
    clientId: CLIENT_ID
  }

  if (
    bankAssets.value.length &&
    bankAssets.value.filter((bank) => bank.bankCode === selectedBank.value.code)
  ) {
    let data = {
      dialogType: 'withdrawal',
      dialogData: {
        account_name: selectedBank.value.accountName,
        bank_name: selectedBank.value.name,
        account_number: accountNumber.value,
        amount: withdrawalAmount.value,
        remaining_balance: parseFloat(balance.value) - parseFloat(withdrawalAmount.value)
      }
    }
    emitter.emit('showDialog', data)
  } else {
    accountError.value = false
    accountErrorMessage.value = ''
    const res = await verifyAccount(payload)
    buttonLoader.value = false
    if (res.success) {
      let data = {
        dialogType: 'withdrawal',
        dialogData: {
          account_name: res.message,
          bank_name: selectedBank.value.name,
          account_number: accountNumber.value,
          amount: withdrawalAmount.value,
          remaining_balance: parseFloat(balance.value) - parseFloat(withdrawalAmount.value)
        }
      }
      emitter.emit('showDialog', data)
    } else {
      accountError.value = true
      accountErrorMessage.value = res.message
    }
  }
}

async function submitWithdrawalRequest(data) {
  let payload = {
    accountName: data.account_name,
    accountNumber: data.account_number,
    bankName: selectedBank.value.name,
    amount: data.amount.toString(),
    bankCode: selectedBank.value.code,
    clientId: CLIENT_ID,
    // bank_id: selectedBank.value.bank_id,
    type: 'online'
  }
  document.querySelector('.layout.mask').click()
  buttonLoader.value = true
  const res = await withdrawalRequest(payload)
  buttonLoader.value = false
  if (res.success) {
    withdrawalSuccessData.value = payload
    withdrawalSuccess.value = true
  } else {
    amountError.value = true
    amountErrorMessage.value = res.message
  }
}

async function checkUserBankAssets() {
  try {
    const userAssetRes = await fetchBankAssets()
    if (userAssetRes.data) {
      bankAssets.value = userAssetRes.data
      selectedBank.value = {
        name: userAssetRes.data[0].name,
        code: userAssetRes.data[0].bankCode,
        accountName: userAssetRes.data[0].accountName,
        accountNumber: userAssetRes.data[0].accountNumber
      }
      accountNumber.value = userAssetRes.data[0].accountNumber
    }
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  emitter.on('confirmWithdrawalAction', submitWithdrawalRequest)
  if (!currentUser) {
    return router.push({ name: 'sign-in' })
  } else {
    Promise.all([checkUserBankAssets(), getBanks()])
  }
})
</script>

<style>
.x-wd-ng {
  background: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  margin-left: 21px;
  padding: 31px 65px 41px;
}

.x-wd-ng .x-title {
  border-bottom: 2px solid #eaecef;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
  padding-bottom: 13px;
}
.x-wd-ng .f-line {
  display: block;
}
.x-wd-ng .f-line .f-line-item {
  display: inline-block;
  vertical-align: top;
}
.x-wd-ng .f-line .f-label {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  display: inline-block;
  font-size: 16px;
  font-weight: 500;
  height: 40px;
  line-height: 40px;
  padding-right: 16px;
  text-align: right;
  vertical-align: top;
  width: 171px;
}
.x-wd-ng .f-line .x-input-wrapper {
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  height: 38px;
  width: 200px;
}
.x-wd-ng .f-line .x-input-wrapper .x-input-com {
  display: inline-block;
  width: 100%;
}
.x-wd-ng .f-line .x-input-wrapper .x-input-com,
.x-wd-ng .f-line .x-input-wrapper .x-input {
  height: calc(100% - 2px);
  margin: 1px;
  width: calc(100% - 2px);
}
.x-wd-ng .f-line .x-input-wrapper .x-input {
  border: none !important;
  padding-right: 28px !important;
}
.x-wd-ng .f-line .x-input-wrapper .x-input-icon--clickable {
  color: #dcdee5;
  display: inline-block;
  height: 36px;
  line-height: 36px;
  margin-top: 1px;
}
.x-wd-ng .f-line .x-input-wrapper .x-input-icon--clickable:hover {
  color: #9ca0ab;
}
.x-wd-ng .f-line .x-input-wrapper.x-input-wrapper--active {
  border: 1px solid var(--brand-primary) !important;
}
.x-wd-ng .f-line .x-input-wrapper.x-input-wrapper--active .x-input-icon--clickable:hover {
  color: var(--brand-primary) !important;
}
.x-wd-ng .f-line .x-input-wrapper.x-input-wrapper--error {
  border: 1px solid #e41827 !important;
}
.x-wd-ng .f-line .x-input-wrapper.x-input-wrapper--error .x-input-icon--clickable:hover {
  color: #e41827 !important;
}
.x-wd-ng .f-line .x-fix-input .x-input,
.x-wd-ng .f-line .x-input-wrapper .x-input {
  font-size: 14px;
  font-weight: 500;
}
.m-fix-input.m-fix-input--error {
  border-color: #e41827 !important;
}
.x-wd-ng .f-line .f-error p {
  color: #e41827;
  font-size: 12px;
}
.x-wd-ng .f-line .af-button {
  padding-left: 0;
  padding-right: 0;
  text-align: center;
  border: none !important;
  font-size: 16px;
  border-radius: 2px;
  height: 40px;
  width: 170px;
}
.x-wd-ng .f-line .af-button--primary {
  background: var(--brand-primary) !important;
  color: #fff !important;
}
.x-wd-ng .f-line .is-disabled {
  background: #dcdee5 !important;
  color: #fff !important;
}
.x-wd-ng .f-line .is-disabled:hover,
.x-wd-ng .f-line .is-disabled:active {
  background: #dcdee5 !important;
  color: #fff !important;
}
.x-wd-ng .x-wd-coming-soon-container {
  height: 60vh;
}
.x-wd-ng .x-wd-coming-soon-container > .container {
  background-color: unset;
}
.x-dialog--tips {
  width: 512px;
}
.x-dialog--tips .x-pop-header > span {
  color: #353a45;
  font-size: 20px;
  font-weight: bold;
  line-height: 24px;
  padding: 24px 24px 0;
}
.x-dialog--tips .x-pop-header > span::before {
  content: '\e623';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-dialog--tips .x-pop-header > span:before {
  display: inline-block;
  line-height: 1;
  margin-right: 8px;
  vertical-align: top;
}
.x-dialog--tips .x-pop-header .x-icon-close {
  right: 20px;
  text-align: right;
}
.x-dialog--tips .x-pop-main > p {
  padding: 0 24px;
}
.x-dialog--tips .x-btn-wrapper {
  margin-top: 64px;
}

.x-wd-ng .x-error-wrapper {
  height: 400px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #fff;
  display: table;
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
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
}
.x-wd-ng .x-error-wrapper > div {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
.x-wd-ng .x-error-wrapper .x-icon-loading {
  display: block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  background: #eaecef;
  border-radius: 50%;
  margin-bottom: 10px;
  -webkit-animation: logoLoading 1s infinite cubic-bezier(0.4, 0, 1, 1) alternate;
  animation: logoLoading 1s infinite cubic-bezier(0.4, 0, 1, 1) alternate;
}
.x-wd-ng .x-error-wrapper .x-icon-loading::before {
  content: '\e610';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-wd-ng .x-error-wrapper .x-icon-loading:before {
  font-size: 28px;
}
.x-wd-ng .x-error-wrapper .x-text-msg {
  color: #353a45;
  font-size: 12px;
  line-height: 16px;
}
.x-wd-ng .x-error-wrapper .x-error-title {
  font-size: 64px;
  color: #9ca0ab;
  line-height: 87px;
}
.x-wd-ng .x-error-wrapper .af-button {
  background: var(--brand-primary) !important;
  color: #fff !important;
  width: 65px;
  height: 32px;
  font-size: 12px;
  border: none;
  padding: 0 !important;
}
.x-wd-ng .x-error-wrapper .af-button:hover {
  background: #32ce62 !important;
}

.x-wd-ng .x-error-wrapper-fix {
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -webkit-box-align: start;
  -webkit-align-items: flex-start;
  -ms-flex-align: start;
  align-items: flex-start;
}
.x-wd-ng .x-error-wrapper-fix > div {
  text-align: left;
  vertical-align: top;
  padding: 60px 40px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-wd-ng .x-error-wrapper-fix .af-button {
  display: block;
  margin-top: 18px;
}

#withdraw-container .payment-tips-wrap {
  border-top: 1px solid #eaecef;
  padding-top: 12px;
}
.withdraw-notification {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background: rgba(250, 253, 0, 0.1);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding-left: 3.5rem;
}
.withdraw-notification .tip-icon {
  margin-right: 1rem;
}
.withdraw-notification .tip-icon::before {
  content: '\e651';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.withdraw-notification .tip-icon:before {
  color: #fac111;
  font-size: 1.66666667rem;
}
#withdraw-pin-notify {
  background: rgba(250, 253, 0, 0.1);
  color: #353a45;
  font-family: Inter;
  font-size: 12px;
  padding: 14px;
}
#withdraw-pin-notify a {
  border-bottom: 1px solid #353a45;
  color: #353a45;
}
#withdraw-pin-notify a:hover {
  text-decoration: none;
}
.dialog-withdraw-update-name-alert .af-button {
  border-radius: 2px;
  height: 36px;
  padding: 0 !important;
}

.x-bank {
  padding-top: 50px;
  padding-bottom: 45px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-bank .mismatch-name-notic {
  margin-top: -50px;
  margin-bottom: 20px;
}
.x-bank .f-line {
  padding-left: 23px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-bank .f-line .i-bank {
  margin-right: 10px;
}
.x-bank .f-line .i-bank .l-item:hover {
  background: transparent;
}
.x-bank .f-line .f-btn {
  height: 38px;
  font-size: 12px;
  line-height: 14px;
  font-weight: 500;
  padding: 0 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: table-cell;
  vertical-align: middle;
  width: 175px;
}
.x-bank .f-line .f-btn--fix {
  width: 130px;
}
.x-bank .f-line .f-list-wrapper {
  position: relative;
  outline: none;
}
.x-bank .f-line .f-list-wrapper .f-list {
  display: none;
}
.x-bank .f-line .f-list-wrapper .x-error-wrapper {
  width: 360px;
  height: 200px;
  border: 1px solid #b4b4b4;
  position: absolute;
  top: 39px;
  left: 0;
  z-index: 1;
  background: #fff;
  border-radius: 0 2px 2px 2px;
}
.x-bank .f-line .f-list-wrapper.on .f-list {
  display: block;
}
.x-bank .f-line .f-list-wrapper.on .f-content {
  border-color: #b4b4b4 !important;
  border-bottom: 1px solid #fff !important;
}
.x-bank .f-line .f-list-wrapper:not(.on) .x-error-wrapper {
  display: none;
}
.x-bank .f-line .i-icon--more {
  color: var(--brand-primary);
  display: table-cell;
  vertical-align: middle;
  width: 25px;
  text-align: center;
}
.x-bank .f-line .i-icon--more::before {
  content: '\e6a3';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-bank .f-line .i-icon--more:before {
  line-height: 1;
  font-size: 14px;
}
.x-bank .f-line .i-icon--more.on {
  -webkit-transform: rotate(-180deg);
  -ms-transform: rotate(-180deg);
  transform: rotate(-180deg);
}
.x-bank .f-line--opt {
  margin-top: 37px;
}
.x-bank .f-content {
  display: inline-block;
  width: 198px;
  height: 38px;
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  position: relative;
  z-index: 2;
  cursor: pointer;
}
.x-bank .f-content .x-image-wrapper {
  display: table-cell;
  vertical-align: middle;
  padding-left: 12px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 42px;
  height: 20px;
}
.x-bank .f-content .x-image-wrapper > img {
  width: 100%;
  height: 20px;
}
.x-bank .is-error .f-content {
  border: 1px solid #e41827;
}
.x-bank .f-list {
  border: 1px solid #b4b4b4;
  position: absolute;
  top: 39px;
  left: 0;
  width: 564px;
  padding: 9px 17px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  z-index: 1;
  background: #fff;
  border-radius: 0 2px 2px 2px;
  max-height: 360px;
  overflow: scroll;
}
.x-bank .f-list .l-item {
  width: 50%;
  display: inline-block;
  vertical-align: top;
  padding: 3px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-bank .f-list .x-bank-item {
  position: relative;
  width: 100%;
  height: 48px;
  border: 1px solid #eaecef;
  border-radius: 2px;
  padding: 0 15px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-bank .f-list .x-bank-item:hover {
  background-color: #f8f8f8;
}
.x-bank .f-list .x-image-wrapper {
  display: table-cell;
  vertical-align: middle;
  padding-right: 15px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 45px;
  height: 20px;
}
.x-bank .f-list .x-image-wrapper > img {
  width: 100%;
  height: 20px;
}
.x-bank .f-list .f-text {
  line-height: 16px;
  font-size: 14px;
  font-weight: bold;
  display: table-cell;
  vertical-align: middle;
  padding: 0 15px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 48px;
}
.x-bank .f-list .l-item--checked {
  border-color: var(--brand-primary);
}
.x-bank .f-list .l-item--checked .i-icon-checked {
  position: absolute;
  top: -1px;
  left: -1px;
  display: inline-block;
  vertical-align: top;
  line-height: 1;
  color: var(--brand-primary);
}
.x-bank .f-list .l-item--checked .i-icon-checked::before {
  content: '\e622';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-bank .f-list .l-item--checked .i-icon-checked:before {
  font-size: 20px;
}
.x-bank .f-line:first-of-type {
  margin-bottom: 30px;
}
.x-bank .f-line--opt {
  margin-top: 40px;
}
.x-bank .f-line-item {
  position: relative;
}
.x-bank .f-line-item .f-error {
  position: absolute;
  top: 45px;
  left: 0;
  white-space: nowrap;
}
.x-bank .i-amount .f-error {
  white-space: normal;
  width: 500px;
  line-height: 1.2;
}

.x-bank-list {
  padding: 28px 0 40px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-bank-list .f-wrapper {
  max-height: 10rem;
  overflow-y: auto;
}
.x-bank-list .f-title {
  height: 22px;
  line-height: 22px;
  font-size: 0;
  color: #353a45;
  padding: 0 9px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-bank-list .f-title .l-col1 {
  padding-left: 36px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-bank-list .f-title .l-col1,
.x-bank-list .f-title .l-col2 {
  font-size: 14px;
  font-weight: 500;
}
.x-bank-list .l-col1,
.x-bank-list .l-col2,
.x-bank-list .l-col3 {
  display: inline-block;
  vertical-align: top;
}
.x-bank-list .l-col1 {
  width: 274px;
}
.x-bank-list .l-col2 {
  width: 190px;
}
.x-bank-list .l-col3 {
  display: none;
}
.x-bank-list .l-item {
  padding: 0 9px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 0;
  color: #353a45;
}
.x-bank-list .l-item:hover {
  background-color: #f8f8f8;
}
.x-bank-list .l-item:hover .l-col3 {
  display: inline-block;
}
.x-bank-list .l-item:hover .f-content {
  background: #fff;
}
.x-bank-list .l-item .l-col1,
.x-bank-list .l-item .l-col2,
.x-bank-list .l-item .l-col3 {
  height: 46px;
  padding: 13px 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-bank-list .l-item .x-image-wrapper {
  display: inline-block;
  vertical-align: top;
  width: 30px;
  height: 19px;
  margin-right: 14px;
}
.x-bank-list .l-item .x-image-wrapper > img {
  width: 100%;
  height: 20px;
}
.x-bank-list .l-item .f-text {
  line-height: 20px;
  font-size: 14px;
  font-weight: bold;
}
.x-bank-list .l-item .f-text:first-of-type {
  margin-right: 5px;
}
.x-bank-list .l-item .l-col3 .x-fix-input {
  margin-top: 3px;
  width: 80px;
  background: #fff;
  display: inline-block;
}
.x-bank-list .l-item .l-col3 .x-fix-input .x-input {
  width: 100%;
}
.x-fix-input .x-input {
  display: table-cell;
  vertical: middle;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-width: 1%;
  height: 36px;
  line-height: 36px;
  margin-top: 1px;
  border: none;
  outline: none;
}
.x-bank-list .l-item .f-tips {
  margin-left: 10px;
}
.x-bank-list .l-item .f-line {
  margin-top: -2px;
}
.x-bank-list .i-icon-check {
  display: inline-block;
  vertical-align: top;
  margin-top: 2px;
  margin-right: 20px;
  cursor: pointer;
}
.x-bank-list .i-icon-check:before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 1px solid #b4b4b4;
  border-radius: 50%;
}
.x-bank-list .l-item-checked {
  background-color: #f2f3f5;
}
.x-bank-list .l-item-checked .f-content {
  background: #fff;
}
.x-bank-list .l-item-checked .x-fix-input {
  background-color: #fff;
}
.x-bank-list .l-item-checked .i-icon-check {
  color: var(--brand-primary);
}
.x-fix-input {
  height: 40px;
  width: 200px;
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  padding: 0 35px 0 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.x-bank-list .l-item-checked .i-icon-check::before {
  content: '\e60b';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-bank-list .l-item-checked .i-icon-check:before {
  border: none;
  line-height: 1;
  font-size: 18px;
}
.x-bank-list .l-item-checked.l-item-fix {
  padding-bottom: 28px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 16px;
}
.x-bank-list .f-del-wrapper {
  position: relative;
  cursor: pointer;
  padding-right: 15px;
  z-index: 2;
}
.x-bank-list .f-del-wrapper .f-text-del {
  font-size: 12px;
  color: #e41827;
  line-height: 20px;
}
.x-bank-list .f-del-wrapper .f-pop-wrapper {
  position: fixed;
  padding: 10px 15px 15px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  font-size: 12px;
  line-height: 14px;
  width: 180px;
  background: #fff;
  -webkit-box-shadow:
    0 2px 5px -1px rgba(0, 0, 0, 0.08),
    2px 0 5px -1px rgba(0, 0, 0, 0.08);
  box-shadow:
    0 2px 5px -1px rgba(0, 0, 0, 0.08),
    2px 0 5px -1px rgba(0, 0, 0, 0.08);
}
.x-bank-list .f-del-wrapper .f-pop-arrow {
  width: 8px;
  height: 8px;
  position: absolute;
  border: 1px solid #eaecef;
  background: #fff;
  -webkit-box-shadow:
    0 2px 5px -1px rgba(0, 0, 0, 0.04),
    2px 0 5px -1px rgba(0, 0, 0, 0.04);
  box-shadow:
    0 2px 5px -1px rgba(0, 0, 0, 0.04),
    2px 0 5px -1px rgba(0, 0, 0, 0.04);
  border-top-color: transparent;
  border-left-color: transparent;
  top: 10%;
  -webkit-transform: rotate(135deg);
  -ms-transform: rotate(135deg);
  transform: rotate(135deg);
  left: -5px;
  margin-top: -4px;
}
.x-bank-list .f-del-wrapper .f-line {
  padding: 24px 0 0 !important;
  margin: 0 !important;
  text-align: right;
  height: auto;
}
.x-bank-list .f-del-wrapper .f-line .af-button {
  width: 65px;
  height: 32px;
  padding: 0 !important;
  font-size: 12px;
}
.x-bank-list .f-del-wrapper .f-line .af-button--text {
  color: var(--brand-primary);
  border: 1px solid var(--brand-primary) !important;
  margin-right: 8px;
}

.x-bank-list .f-line {
  padding-left: 23px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-bank-list .f-line .i-bank {
  margin-right: 10px;
}
.x-bank-list .f-line .i-bank .l-item:hover {
  background: transparent;
}
.x-bank-list .f-line .f-btn {
  height: 38px;
  font-size: 12px;
  line-height: 14px;
  font-weight: 500;
  padding: 0 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: table-cell;
  vertical-align: middle;
  width: 175px;
}
.x-bank-list .f-line .f-btn--fix {
  width: 130px;
}
.x-bank-list .f-line .f-list-wrapper {
  position: relative;
  outline: none;
}
.x-bank-list .f-line .f-list-wrapper .f-list {
  display: none;
}
.x-bank-list .f-line .f-list-wrapper .x-error-wrapper {
  width: 360px;
  height: 200px;
  border: 1px solid #b4b4b4;
  position: absolute;
  top: 39px;
  left: 0;
  z-index: 1;
  background: #fff;
  border-radius: 0 2px 2px 2px;
}
.x-bank-list .f-line .f-list-wrapper.on .f-list {
  display: block;
}
.x-bank-list .f-line .f-list-wrapper.on .f-content {
  border-color: #b4b4b4 !important;
  border-bottom: 1px solid #fff !important;
}
.x-bank-list .f-line .f-list-wrapper:not(.on) .x-error-wrapper {
  display: none;
}
.x-bank-list .f-line .i-icon--more {
  color: #226222;
  display: table-cell;
  vertical-align: middle;
  width: 25px;
  text-align: center;
}
.x-bank-list .f-line .i-icon--more::before {
  content: '\e6a3';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-bank-list .f-line .i-icon--more:before {
  line-height: 1;
  font-size: 14px;
}
.x-bank-list .f-line .i-icon--more.on {
  -webkit-transform: rotate(-180deg);
  -ms-transform: rotate(-180deg);
  transform: rotate(-180deg);
}
.x-bank-list .f-line--opt {
  margin-top: 37px;
}
.x-bank-list .f-content {
  display: inline-block;
  width: 198px;
  height: 38px;
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  position: relative;
  z-index: 2;
  cursor: pointer;
}
.x-bank-list .f-content .x-image-wrapper {
  display: table-cell;
  vertical-align: middle;
  padding-left: 12px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 42px;
  height: 20px;
}
.x-bank-list .f-content .x-image-wrapper > img {
  width: 100%;
  height: 20px;
}
.x-bank-list .is-error .f-content {
  border: 1px solid #e41827;
}
.x-bank-list .f-list {
  border: 1px solid #b4b4b4;
  position: absolute;
  top: 39px;
  left: 0;
  width: 564px;
  padding: 9px 17px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  z-index: 1;
  background: #fff;
  border-radius: 0 2px 2px 2px;
  max-height: 360px;
  overflow: scroll;
}
.x-bank-list .f-list .l-item {
  width: 50%;
  display: inline-block;
  vertical-align: top;
  padding: 3px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-bank-list .f-list .x-bank-item {
  position: relative;
  width: 100%;
  height: 48px;
  border: 1px solid #eaecef;
  border-radius: 2px;
  padding: 0 15px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-bank-list .f-list .x-bank-item:hover {
  background-color: #f8f8f8;
}
.x-bank-list .f-list .x-image-wrapper {
  display: table-cell;
  vertical-align: middle;
  padding-right: 15px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 45px;
  height: 20px;
}
.x-bank-list .f-list .x-image-wrapper > img {
  width: 100%;
  height: 20px;
}
.x-bank-list .f-list .f-text {
  line-height: 16px;
  font-size: 14px;
  font-weight: bold;
  display: table-cell;
  vertical-align: middle;
  padding: 0 15px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 48px;
}
.x-bank-list .f-list .l-item--checked {
  border-color: var(--brand-primary);
}
.x-bank-list .f-list .l-item--checked .i-icon-checked {
  position: absolute;
  top: -1px;
  left: -1px;
  display: inline-block;
  vertical-align: top;
  line-height: 1;
  color: var(--brand-primary);
}
.x-bank-list .f-list .l-item--checked .i-icon-checked::before {
  content: '\e622';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-bank-list .f-list .l-item--checked .i-icon-checked:before {
  font-size: 20px;
}
.x-bank-list .f-list {
  width: 540px;
}
.x-bank-list .f-line .f-label {
  width: 184px;
}
.x-bank-list > .f-line {
  padding-left: 12px;
}
.x-bank-list > .f-line:first-of-type {
  margin-top: 16px;
}
.x-bank-list .i-amount .x-input-wrapper {
  width: 170px;
}
</style>
