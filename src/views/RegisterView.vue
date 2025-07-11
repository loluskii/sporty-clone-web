<template>
  <DefaultLayout>
    <div>
      <p class="x-page-title"></p>
      <div class="x-page x-page--login">
        <header class="x-header-bar">
            <span class="x-header-bar-title">Create Your Account</span>
          </header>
        <section class="x-page-main">
          <div class="x-opt-wrapper">
            <div v-if="authStore.authError" class="x-error-wrap">
              <div class="x-error">
                <i class="x-icon--error"></i>
                <p class="x-text-info">{{ authStore.authError }}</p>
              </div>
            </div>
            <div v-if="activeStep === 1" class="x-page-opt without-error">
              <form action="">
                <div tabindex="6" class="x-input-wrapper x-input-group x-input-group--prepend">
                  <div class="x-input-prepend"><span>+234</span></div>
                  <span class="x-input-com"><i
                      class="x-input-icon x-input-icon--clickable x-input-icon--show x-icon-delete"></i>
                    <input type="input" input-mode="" name="" placeholder="Mobile Number" onpaste="return true"
                      class="x-input fs-exclude" v-model="phoneNumber" /></span>
                </div>
                <div tabindex="8" class="x-input-wrapper">
                  <span class="x-input-com">
                    <input type="password" name="" placeholder="Password" onpaste="return true"
                      class="x-input fs-exclude" v-model="password" /></span>
                </div>
                <div v-if="authType === 'register'" style="display: flex; align-items: start; margin-top: 10px;">
                  <input type="checkbox" id="agreeToTerms" v-model="agreeToTerms"
                    style="margin-right: 7px; margin-top: 5px; accent-color: var(--brand-primary)" />
                  <label for="agreeToTerms" style="font-size: 0.95rem;">
                    By checking this box, you confirm you are above 18 and you agree to our
                    <a href="/CMS/TandC" target="_blank" style="color: var(--brand-secondary); font-weight: bold;">Terms
                      and Conditions</a>.
                  </label>
                </div>
              </form>

              <div class="x-btn-wrap">
                <button @click.prevent="handleFormSubmit" class="af-button af-button--primary" :class="{
                  'is-disabled': authStore.loading || !phoneNumber || !password || (authType === 'register' && !agreeToTerms)
                }" :disabled="authStore.loading || (authType === 'register' && !agreeToTerms)">
                  <span><span data-cms-key="log_in">{{
                    authStore.loading ? 'Please Wait' : 'Continue'
                  }}</span></span>
                </button>
              </div>
            </div>
            <div v-else-if="activeStep === 2" class="bg-wrapper">
              <div class="flex-column size-14 text-center pd-t-40 pd-b-24 justify-between">
                <span>
                  <p class="mg-b-16 size-18 pd-hor-100">
                    We've sent you a 6-digit code to +234 {{ phoneNumber }}
                  </p>
                </span>
                <div>
                  <div class="x-pin-code-wrapper mg-b-16 size-20">
                    <form>
                      <v-otp-input ref="otpInput" input-classes="x-pin-code-input fs-exclude" separator="  "
                        :num-inputs="6" :should-auto-focus="true" input-type="number" @on-complete="storeOTP" />
                    </form>
                  </div>
                  <div v-if="!authStore.loading">
                    <span class="darkGray not-allowed">Didn't get the code? </span>
                    <span class="sec-left" @click="resendOtp" :disabled="isDisabled"
                      :style="{ cursor: isDisabled ? 'not-allowed' : 'pointer' }">
                      {{
                        isDisabled ? `Send Again in ${remainingTime}s` : 'Send Again'
                      }}</span>
                  </div>
                  <LoadingSpinner v-if="authStore.loading"></LoadingSpinner>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from "@/components/Shared/DefaultLayout.vue";
import StepHeader from "@/components/PasswordReset/Header.vue";
import StepOne from "@/components/PasswordReset/StepOne.vue";
import StepTwo from "@/components/PasswordReset/StepTwo.vue";
import StepThree from "@/components/PasswordReset/StepThree.vue";
import { ref, onMounted } from "vue";
import { verifyUsername, CLIENT_ID, formattedPhoneNumber } from "@/helpers";
import { useAuthStore } from "@/stores";

const phoneNumber = ref("");
const isLoading = ref(false);
const phoneNumberError = ref(false);
const authStore = useAuthStore()
const password = ref('')
const authType = ref('register')
const buttonText = ref('Create Your Account')
const registerError = ref(false)
const registerErrorMessage = ref('')
const activeStep = ref(1)
const remainingTime = ref(60)
const isDisabled = ref(false)
let timer
const agreeToTerms = ref(false)

function setAuthType(type) {
  authType.value = type
  authStore.authError = null
  if (type === 'register') {
    buttonText.value = 'Create Your Account'
  } else {
    buttonText.value = 'Login'
  }
}

const handleFormSubmit = async () => {
  authStore.authError = null
  if (authType.value === 'register' && !agreeToTerms.value) {
    authStore.authError = 'You must confirm you are above 18 and agree to the Terms and Conditions to continue.'
    return
  }
  if (authType.value === 'register') {
    await registerUser()
  } else {
    await login()
  }
}

