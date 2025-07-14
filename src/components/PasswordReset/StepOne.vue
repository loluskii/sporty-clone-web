<template>
  <div id="otp-unify" style="position: relative">
    <div class="otp-wrapper">
      <div class="relative text-center bg-white pd-ver-40">
        <div
          @click="$emit('go-back')"
          class="icon-back absolute icon-darkGray pointer"
          style="left: 20px; top: 20px"
        ></div>
        <div class="size-24">
          <span data-cms-key="verify_mobile_number">Verify Mobile Number</span>
        </div>
      </div>
      <div class="bg-wrapper">
        <div class="flex-column size-14 text-center pd-t-40 pd-b-24 justify-between">
          <span
            ><p class="mg-b-16 size-18 pd-hor-100">
              <span data-cms-key="we_have_sent_you_a_vnum_digit_code_to_vcountrycode_vphone"
                >We’ve sent you a 6-digit code to +234 {{ phoneNumber }}</span
              >
            </p></span
          >
          <div>
            <div class="x-pin-code-wrapper mg-b-16 size-20">
              <form>
                <v-otp-input
                  ref="otpInput"
                  input-classes="x-pin-code-input fs-exclude"
                  separator="  "
                  :num-inputs="6"
                  :should-auto-focus="true"
                  input-type="number"
                  @on-complete="storeOTP"
                />
              </form>
            </div>
            <div>
              <span
                class="green"
                @click="resendOtp"
                :disabled="isDisabled"
                :style="{ cursor: isDisabled ? 'not-allowed' : 'pointer' }"
              >
                {{ isDisabled ? `Send Again in ${remainingTime}s` : 'Send Again' }}
              </span>
              <div class="darkGray mg-t-16">
                Please disable Do Not Disturb to receive your code.
              </div>
            </div>
          </div>
          <div class="otp-switch-wrapper" style="margin-top: 16px; position: relative">
            <div class="split"></div>
            <div class="tip"></div>
          </div>
        </div>
      </div>
    </div>
    <!---->
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore, useUtilsStore } from '@/stores'
import { sendOTP, verifyOTP } from '@/helpers'
import LoadingSpinner from '../Loaders/LoadingSpinner.vue'

const emit = defineEmits(['go-back', 'next-step'])
const props = defineProps(['phoneNumber'])

const authStore = useAuthStore()
const registerError = ref(false)
const registerErrorMessage = ref('')
const remainingTime = ref(60)
const isDisabled = ref(false)
const utilsStore = useUtilsStore()
let timer

const sendVerificationCode = async () => {
  authStore.loading = true
  let payload = {
    clientID: import.meta.env.VITE_CLIENT_ID,
    phoneNumber: `${utilsStore.SportsbookGlobalVariable.DialCode}${formattedPhoneNumber(props.phoneNumber)}`
  }

  const res = await sendOTP(payload)
  authStore.loading = false
  if (res.status) {
    // activeStep.value = 2
    startTimer()
  } else {
    registerError.value = true
    registerErrorMessage.value = res.message
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
    let phone = props.phoneNumber.replace(/^0/, '')
    const internationalNumber = `${utilsStore.SportsbookGlobalVariable.DialCode}${phone}`
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
  const internationalNumber = `${utilsStore.SportsbookGlobalVariable.DialCode}${formattedPhoneNumber(props.phoneNumber)}`
  let payload = {
    clientID: import.meta.env.VITE_CLIENT_ID,
    phoneNumber: internationalNumber,
    code: data
  }

  const res = await verifyOTP(payload)
  if (res.data.status) {
    emit('next-step')
  } else {
    authStore.loading = false
    authStore.authError = res.data.message
  }
}

const formattedPhoneNumber = (phoneNumber) => {
  const pNumber = phoneNumber.toString()
  const first = pNumber.charAt(0)
  return first === '0' ? pNumber.substring(1) : pNumber
}

onMounted(async () => {
  authStore.authError = null
  authStore.loading = false
  await sendVerificationCode()
})
</script>

<style>
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
</style>
