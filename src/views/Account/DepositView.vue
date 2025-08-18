<template>
  <AccountLayout>
    <div class="x-dp-ng">
      <ul class="x-dp-nav">
        <li
          class="f-item"
          v-for="(method, index) in depositMethods"
          :class="activeTab.provider == method.provider ? 'f-item--active' : ''"
          :key="index"
          @click="setActiveTab(method)"
        >
          {{ method.provider === 'sbengine' ? 'Shop' : method.title }}
        </li>
      </ul>
      <div class="f-dp">
        <div>
          <div class="bank-transfer-form-section">
            <div class="f-line">
              <span class="f-label"
                ><span>Amount</span> ({{ SportsbookGlobalVariable.Currency }})
              </span>
              <div class="f-line-item i-amount">
                <div tabindex="6" class="x-input-wrapper">
                  <span class="x-input-com"
                    ><i class="x-input-icon m-input-icon--clickable m-icon-delete"></i>
                    <input
                      type="input"
                      input-mode=""
                      name=""
                      placeholder="min. 100"
                      onpaste="return true"
                      class="x-input fs-exclude"
                      v-model="amount"
                  /></span>
                </div>
              </div>
              <div class="f-line mt-24" v-if="availableBonus && !bonus">
                <span class="f-label"></span>
                <button
                  class="af-button af-button--primary"
                  :class="amount == '' ? ' is-disabled' : ''"
                  type="primary"
                  @click.prevent="activateBonus"
                  :disabled="amount === ''"
                >
                  <span> Activate Bonus </span>
                </button>
              </div>
              <div class="f-line mt-24">
                <span class="f-label"></span>
                <button
                  class="af-button af-button--primary"
                  :class="btnDisabled || amount === '' ? 'is-disabled' : ''"
                  type="primary"
                  @click.prevent="beginDeposit"
                >
                  <span> Top Up Now </span>
                </button>
              </div>
              <p v-if="bonus" class="mt-24">
                You have activated <strong>{{ availableBonus?.name }}</strong
                >. Complete payment to receive <strong>{{ formatNumber(bonus?.amount) }}</strong> in
                your bonus account.
              </p>
            </div>
          </div>
          <div style="margin-top: 20px" class="bank-transfer-desc-section">
            <span>
              <ol class="bank-transfer-card-steps">
                <li>
                  Minimum deposit amount is {{ SportsbookGlobalVariable.CurrencyCode }}
                  {{ SportsbookGlobalVariable.MinDeposit }} - you can deposit at least
                  {{ SportsbookGlobalVariable.CurrencyCode }}
                  {{ SportsbookGlobalVariable.MinDeposit }} in one transaction.
                </li>
                <li>
                  Maximum per transaction is
                  {{ SportsbookGlobalVariable.CurrencyCode }} 9,999,999.00 - you can deposit up to
                  {{ SportsbookGlobalVariable.CurrencyCode }} 9,999,999.00 in one transaction.
                </li>
                <li>If you have any issues, please contact the support team.</li>
              </ol></span
            >
          </div>
        </div>
      </div>
      <div class="payment-tips-wrap"></div>
    </div>
    <!-- <LoadingSpinner v-else /> -->
  </AccountLayout>
</template>

<script setup>
import AccountLayout from '@/components/Shared/AccountLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore, useUtilsStore } from '@/stores'
import { getPaymentMethods, getDepositURL, checkFirstDeposit, formatNumber } from '@/helpers'
import emitter from '@/plugins/emitter'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'

const activeTab = ref('')
const depositMethods = ref([])
const usersStore = useUsersStore()
const router = useRouter()
const amount = ref('')
const isLoading = ref(false)
const btnDisabled = ref(false)
const availableBonus = ref(null)

const { SportsbookGlobalVariable } = useUtilsStore()

const bonus = computed(() => {
  return usersStore.bonus
})

function setActiveTab(method) {
  activeTab.value = method
  amount.value = ''
}

async function getPayments() {
  isLoading.value = true
  const res = await getPaymentMethods()
  depositMethods.value = res.data
  activeTab.value = res.data[0]
  isLoading.value = false
}

async function checkForBonus() {
  const resp = await checkFirstDeposit()
  if (resp.success) {
    availableBonus.value = resp.data
  }
}