async function login() {
  let payload = {
    username: formattedPhoneNumber(phoneNumber.value),
    password: password.value,
    clientId: import.meta.env.VITE_CLIENT_ID
  }
  authStore.doLogin(payload)
}

const registerUser = async () => {
  authStore.loading = true
  const userExists = await verifyUsername({
    username: formattedPhoneNumber(phoneNumber.value),
    clientId: import.meta.env.VITE_CLIENT_ID
  })
  if (userExists.responseMessage === 'SUCCESSFUL') {
    authStore.authError = 'An account already exists with this number'
    authStore.loading = false
    return
  } else {
    await doRegistration()
    // const res = await sendOTP({
    //   clientID: import.meta.env.VITE_CLIENT_ID,
    //   phoneNumber: `234${formattedPhoneNumber(phoneNumber.value)}`
    // })
    // authStore.loading = false
    // if (res.status) {
    //   activeStep.value = 2
    //   startTimer()
    // } else {
    //   authStore.authError = res.message
    // }
  }
}

const startTimer = () => {
  isDisabled.value = true
  remainingTime.value = 60

  if (timer) clearInterval(timer) // Clear any existing timer

  timer = setInterval(() => {
    remainingTime.value -= 1
    if (remainingTime.value === 0) {
      clearInterval(timer)
      isDisabled.value = false
    }
  }, 1000)
}

const resendOtp = async () => {
  if (!isDisabled.value && remainingTime.value === 0) {
    let phone = phoneNumber.value.replace(/^0/, '')
    const internationalNumber = `234${phone}`
    let payload = {
      clientID: import.meta.env.VITE_CLIENT_ID,
      phoneNumber: internationalNumber
    }

    const res = await sendOTP(payload)
    if (res.data.status) {
      startTimer()
    }
  }
}

const storeOTP = async (data) => {
  authStore.loading = true
  authStore.authError = null
  const internationalNumber = `234${formattedPhoneNumber(phoneNumber.value)}`
  let payload = {
    clientID: import.meta.env.VITE_CLIENT_ID,
    phoneNumber: internationalNumber,
    code: data
  }

  const res = await verifyOTP(payload)
  if (res.data.status) {
    await doRegistration()
  } else {
    authStore.loading = false
    authStore.authError = res.data.message
  }
}

const doRegistration = async () => {
  authStore.loading = true
  authStore.authError = null

  const payload = {
    username: formattedPhoneNumber(phoneNumber.value),
    password: password.value,
    phone: `234${formattedPhoneNumber(phoneNumber.value)}`,
    clientID: import.meta.env.VITE_CLIENT_ID
  }

  try {
    const res = await register(payload)
    if (!res.data.error) {
      await authStore.doLogin(payload)
      authStore.loading = false
    } else {
      throw Error(res.data.error)
    }
  } catch (error) {
    authStore.loading = false
    authStore.authError = error
  }
}

// const toLogin = () => {
//   activeStep.value = 1
//   authStore.loading = false
//   authStore.authError = null
//   document.querySelector('input').textContent = ''
// }

onMounted(() => {
  authStore.authError = null
  authStore.loading = false
})

</script>

