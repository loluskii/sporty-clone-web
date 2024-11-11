<template>
  <DefaultLayout>
    <div>
      <p class="x-page-title">
        <span
          class="x-icon-lock"
          data-cms-key="forgot_password"
          data-cms-page="common_functions"
          >Forgot Password</span
        >
      </p>
      <div class="x-page x-page--phone">
        <template v-if="activeStep === 0">
          <header class="x-header-bar">
            <span class="x-header-bar-title">Find Account</span>
          </header>
          <section class="x-page-main">
            <p class="x-text-tips">
              To reset your password, please confirm your account first.
            </p>
            <div class="x-page-opt">
              <div class="x-label">
                <span class="x-text-label">Mobile Number</span>
              </div>
              <div class="x-opt-wrapper">
                <div
                  tabindex="6"
                  class="x-input-wrapper x-input-group x-input-group--prepend"
                >
                  <div class="x-input-prepend"><span>+234</span></div>
                  <span class="x-input-com"
                    ><i
                      class="x-input-icon x-input-icon--clickable x-input-icon--show x-icon-delete"
                    ></i>
                    <input
                      type="input"
                      input-mode=""
                      name=""
                      placeholder="Enter Mobile Number"
                      onpaste="return true"
                      data-op=""
                      class="x-input fs-exclude"
                      v-model="phoneNumber"
                      :class="{ 'x-input-error': phoneNumberError }"
                  /></span>
                </div>

                <div class="x-btn-wrap">
                  <button
                    @click.prevent="beginPasswordReset"
                    class="af-button af-button--primary"
                    type="primary"
                    :disabled="isLoading"
                    :class="{ 'is-disabled': isLoading }"
                  >
                    <span><span>Next</span></span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </template>
        <template v-else>
          <StepHeader :active-step="activeStep"></StepHeader>
          <StepOne
            v-if="activeStep === 1"
            :phone-number="phoneNumber"
            @go-back="returnToPreviousStep"
            @next-step="nextStep"
          ></StepOne>
          <StepTwo v-if="activeStep === 2" :phone-number="phoneNumber"></StepTwo>
          <StepThree v-if="activeStep === 3"></StepThree>
        </template>
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
import { ref } from "vue";
import { verifyUsername, CLIENT_ID, formattedPhoneNumber } from "@/helpers";

const activeStep = ref(0);
const phoneNumber = ref("");
const isLoading = ref(false);
const phoneNumberError = ref(false);

const beginPasswordReset = async () => {
  isLoading.value = true;
  const phone = formattedPhoneNumber(phoneNumber.value);

  try {
    const res = await verifyUsername({ username: phone, clientId: CLIENT_ID });
    isLoading.value = false;
    if (res.responseMessage === "SUCCESSFUL") {
      activeStep.value = activeStep.value + 1;
    } else {
      alert("Account with this phone number does not exist!");
    }
  } catch (err) {
    isLoading.value = false;
  }
};

function nextStep() {
  activeStep.value = activeStep.value + 1;
}

function returnToPreviousStep() {
  activeStep.value = activeStep.value - 1;
}
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
  width: 880px;
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
  width: 880px;
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
</style>