function activateBonus() {
  let bonusAmount = amount.value
  if (availableBonus.value.type === 'flat') {
    bonusAmount = availableBonus.value.value
  } else {
    bonusAmount = (parseFloat(amount.value) * availableBonus.value.value) / 100
  }

  const bonus = {
    bonusId: availableBonus.value.bonusId,
    amount: bonusAmount,
    username: usersStore.currentUser.username
  }
  usersStore.setActiveBonus(bonus)
  // availableBonus.value = null;
}

async function beginDeposit() {
  if (parseFloat(amount.value) < parseFloat(SportsbookGlobalVariable.MinDeposit)) {
    let error = {
      dialogType: 'error',
      dialogData: {
        data: `Your deposit amount is lower than the allowed value (${SportsbookGlobalVariable.Currency}${SportsbookGlobalVariable.MinDeposit}). Increase the amount and try again. `
      }
    }
    emitter.emit('showDialog', error)
    return
  }
  btnDisabled.value = true
  let payload = {
    amount: amount.value,
    paymentMethod: activeTab.value.provider,
    clientId: import.meta.env.VITE_CLIENT_ID
  }

  const res = await getDepositURL(payload)
  amount.value = null
  if (res.success) {
    btnDisabled.value = false
    if (activeTab.value.provider === 'sbengine') {
      let data = {
        dialogType: 'shop-transaction',
        dialogData: {
          type: 'deposit',
          message: 'Deposit Request Recieved!',
          amount: amount.value,
          transactionCode: res.data.transactionRef
        }
      }
      console.log(data)
      emitter.emit('showDialog', data)
    } else {
      if (res.data.link === 'ACCEPTED') {
        window.location.href = '/'
      } else if (!res.data.link.includes('http')) {
        emitter.emit('showErrorMessage', res.message)
      } else {
        window.location.href = res.data.link
      }
    }
  } else {
    let error = {
      dialogType: 'error',
      dialogData: res.message ?? 'An Error occured. Please try again'
    }
    emitter.emit('showDialog', error)
    console.error(res)
  }
}
onMounted(async () => {
  if (!usersStore.currentUser) {
    return router.push({ name: 'sign-in' })
  }
  usersStore.setActiveBonus(null)

  await getPayments()
  await checkForBonus()
})
</script>

<style>
.x-dp-ng {
  background: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  margin-left: 21px;
  padding: 0 65px 59px;
}

.x-dp-ng .f-dp {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 16px 0 20px;
  width: 100%;
}

.x-dp-ng .f-line {
  display: block;
}

.x-dp-ng .f-line .f-line-item {
  display: inline-block;
  vertical-align: top;
}

.x-dp-ng .f-line .f-label {
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
  width: 129px;
}

.x-dp-ng .f-line .x-input-wrapper {
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  height: 38px;
  width: 170px;
}

.x-dp-ng .f-line .x-input-wrapper .x-input-com {
  display: inline-block;
}

.x-dp-ng .f-line .x-input-wrapper .x-input-com,
.x-dp-ng .f-line .x-input-wrapper .x-input {
  height: calc(100% - 2px);
  margin: 1px;
  width: calc(100% - 2px);
}

.x-dp-ng .f-line .x-input-wrapper .x-input {
  border: none !important;
  padding-right: 28px !important;
}

.x-dp-ng .f-line .x-input-wrapper .x-input-icon--clickable {
  color: #dcdee5;
  display: inline-block;
  height: 36px;
  line-height: 36px;
  margin-top: 1px;
}

.x-dp-ng .f-line .x-input-wrapper .x-input-icon--clickable:hover {
  color: #9ca0ab;
}

.x-dp-ng .f-line .x-input-wrapper.x-input-wrapper--active {
  border: 1px solid var(--brand-primary) !important;
}

.x-dp-ng .f-line .x-input-wrapper.x-input-wrapper--error {
  border: 1px solid #e41827 !important;
}

.x-dp-ng .f-line .x-input-wrapper.x-input-wrapper--error .x-input-icon--clickable:hover {
  color: #e41827 !important;
}

.x-dp-ng .f-line .x-fix-input .x-input,
.x-dp-ng .f-line .x-input-wrapper .x-input {
  font-size: 14px;
  font-weight: 500;
}

.x-dp-ng .f-line .f-error p {
  color: #e41827;
  font-size: 12px;
}

.x-dp-ng .f-line .af-button {
  padding-left: 0;
  padding-right: 0;
  text-align: center;
  border: none !important;
  font-size: 16px;
  border-radius: 2px;
  height: 40px;
  width: 170px;
}