<style>
.x-dialog-wrapper {
  background: #fff;
  left: 50%;
  position: absolute;
  top: 50%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  width: 315px;
}
.x-dialog-wrapper .invisiable-item {
  left: 300vw;
  position: fixed;
}
.x-dialog-wrapper .x-holding-icon {
  -webkit-animation: loading-rotate 1.2s linear infinite;
  animation: loading-rotate 1.2s linear infinite;
  display: inline-block;
  left: calc(50% - 15px);
  position: absolute;
  top: 170px;
}
.x-dialog-wrapper .x-holding-icon::before {
  content: "\e654";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-dialog-wrapper .x-holding-icon:before {
  color: #0d9737;
  font-size: 30px;
  line-height: 1;
  vertical-align: top;
}
.x-dialog-wrapper .x-pop-header {
  position: relative;
}
.x-dialog-wrapper .x-pop-header > span {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  font-size: 16px;
  line-height: 22px;
  max-width: calc(100% - 24px);
  padding: 15px 13px;
}
.x-dialog-wrapper .x-pop-header .close-icon {
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 20px;
}
.x-dialog-wrapper .x-pop-header .x-icon-close {
  cursor: pointer;
  position: absolute;
  right: 13px;
  top: 50%;
  -webkit-transform: translate3d(0, -50%, 0);
  transform: translate3d(0, -50%, 0);
}
.x-dialog-wrapper .x-pop-header .x-icon-close::before {
  content: "\e69a";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-dialog-wrapper .x-pop-header-fix {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 20px 0 0;
  text-align: center;
}
.x-dialog-wrapper .x-pop-header-fix .x-icon-suc {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: block;
  padding: 20px 0 0;
}
.x-dialog-wrapper .x-pop-header-fix .x-icon-suc::before {
  content: "\e60b";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-dialog-wrapper .x-pop-header-fix .x-icon-suc:before {
  color: #0d9737;
  font-size: 28px;
  line-height: 1;
}
.x-dialog-wrapper .x-pop-header-fix > span {
  width: 100%;
}
.x-dialog-wrapper .x-pop-header-fix .x-icon-close {
  top: 20px;
}
.x-dialog-wrapper .x-pop-main {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 36px 0 15px;
  width: 100%;
}
.x-dialog-wrapper .x-pop-main > p {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  font-size: 14px;
  line-height: 20px;
  padding: 0 13px;
}
.x-dialog-wrapper .x-pop-main .x-tips-strong {
  color: #000;
  font-weight: bold;
}
.x-dialog-wrapper .x-order-info {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 0;
  height: 26px;
  line-height: 26px;
  overflow: hidden;
  padding: 0 13px;
}
.x-dialog-wrapper .x-order-info .x-label,
.x-dialog-wrapper .x-order-info .x-value {
  color: #353a45;
  display: inline-block;
  font-size: 14px;
  line-height: 1;
  vertical-align: middle;
}
.x-dialog-wrapper .x-order-info .icon-one-bet-cut {
  background: #32ce62;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-clip-path: polygon(0 1%, 91% 1%, 70% 100%, 0% 100%);
  clip-path: polygon(0 1%, 91% 1%, 70% 100%, 0% 100%);
  color: #fff;
  display: inline-block;
  /* // font-family: Roboto; */
  height: 16px;
  line-height: 16px;
  overflow: hidden;
  position: relative;
  width: 16px;
}
.x-dialog-wrapper .x-order-info .icon-one-bet-cut > span {
  font-size: 24px;
  font-style: italic;
  font-weight: bold;
  left: -2px;
  position: absolute;
  top: 3px;
}
.x-dialog-wrapper .x-order-info .x-value {
  float: right;
}
.x-dialog-wrapper .x-btn-wrapper {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-top: 28px;
  padding: 0 13px;
  text-align: right;
}
.x-dialog-wrapper .x-btn-wrapper .af-button {
  border-radius: 2px;
}
.x-dialog-wrapper .x-btn-wrapper .af-button:not(:last-of-type) {
  margin-right: 10px;
}
.x-dialog-wrapper .af-button--text {
  color: #0d9737;
  font-size: 14px;
  font-weight: bold;
}

.x-dialog-wrapper .af-button--primary {
  background: #0d9737 !important;
  border: none;
  color: #fff !important;
  font-size: 12px;
  font-weight: bold;
  height: 32px;
}
.x-dialog-wrapper .x-share-wrapper {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 20px 60px 0;
}
.x-dialog-wrapper .x-share-wrapper .booking-code-share {
  margin-top: -17px;
  text-align: center;
}
.x-dialog-wrapper .x-share-wrapper .booking-code-share .booking-code-title {
  font-size: 12px;
  font-weight: bold;
  line-height: 14px;
  margin-bottom: 8px;
}
.x-dialog-wrapper .x-share-wrapper .booking-code-share .booking-code-share-code {
  font-size: 28px;
  font-weight: bold;
  line-height: 33px;
  margin: auto;
  margin-bottom: 8px;
  position: relative;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
}
.x-dialog-wrapper
  .x-share-wrapper
  .booking-code-share
  .booking-code-share-code
  #content-copy {
  left: 100%;
  margin-left: 12px;
  margin-top: 4px;
  position: absolute;
}
.x-dialog-wrapper .x-share-wrapper .booking-code-share .booking-code-time {
  color: #9ca0ab;
  font-size: 12px;
  line-height: 14px;
  margin-bottom: 24px;
}
.x-dialog-wrapper .x-share-wrapper .booking-code-share .zoom-image-container {
  margin: auto;
  position: relative;
}
.x-dialog-wrapper .x-share-wrapper .booking-code-share .zoom-image-container .zoom-image {
  height: 100px;
}
.x-dialog-wrapper
  .x-share-wrapper
  .booking-code-share
  .zoom-image-container
  .zoom-handler {
  cursor: pointer;
  left: 50%;
  position: absolute;
  top: 50%;
  -webkit-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);
}
.x-dialog-wrapper .x-share-wrapper .booking-code-share #content-copy {
  margin-bottom: 6px;
  margin-left: 5px;
  width: 24px;
}
.x-dialog-wrapper-fix {
  width: 486px;
}
.x-dialog-wrapper-fix .x-pop-header > span {
  font-weight: bold;
  line-height: 19px;
  padding: 0;
}
.x-dialog-wrapper-fix .x-pop-header .x-icon-close:before {
  font-size: 10px;
  line-height: 20px;
}
.x-dialog-wrapper-fix .x-pop-main {
  padding-bottom: 36px;
}
.x-dialog-wrapper-fix .x-pop-main > p {
  font-size: 12px;
  line-height: 16px;
  padding: 0 60px;
}
.es-dialog.desktop .es-dialog-footer {
  margin-bottom: 14px;
  padding: 0 16px;
}
.es-dialog.desktop .es-dialog-footer .es-dialog-btn {
  background: #0d9737;
  color: #fff;
  font-size: 14px;
  padding: 6px 16px;
}
.x-page-wrapper {
  background: url(//s.sporty.net/global/main/modules/main/desktop/changePassword/image/forgotPasswordBg2.42a6e8b921.png)
    no-repeat left bottom;
  background-size: cover;
  padding-bottom: 220px;
}
.x-page-wrapper > div {
  margin: 0 auto;
  width: 465px;
}
.x-page-wrapper .x-page-title {
  color: #353a45;
  font-size: 26px;
  line-height: 33px;
  padding: 30px 0 14px;
}
.x-page-wrapper .x-page-title .x-icon-lock::before {
  content: "\e60e";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-page-wrapper .x-page-title .x-icon-lock:before {
  display: inline-block;
  font-size: 23px;
  margin-right: 10px;
  vertical-align: middle;
}
.x-page-wrapper .x-page {
  -webkit-box-align: stretch;
  -webkit-align-items: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
  background: #f8f8f8;
  border-radius: 2px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  min-height: 400px;
  width: 465px;
}

.x-header-bar {
  height: 110px;
  min-height: 110px;
  position: relative;
}

.x-page-wrapper .x-header-bar {
  background: #fff;
}

.x-page--phone .x-header-bar {
  border-bottom: 1px solid #eaecef;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  font-size: 20px;
  height: 57px;
  line-height: 57px;
  padding: 0 30px;
  width: 100%;
}

.x-page--phone .x-header-bar .x-header-bar-title {
  font-size: 20px;
  line-height: 56px;
  text-align: left;
}

.x-page .btn-wrapper,
.x-page .af-button {
  width: 100%;
  height: 38px;
}
.x-page .af-button {
  padding-left: 0;
  padding-right: 0;
  text-align: center;
  border: none !important;
  font-size: 16px;
  border-radius: 2px;
}
.x-page .af-button--primary {
  background: #0d9737 !important;
  color: #fff !important;
}

.x-page .is-disabled {
  background: #dcdee5 !important;
  color: #fff !important;
}
.x-page .is-disabled:hover,
.x-page .is-disabled:active {
  background: #dcdee5 !important;
  color: #fff !important;
}
.x-page .x-input-wrapper,
.x-pop-wrapper .x-page .x-input-wrapper {
  width: 100%;
}
.x-page .x-input-wrapper .x-input-text--icon,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-text--icon {
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  text-align: left;
  text-indent: 4px;
  width: 32px;
}
.x-page .x-input-wrapper .x-input-text--icon + .x-input,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-text--icon + .x-input {
  padding-right: 55px;
}
.x-page .x-input-wrapper .x-input-icon,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon {
  text-align: left;
  text-indent: 2px;
}
.x-page .x-input-wrapper .x-input-icon + .x-input,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon + .x-input {
  padding-right: 40px;
}
.x-page .x-input-wrapper .x-input,
.x-pop-wrapper .x-page .x-input-wrapper .x-input {
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  font-size: 14px;
  height: 100%;
  padding-left: 18px;
}
.x-page .x-input-wrapper .x-input-icon:before,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon:before {
  line-height: 16px;
}
.x-page .x-input-wrapper.x-input-wrapper--active .x-input,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--active .x-input {
  border-color: #0d9737;
}
.x-page .x-input-wrapper.x-input-wrapper--active .x-input-prepend,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--active .x-input-prepend {
  border-color: #0d9737;
}

.x-page .x-input-wrapper.x-input-wrapper--error .x-input,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--error .x-input {
  border-color: #e41827 !important;
}
.x-page .x-input-wrapper.x-input-wrapper--error .x-input-prepend,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--error .x-input-prepend {
  border-color: #e41827 !important;
}
.x-page .x-input-wrapper:nth-of-type(2).x-input-wrapper--active .x-input,
.x-pop-wrapper .x-page .x-input-wrapper:nth-of-type(2).x-input-wrapper--active .x-input {
  border-color: #0d9737;
}
.x-page .x-input-wrapper .x-input-icon--clickable:hover,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon--clickable:hover {
  color: #9ca0ab !important;
}
.x-page .x-input-wrapper .x-input-icon--clickable:hover + .x-input,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon--clickable:hover + .x-input {
  border-color: #b4b4b4 !important;
}
.x-page .x-input-group--prepend.x-input-wrapper--error .x-input,
.x-pop-wrapper .x-page .x-input-group--prepend.x-input-wrapper--error .x-input {
  border-left: none !important;
}
.x-page .x-input-group--prepend .x-input-prepend,
.x-pop-wrapper .x-page .x-input-group--prepend .x-input-prepend {
  border-color: #b4b4b4;
  border-radius: 2px 0 0 2px;
  padding-left: 18px;
}
.x-page .x-input-group--prepend .x-input,
.x-pop-wrapper .x-page .x-input-group--prepend .x-input {
  border-left: none !important;
  border-radius: 0 2px 2px 0;
  padding-left: 0;
}
.x-page .x-input-group--prepend.x-input-wrapper--active .x-input-prepend,
.x-pop-wrapper .x-page .x-input-group--prepend.x-input-wrapper--active .x-input-prepend {
  border-color: #0d9737;
}
.x-opt-wrapper,
.x-page-opt {
  position: relative;
}
.x-opt-wrapper .x-error-tips,
.x-page-opt .x-error-tips {
  position: absolute;
  top: 47px;
  font-size: 12px;
  line-height: 14px;
  color: #e41827;
}
.x-page--phone .x-header-bar {
  border-bottom: 1px solid #eaecef;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  font-size: 20px;
  height: 57px;
  line-height: 57px;
  padding: 0 30px;
  width: 100%;
}
.x-page--phone .x-header-bar .x-header-bar-title {
  font-size: 20px;
  line-height: 56px;
  text-align: left;
}
.x-page--phone .x-page-main {
  background: #f8f8f8;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 77px 182px;
  position: relative;
  text-align: left;
}
.x-page--phone .x-text-tips {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  font-size: 20px;
  line-height: 27px;
  padding-bottom: 35px;
}
.x-page--phone .x-page-opt .x-label {
  display: inline-block;
  margin-right: 38px;
  vertical-align: top;
}
.x-page--phone .x-page-opt .x-text-label {
  color: #353a45;
  display: inline-block;
  font-size: 20px;
  line-height: 27px;
  vertical-align: middle;
}
.x-page--phone .x-page-opt .x-opt-wrapper {
  display: inline-block;
  position: relative;
  vertical-align: top;
}
.x-page--phone .x-page-opt .x-input-wrapper,
.x-page--phone .x-page-opt .x-btn-wrap {
  width: 300px;
}
.x-page--phone .x-page-opt .x-input-wrapper {
  font-size: 14px;
  height: 40px;
}
.x-page--phone .x-page-opt .x-input-wrapper .x-input {
  height: 40px !important;
}
.x-page--phone .x-page-opt .x-btn-wrap {
  margin-top: 44px;
}
.x-page--phone .x-error-wrap {
  position: absolute;
  top: 25px;
}
.x-page--phone .x-error-wrap .x-error {
  margin: 0;
  min-width: 475px;
}
.x-page--phone .x-error-wrap .x-icon--info {
  color: #e41827;
}
.x-page--phone .x-error-wrap .x-text-highlight {
  color: #3656a3;
}
.es-dialog.x-dialog.auth {
  margin-left: auto;
}
/* Header Bar */
.x-header-bar {
  height: 110px;
  min-height: 110px;
  position: relative;
}
.x-header-bar .x-icon {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 15px;
  position: absolute;
  top: 16px;
  z-index: 999;
}
.x-header-bar .x-icon-back {
  color: #9ca0ab;
  left: 0;
  text-decoration: none;
}
.x-header-bar .x-icon-back::before {
  content: '\e604';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-header-bar .x-icon-close {
  color: #9ca0ab;
  cursor: pointer;
  right: 0;
}
.x-header-bar .x-icon-close::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-header-bar .x-header-bar-title {
  color: #000;
  font-size: 24px;
  line-height: 33px;
  position: absolute;
  text-align: center;
  top: 50%;
  -webkit-transform: translate3d(0, -50%, 0);
  transform: translate3d(0, -50%, 0);
  width: 100%;
}
.x-header-bar .x-icon-success::before {
  content: '\e60b';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-header-bar .x-icon-success:before {
  border-radius: 50%;
  color: var(--brand-primary);
  display: inline-block;
  font-size: 32px;
  font-weight: bold;
  height: 34px;
  line-height: 34px;
  margin-right: 10px;
  vertical-align: top;
  width: 34px;
}

/* Input */
.x-page .x-input-wrapper,
.x-pop-wrapper .x-page .x-input-wrapper {
  width: 100%;
}
.x-page .x-input-wrapper .x-input-text--icon,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-text--icon {
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  text-align: left;
  text-indent: 4px;
  width: 32px;
}
.x-page .x-input-wrapper .x-input-text--icon + .x-input,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-text--icon + .x-input {
  padding-right: 55px;
}
.x-page .x-input-wrapper .x-input-icon,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon {
  text-align: left;
  text-indent: 2px;
}
.x-page .x-input-wrapper .x-input-icon + .x-input,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon + .x-input {
  padding-right: 40px;
}
.x-page .x-input-wrapper .x-input,
.x-pop-wrapper .x-page .x-input-wrapper .x-input {
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  font-size: 14px;
  height: 100%;
  padding-left: 18px;
}
.x-page .x-input-wrapper .x-input-icon:before,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon:before {
  line-height: 16px;
}
.x-page .x-input-wrapper.x-input-wrapper--active .x-input,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--active .x-input {
  border-color: var(--brand-primary);
}
.x-page .x-input-wrapper.x-input-wrapper--active .x-input-prepend,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--active .x-input-prepend {
  border-color: var(--brand-primary);
}
.x-page .x-input-wrapper.x-input-wrapper--active .x-input-icon--clickable:hover,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--active .x-input-icon--clickable:hover {
  color: var(--brand-primary) !important;
}
.x-page .x-input-wrapper.x-input-wrapper--active .x-input-icon--clickable:hover + .x-input,
.x-pop-wrapper
  .x-page
  .x-input-wrapper.x-input-wrapper--active
  .x-input-icon--clickable:hover
  + .x-input {
  border-color: var(--brand-primary) !important;
}
.x-page .x-input-wrapper.x-input-wrapper--error .x-input,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--error .x-input {
  border-color: #e41827 !important;
}
.x-page .x-input-wrapper.x-input-wrapper--error .x-input-prepend,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--error .x-input-prepend {
  border-color: #e41827 !important;
}
.x-page .x-input-wrapper.x-input-wrapper--error .x-input-icon--clickable:hover,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--error .x-input-icon--clickable:hover {
  color: #e41827 !important;
}
.x-page .x-input-wrapper.x-input-wrapper--error .x-input-icon--clickable:hover + .x-input,
.x-pop-wrapper
  .x-page
  .x-input-wrapper.x-input-wrapper--error
  .x-input-icon--clickable:hover
  + .x-input {
  border-color: #e41827 !important;
}
.x-page .x-input-wrapper:nth-of-type(2).x-input-wrapper--active .x-input,
.x-pop-wrapper .x-page .x-input-wrapper:nth-of-type(2).x-input-wrapper--active .x-input {
  border-color: var(--brand-primary);
}
.x-page .x-input-wrapper .x-input-icon--clickable:hover,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon--clickable:hover {
  color: #9ca0ab !important;
}
.x-page .x-input-wrapper .x-input-icon--clickable:hover + .x-input,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon--clickable:hover + .x-input {
  border-color: #b4b4b4 !important;
}
.x-page .x-input-group--prepend.x-input-wrapper--error .x-input,
.x-pop-wrapper .x-page .x-input-group--prepend.x-input-wrapper--error .x-input {
  border-left: none !important;
}
.x-page .x-input-group--prepend .x-input-prepend,
.x-pop-wrapper .x-page .x-input-group--prepend .x-input-prepend {
  border-color: #b4b4b4;
  border-radius: 2px 0 0 2px;
  padding-left: 18px;
}
.x-page .x-input-group--prepend .x-input,
.x-pop-wrapper .x-page .x-input-group--prepend .x-input {
  border-left: none !important;
  border-radius: 0 2px 2px 0;
  padding-left: 0;
}
.x-page .x-input-group--prepend.x-input-wrapper--active .x-input-prepend,
.x-pop-wrapper .x-page .x-input-group--prepend.x-input-wrapper--active .x-input-prepend {
  border-color: var(--brand-primary);
}
.x-opt-wrapper,
.x-page-opt {
  position: relative;
}
.x-opt-wrapper .x-error-tips,
.x-page-opt .x-error-tips {
  position: absolute;
  top: 47px;
  font-size: 12px;
  line-height: 14px;
  color: #e41827;
}
.x-page--login .mt-100 {
  margin-top: 100px !important;
}
.x-page--login .pswd_tip {
  color: #353a45;
  margin: 24px auto 33px;
  text-align: center;
  width: 400px;
}
.x-page--login .progress-container {
  margin: 0 auto;
  width: 304px;
}
.x-page--login .x-page-opt {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 82px;
  text-align: left;
}
.x-page--login .x-page-opt.without-error {
  padding-top: 36px;
}
.x-page--login .x-page-opt .x-input-wrapper {
  height: 54px;
}
.x-page--login .x-page-opt .x-input-wrapper.x-input-wrapper--active .x-input-prepend,
.x-page--login .x-page-opt .x-input-wrapper.x-input-wrapper--active .x-input {
  border-color: 1px var(--brand-primary);
}
.x-page--login .x-page-opt .x-input-wrapper.x-input-wrapper--error .x-input-prepend,
.x-page--login .x-page-opt .x-input-wrapper.x-input-wrapper--error .x-input {
  border-color: #e41827;
}
.x-page--login .x-page-opt .x-input-wrapper:nth-of-type(1) .x-input {
  border-bottom: none !important;
  border-radius: 0 2px 0 0;
}
.x-page--login .x-page-opt .x-input-wrapper:nth-of-type(1) .x-input-prepend {
  border-bottom: none;
}
.x-page--login
  .x-page-opt
  .x-input-wrapper:nth-of-type(1).x-input-wrapper--active
  + .x-input-wrapper
  .x-input {
  border-top: 1px solid var(--brand-primary);
}
.x-page--login
  .x-page-opt
  .x-input-wrapper:nth-of-type(1).x-input-wrapper--error
  + .x-input-wrapper
  .x-input {
  border-top: 1px solid #e41827;
}
.x-page--login .x-page-opt .x-input-wrapper:nth-of-type(2) .x-input {
  border-radius: 0 0 2px 2px;
}
.x-page--login .x-page-opt .x-input-wrapper .x-input {
  height: 54px !important;
}
.x-page--login .x-page-opt .x-input-group--prepend .x-input-prepend {
  border-radius: 2px 0 0 0;
}
.x-page--login .x-page-opt .x-btn-wrap {
  margin: 20px auto;
  text-align: center;
}
.x-page--login .x-page-opt .x-btn-wrap .af-button {
  font-size: 16px;
}
.x-page--login .x-page-opt .x-btn-wrap-fix {
  margin: 35px auto 15px;
}

.x-page--login .x-error-wrap {
  margin: 0 auto 10px;
  width: calc(462px - 82px - 82px);
}
.x-page--login .x-error-wrap .x-error {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  min-width: 300px;
  padding: 12px 10px;
}
.x-page--login .x-error-wrap .x-icon--error {
  margin-right: 8px;
}
.x-page--login .x-error-wrap .x-text-info {
  font-size: 12px;
  line-height: 18px;
}
.x-page--login .x-popOver-wrapper {
  border: none;
  padding: 10px;
  -webkit-transform: translate3d(18px, -25px, 0);
  transform: translate3d(18px, -25px, 0);
}
.x-page--login .x-popOver-wrapper .x-popOver {
  font-size: 10px;
  line-height: 14px;
}
.x-page--login .x-popOver-wrapper .x-popOver-arrow {
  border: none;
  top: -6px !important;
}
.x-page--login .tips {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  margin: 12px 0 0;
}
.x-page--login .tips .check {
  color: #9ca0ab;
}
.x-page--login .tips .check.active {
  color: var(--brand-primary);
}
.x-page--login .tips .tip {
  color: #9ca0ab;
}
.x-page--login .tips .tip.active {
  color: var(--brand-primary);
}
.x-page--login .tips .left {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.x-page--login .tips .right {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.x-page--login .mobile-warning-info {
  font-weight: bold;
  margin-bottom: -20px;
  padding: 5px;
}

.x-text-second {
  font-size: 13px;
  line-height: 1;
}
.x-page .btn-wrapper,
.x-page .af-button {
  width: 100%;
  height: 38px;
}
.x-page .af-button {
  padding-left: 0;
  padding-right: 0;
  text-align: center;
  border: none !important;
  font-size: 16px;
  border-radius: 2px;
}
.x-page .af-button--primary {
  background: var(--brand-secondary) !important;
  color: #fff !important;
}

.x-page .is-disabled {
  background: #dcdee5 !important;
  color: #fff !important;
}
.x-page .is-disabled:hover,
.x-page .is-disabled:active {
  background: #dcdee5 !important;
  color: #fff !important;
}
.x-page .x-input-wrapper,
.x-pop-wrapper .x-page .x-input-wrapper {
  width: 100%;
}
.x-page .x-input-wrapper .x-input-text--icon,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-text--icon {
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  text-align: left;
  text-indent: 4px;
  width: 32px;
}
.x-page .x-input-wrapper .x-input-text--icon + .x-input,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-text--icon + .x-input {
  padding-right: 55px;
}
.x-page .x-input-wrapper .x-input-icon,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon {
  text-align: left;
  text-indent: 2px;
}
.x-page .x-input-wrapper .x-input-icon + .x-input,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon + .x-input {
  padding-right: 40px;
}
.x-page .x-input-wrapper .x-input,
.x-pop-wrapper .x-page .x-input-wrapper .x-input {
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  font-size: 14px;
  height: 100%;
  padding-left: 18px;
}
.x-page .x-input-wrapper .x-input-icon:before,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon:before {
  line-height: 16px;
}

.x-page .x-input-wrapper.x-input-wrapper--active .x-input-icon--clickable:hover,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--active .x-input-icon--clickable:hover {
  color: var(--brand-primary) !important;
}
.x-page .x-input-wrapper.x-input-wrapper--active .x-input-icon--clickable:hover + .x-input,
.x-pop-wrapper
  .x-page
  .x-input-wrapper.x-input-wrapper--active
  .x-input-icon--clickable:hover
  + .x-input {
  border-color: var(--brand-primary) !important;
}
.x-page .x-input-wrapper.x-input-wrapper--error .x-input,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--error .x-input {
  border-color: #e41827 !important;
}
.x-page .x-input-wrapper.x-input-wrapper--error .x-input-prepend,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--error .x-input-prepend {
  border-color: #e41827 !important;
}
.x-page .x-input-wrapper.x-input-wrapper--error .x-input-icon--clickable:hover,
.x-pop-wrapper .x-page .x-input-wrapper.x-input-wrapper--error .x-input-icon--clickable:hover {
  color: #e41827 !important;
}
.x-page .x-input-wrapper.x-input-wrapper--error .x-input-icon--clickable:hover + .x-input,
.x-pop-wrapper
  .x-page
  .x-input-wrapper.x-input-wrapper--error
  .x-input-icon--clickable:hover
  + .x-input {
  border-color: #e41827 !important;
}
.x-page .x-input-wrapper:nth-of-type(2).x-input-wrapper--active .x-input,
.x-pop-wrapper .x-page .x-input-wrapper:nth-of-type(2).x-input-wrapper--active .x-input {
  border-color: var(--brand-primary);
}
.x-page .x-input-wrapper .x-input-icon--clickable:hover,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon--clickable:hover {
  color: #9ca0ab !important;
}
.x-page .x-input-wrapper .x-input-icon--clickable:hover + .x-input,
.x-pop-wrapper .x-page .x-input-wrapper .x-input-icon--clickable:hover + .x-input {
  border-color: #b4b4b4 !important;
}
.x-page .x-input-group--prepend.x-input-wrapper--error .x-input,
.x-pop-wrapper .x-page .x-input-group--prepend.x-input-wrapper--error .x-input {
  border-left: none !important;
}
.x-page .x-input-group--prepend .x-input-prepend,
.x-pop-wrapper .x-page .x-input-group--prepend .x-input-prepend {
  border-color: #b4b4b4;
  border-radius: 2px 0 0 2px;
  padding-left: 18px;
}
.x-page .x-input-group--prepend .x-input,
.x-pop-wrapper .x-page .x-input-group--prepend .x-input {
  border-left: none !important;
  border-radius: 0 2px 2px 0;
  padding-left: 0;
}
.x-page .x-input-group--prepend.x-input-wrapper--active .x-input-prepend,
.x-pop-wrapper .x-page .x-input-group--prepend.x-input-wrapper--active .x-input-prepend {
  border-color: var(--brand-primary);
}
.x-opt-wrapper,
.x-page-opt {
  position: relative;
}
.x-opt-wrapper .x-error-tips,
.x-page-opt .x-error-tips {
  position: absolute;
  top: 47px;
  font-size: 12px;
  line-height: 14px;
  color: #e41827;
}
.x-page--success .x-header-bar {
  height: 97px;
}
.x-page--success .x-page-main {
  height: 242px;
}
.x-page--success .x-page-main .x-desc-wrapper {
  margin-top: 35px;
  text-align: center;
  color: #353a45;
}
.x-page--success .x-page-main .x-t-big {
  font-size: 20px;
  line-height: 21px;
  font-weight: bold;
}
.x-page--success .x-page-main .x-t-min {
  font-size: 16px;
  line-height: 21px;
}
.x-page--success .x-page-main .x-btn-wrapper {
  margin-top: 25px;
  text-align: center;
}
.x-page--success .x-page-main .x-btn-wrapper .af-button {
  width: 300px;
  font-weight: bold;
}
.x-page--success .x-icon-success {
  line-height: 33px;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  color: #353a45;
}
.x-page--success .x-icon-success::before {
  content: '\e60b';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-page--success .x-icon-success:before {
  display: inline-block;
  color: var(--brand-primary);
  font-size: 34px;
  margin-right: 16px;
  font-size: 32px;
  line-height: 34px;
  font-weight: bold;
  border-radius: 50%;
  vertical-align: top;
}
.x-page--success .x-page-footer {
  height: 102px;
  border-top: 1px solid #eaecef;
  padding-top: 24px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-page--success .x-page-opt {
  font-size: 0;
  text-align: center;
}
.x-page--success .x-page-opt > * {
  display: inline-block;
  vertical-align: top;
}
.x-page--success .x-page-opt .x-text-tips {
  font-size: 14px;
  margin-right: 10px;
  color: #353a45;
  line-height: 30px;
}
.x-page--success .x-page-opt .x-code {
  font-size: 20px;
  line-height: 30px;
  color: #353a45;
  text-align: center;
  padding-right: 25px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-page--success .x-page-opt .x-border {
  border-right: 1px solid #eaecef;
}
.x-page--success .x-page-opt .x-border + .x-opt-wrapper {
  padding-left: 25px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 30px;
}
.x-page--success .x-page-opt .x-opt-wrapper {
  font-size: 0;
}
.x-page--success .x-page-opt .x-opt-wrapper:nth-of-type(1) {
  position: relative;
  padding-right: 25px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-page--success .x-page-opt .x-opt-wrapper:only-of-type {
  padding-right: none;
}
.x-page--success .x-page-opt .x-opt-wrapper.referral-code-input-container {
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}
.x-page--success .x-page-opt .x-opt-wrapper.referral-code-input-container .x-icon-delete {
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
}
.x-page--success .x-page-opt .x-opt-wrapper.referral-code-input-container .af-button {
  margin-left: 0.33333333rem;
}
.x-page--success .x-page-opt .x-input-wrapper,
.x-page--success .x-page-opt .af-button {
  display: inline-block;
  vertical-align: middle;
}
.x-page--success .x-page-opt .x-input-wrapper {
  width: 210px !important;
  height: 30px;
  margin-right: 10px;
  background: #fff;
}
.x-page--success .x-page-opt .x-input-wrapper .x-input {
  height: 30px !important;
  font-size: 12px;
}
.x-page--success .x-page-opt .af-button--info {
  height: 30px;
  width: 66px;
  font-size: 12px !important;
  line-height: 30px;
  padding: 0;
}
.x-page--success .x-page-opt .af-button--text {
  color: #26448a;
  text-align: right;
  font-size: 13px !important;
  height: 30px;
  padding: 0 !important;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-page--success .x-page-opt .x-icon-arrow-right::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-page--success .x-page-opt .x-icon-arrow-right:before {
  display: inline-block;
  vertical-align: middle;
  color: #26448a;
  margin-left: 5px;
  font-size: 12px;
}
.x-page--success .x-page-opt .x-error-tips {
  top: 34px !important;
}
.x-page--success .x-page-opt .af-icon-loading {
  vertical-align: middle !important;
}
.x-page--success .x-image-wrapper {
  margin: 0 auto;
  width: 680px;
  height: 84px;
}
.x-page--success .x-image-wrapper > img {
  height: 100%;
  width: 100%;
}
.x-page--success .x-promotion {
  cursor: pointer;
}

.x-pin-code-wrapper {
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-flex-wrap: nowrap;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
}
.x-pin-code-wrapper .x-pin-code-input {
  background-color: #fafafa;
  border: solid 1px #9ca0ab;
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 20px;
  outline: none;
  text-align: center;
  border-color: #9ca0ab;
  color: #1b1e25;
  width: 43px;
  height: 47px;
}
.x-pin-code-wrapper .x-pin-code-input.mask {
  -webkit-text-security: disc;
}
.x-pin-code-wrapper .x-pin-code-input.mask.text-security {
  font-family: text-security-disc;
}
@font-face {
  font-family: text-security-disc;
  src: url(//s.sporty.net/global/main/common/iconfont/text-security-disc.4fa38d775a.woff);
}
.x-pin-code-wrapper .x-pin-code-input:not(:last-child) {
  margin-right: 10px;
}
.x-pin-code-wrapper .x-pin-code-input:focus {
  border: solid 1px var(--brand-primary);
  border-color: var(--brand-primary);
  border-color: var(--brand-secondary);
}
.x-pin-code-wrapper .x-pin-code-input.error {
  border: solid 1px #e41827;
  border-color: #e41827;
  border-color: var(--warning-primary);
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