.x-dp-ng .f-line .af-button--primary {
  background: var(--brand-secondary) !important;
  color: #fff !important;
}

.x-dp-ng .f-line .is-disabled {
  background: #dcdee5 !important;
  color: #fff !important;
}

.x-dp-ng .f-line .is-disabled:hover,
.x-dp-ng .f-line .is-disabled:active {
  background: #dcdee5 !important;
  color: #fff !important;
}

.x-dp-ng .x-dp-coming-soon-container {
  height: 60vh;
}

.x-dp-ng .x-dp-coming-soon-container > .container {
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
}

.x-dialog--tips .x-pop-main > p {
  padding: 0 24px;
}

.x-dialog--tips .x-btn-wrapper {
  margin-top: 64px;
}

.name-confirm-tip-wrap {
  margin-top: 20px;
}

.paystack-open-dialog.es-dialog {
  padding: 0 120px;
}

.payment-tips-wrap {
  border-top: 1px solid #eaecef;
  padding-top: 12px;
}

.x-dp-nav {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid #eaecef;
  margin-bottom: -3px;
}

.x-dp-nav::-webkit-scrollbar {
  display: none;
  height: 0px;
}

.x-dp-nav .f-item {
  display: inline-block;
  padding: 20px 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 20px;
  cursor: pointer;
  white-space: nowrap;
}

.x-dp-nav .f-item:not(:last-child) {
  margin-right: 12px;
}

.x-dp-nav .f-item.f-item--active {
  font-weight: bold;
  border-bottom: 3px solid var(--brand-secondary);
}

.bank-transfer-card {
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.3);
  margin-bottom: 1.66666667rem;
  padding: 1rem 1.33333333rem 1.33333333rem;
  border-radius: 0.16666667rem;
}

.bank-transfer-card-title {
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.33333333rem;
}

.bank-transfer-card-steps {
  counter-reset: step-counter;
  list-style: none;
}

.bank-transfer-card-steps li {
  margin-bottom: 1rem;
  display: flex;
  counter-increment: step-counter;
}

.bank-transfer-card-steps li:before {
  content: 'Step ' counter(step-counter);
  margin-right: 1rem;
  color: #9ca0ab;
  display: block;
  min-width: 2.91666667rem;
}

.bank-transfer-card-steps li:last-child {
  margin-bottom: 0;
}

ol.bank-transfer-card-steps {
  padding: 0;
}

html[theme='dark'] {
  color: #fff;
  background-color: #1b1e25;
}

html,
html[theme='light'] {
  color: #000;
  background-color: #fafafa;
}

.x-input-wrapper {
  display: inline-block;
  font-size: 14px;
  line-height: normal;
  outline: none;
  position: relative;
}

.x-input-wrapper .x-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  font-size: inherit;
  height: 36px;
  line-height: 1;
  max-width: 100%;
  outline: none;
  padding: 3px 10px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  color: #353a45;
  color: var(--text-type1-primary);
  background-color: #fafafa;
  background-color: var(--background-general-primary);
}

.x-input-wrapper .x-input::-webkit-input-placeholder {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}

.x-input-wrapper .x-input::-moz-placeholder {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}

.x-input-wrapper .x-input::-ms-input-placeholder {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}

.x-input-wrapper .x-input::placeholder {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
}

.x-input-wrapper .x-input-com {
  position: relative;
}

.x-input-wrapper .x-input-icon {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  height: 100%;
  position: absolute;
  right: 0;
  text-align: center;
  top: 0;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  visibility: hidden;
  width: 35px;
}

.x-input-wrapper .x-input-icon:before {
  color: #9ca0ab;
  color: var(--text-type1-secondary);
  content: '\e602';
  display: inline-block;
  vertical-align: middle;
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.x-input-wrapper .x-input-icon + .x-input {
  padding-right: 12px;
}

.x-input-wrapper .x-input-icon.x-input-icon--show + .x-input {
  padding-right: 30px;
}

.x-input-wrapper .x-input-icon.x-input-icon--show {
  visibility: visible;
}

.x-input-wrapper .x-input-text--icon {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  cursor: pointer;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  position: absolute;
  right: 0;
  text-align: center;
  top: 0;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  width: 42px;
  color: var(--brand-primary);
  color: var(--brand-secondary);
}

.x-input-wrapper .x-input-text--icon + .x-input {
  padding-right: 42px;
}

.x-input-wrapper.x-input-wrapper--active {
  border: none !important;
}

.x-input-wrapper.x-input-wrapper--active .x-input {
  border: 1px solid var(--brand-primary);
  border-color: var(--brand-primary);
  border-color: var(--brand-secondary);
}

.x-input-wrapper.x-input-wrapper--active .x-input-prepend {
  border-color: var(--brand-primary);
  border-color: var(--brand-secondary);
}

.x-input-wrapper.x-input-wrapper--active.x-input-group--prepend .x-input {
  border-color: var(--brand-primary);
  border-color: var(--brand-secondary);
}

.x-input-wrapper.x-input-wrapper--disabled .x-input,
.x-input-wrapper.x-input-wrapper--disabled .x-input-append,
.x-input-wrapper.x-input-wrapper--disabled .x-input-prepend {
  background-color: #dcdee5;
  background-color: var(--disable-brand-secondary);
  border-color: #eaecef;
  border-color: var(--line-type1-primary);
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
  cursor: not-allowed;
}

.x-input-wrapper.x-input-wrapper--disabled .x-input::-webkit-input-placeholder {
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
}

.x-input-wrapper.x-input-wrapper--disabled .x-input::-moz-placeholder {
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
}

.x-input-wrapper.x-input-wrapper--disabled .x-input::-ms-input-placeholder {
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
}

.x-input-wrapper.x-input-wrapper--disabled .x-input::placeholder {
  color: #9ca0ab;
  color: var(--text-disable-type1-primary);
}

.x-input-wrapper.x-input-wrapper--error {
  border: none !important;
}

.x-input-wrapper.x-input-wrapper--error .x-input {
  border: 1px solid #e41827 !important;
  border-color: #e41827 !important;
  border-color: var(--warning-primary) !important;
}

.x-input-wrapper.x-input-wrapper--error.x-input-group--prepend .x-input-prepend {
  border: 1px solid #e41827;
  border-right: none;
  border-color: #e41827;
  border-color: var(--warning-primary);
}

.x-input-wrapper.x-input-wrapper--error.x-input-group--prepend .x-input {
  border-left: none !important;
}

.x-input-wrapper.x-input-wrapper--large {
  font-size: 16px;
}

.x-input-wrapper.x-input-wrapper--large .x-input {
  height: 42px;
}

.x-input-wrapper.x-input-wrapper--small {
  font-size: 13px;
}

.x-input-wrapper.x-input-wrapper--small .x-input {
  height: 30px;
}

.x-input-group {
  border-collapse: separate;
  display: inline-table;
  line-height: normal;
  width: 100%;
}

.x-input-group > .x-input {
  display: table-cell;
  vertical-align: middle;
}

.x-input-group .x-input-append,
.x-input-group .x-input-prepend {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  border: 1px solid #eaecef;
  border-radius: 4px;
  display: table-cell;
  padding: 0 10px;
  position: relative;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  vertical-align: middle;
  white-space: nowrap;
  width: 1px;
  color: #353a45;
  color: var(--text-type1-primary);
  border-color: #eaecef;
  border-color: var(--line-type1-primary);
}

.x-input-group .x-input-append .x-input,
.x-input-group .x-input-prepend .x-input {
  font-size: inherit;
}

.x-input-group.x-input-group--prepend .x-input-prepend {
  border-bottom-right-radius: 0;
  border-right: 0;
  border-top-right-radius: 0;
}

.x-input-group.x-input-group--prepend .x-input {
  border: 1px solid #eaecef;
  border-bottom-left-radius: 0;
  border-left: 0;
  border-top-left-radius: 0;
  border-color: #eaecef;
  border-color: var(--line-type1-primary);
}

.x-input-group.x-input-group--append .x-input-append {
  border-bottom-left-radius: 0;
  border-left: 0;
  border-top-left-radius: 0;
}

.x-input-group.x-input-group--append .x-input {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}

.x-input-wrapper .x-input-text--icon + .x-input {
  padding-right: 50px;
}

.x-input-wrapper .x-input.hide-arrow {
  /* Chrome, Safari, Edge, Opera */
  /* Firefox */
}

.x-input-wrapper .x-input.hide-arrow::-webkit-outer-spin-button,
.x-input-wrapper .x-input.hide-arrow::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.x-input-wrapper .x-input.hide-arrow[type='number'] {
  -moz-appearance: textfield;
}
</style>
