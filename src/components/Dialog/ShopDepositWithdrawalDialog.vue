<template>
  <div class="es-dialog x-dialog withdraw">
    <div class="es-dialog-body x-dialog-body">
      <div class="es-dialog-main x-dialog-main" style="height: auto">
        <div class="x-wd-pop x-pop--confirm">
          <h3 class="f-title">
            <span data-cms-key="confirm_to_withdraw" data-cms-page="page_withdraw">{{
              data.message
            }}</span>
            <i @click="emitter.emit('hideDialog')" class="x-icon-close"></i>
          </h3>
          <p style="font-size: 14px">Take this code to any of our shops to complete the process</p>
          <section>
            <div class="f-line">
              <div class="i-label">
                <span>Amount</span>
              </div>
              <div class="i-value">{{ formatNumber(parseFloat(data.amount).toFixed()) }}</div>
            </div>

            <div class="f-line">
              <div class="i-label">Code</div>
              <div class="i-value fs-exclude">
                {{ data.transactionCode }} <img @click="copyBookingCode" src="/copy.svg" />
              </div>
            </div>
            <div class="f-line f-line--opt">
              <button class="af-button af-button--primary" @click="emitter.emit('hideDialog')">
                <span>Continue</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import emitter from '@/plugins/emitter'
import { formatNumber } from '@/helpers'

const props = defineProps({
  data: Object
})

function copyBookingCode() {
  const textToCopy = props.data.transactionCode
  try {
    navigator.clipboard.writeText(textToCopy)
    alert('Copied!')
  } catch (err) {
    console.error('Unable to copy to clipboard', err)
  }
}

onMounted(() => {})
</script>
<style scoped>
/* .es-dialog.x-dialog.withdraw {
  margin-left: calc(497px - 50%) !important;
  margin-top: calc(300px - 50%) !important;
} */
.es-dialog .es-dialog-head {
  height: 37px;
  padding: 8px 15px 0;
}
.es-dialog .es-dialog-head h1 {
  display: block;
  line-height: 37px;
  text-align: left;
  margin: 0;
  font-size: 14px;
  color: #353a45;
  font-weight: 700;
}
.es-dialog .es-dialog-head .es-dialog-close {
  font-family: 'Microsoft YaHei', arial, simsun, SimHei;
  position: absolute;
  font-size: 20px;
  font-weight: normal;
  top: 1px;
  right: 12px;
  color: #999;
  background: none;
}
.es-dialog .es-dialog-head .es-dialog-close em {
  font-style: normal;
  cursor: default;
  font-size: 1.06666667rem;
  color: #353a45;
  font-family: 'dialog-font';
}
.es-dialog .es-dialog-body {
  min-height: 50px;
  background: #fff;
  padding: 0;
  margin: 0;
}
.es-dialog .es-dialog-body .es-dialog-main {
  background: #fff;
  min-height: 50px;
  _height: 50px;
  padding: 15px;
  overflow: auto;
  color: #353a45;
}
.es-dialog .es-dialog-footer {
  padding: 8px 5px;
  text-align: right;
}
.es-dialog .es-dialog-footer .es-dialog-btn {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  min-width: 85px;
  font:
    12px 16px/2 'Microsoft YaHei',
    arial,
    simsun,
    SimHei;
  border-radius: 2px;
  border-width: 0px;
  background: var(--brand-primary);
  color: #fff;
}
.es-dialog .es-dialog-footer .es-dialog-focus-btn {
  background: var(--brand-primary);
  color: #fff;
  border-width: 0px;
}
.x-wd-pop {
  color: #353a45;
  text-align: center;
  width: 482px;
}
.x-wd-pop .f-title {
  line-height: 24px;
  font-size: 20px;
  font-weight: bold;
  padding-top: 9px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
}
.x-wd-pop .f-title > span {
  display: inline-block;
  padding: 0 24px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-wd-pop .f-title .x-icon-close {
  position: absolute;
  right: 13px;
  top: 0;
}
.x-wd-pop .f-title .x-icon-close::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-wd-pop .f-title .x-icon-close:hover {
  cursor: pointer;
}
.x-wd-pop .f-tips {
  margin-top: 24px;
  line-height: 16px;
  font-size: 14px;
}
.x-wd-pop .f-line .af-button {
  padding-left: 0;
  padding-right: 0;
  text-align: center;
  border: none !important;
  font-size: 16px;
  border-radius: 2px;
  height: 38px;
  width: 200px;
  font-size: 14px;
}
.x-wd-pop .f-line .af-button--primary {
  background: var(--brand-secondary) !important;
  color: #fff !important;
}
.x-wd-pop .f-line .af-button--text {
  color: var(--brand-primary);
  border: 1px solid var(--brand-secondary) !important;
  font-weight: 600;
  margin-right: 8px;
}

.x-wd-pop .f-line .is-disabled {
  cursor: pointer;
  background: #dcdee5 !important;
  color: #fff !important;
}
.x-wd-pop .f-line .is-disabled:hover,
.x-wd-pop .f-line .is-disabled:active {
  background: #dcdee5 !important;
  color: #fff !important;
}
.x-wd-pop .f-line .x-input-wrapper {
  width: 100%;
}
.x-wd-pop .f-line .x-input-wrapper .x-input-text--icon {
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  text-align: left;
  text-indent: 4px;
  width: 32px;
}
.x-wd-pop .f-line .x-input-wrapper .x-input-text--icon + .x-input {
  padding-right: 55px;
}
.x-wd-pop .f-line .x-input-wrapper .x-input-icon {
  text-align: left;
  text-indent: 2px;
}
.x-wd-pop .f-line .x-input-wrapper .x-input-icon + .x-input {
  padding-right: 40px;
}
.x-wd-pop .f-line .x-input-wrapper .x-input {
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  font-size: 14px;
  height: 100%;
  padding-left: 18px;
}
.x-wd-pop
  .f-line
  .x-input-wrapper.x-input-wrapper--active
  .x-input-icon--clickable:hover
  + .x-input {
  border-color: var(--brand-primary) !important;
}
.x-wd-pop .f-line .x-input-wrapper.x-input-wrapper--error .x-input {
  border-color: #e41827 !important;
}
.x-wd-pop .f-line .x-input-wrapper.x-input-wrapper--error .x-input-prepend {
  border-color: #e41827 !important;
}
.x-wd-pop .f-line .x-input-wrapper.x-input-wrapper--error .x-input-icon--clickable:hover {
  color: #e41827 !important;
}
.x-wd-pop .f-line .x-input-group--prepend .x-input {
  border-left: none !important;
  border-radius: 0 2px 2px 0;
  padding-left: 0;
}
.x-wd-pop .f-line .x-input-group--prepend.x-input-wrapper--active .x-input-prepend {
  border-color: var(--brand-primary);
}
.x-wd-pop .f-line .x-input-wrapper {
  width: 200px;
  height: 38px;
}
.x-wd-pop .f-line .x-input-wrapper .x-input {
  width: 100%;
  height: 100%;
}
.x-wd-pop .f-line--pos {
  position: relative;
}
.x-wd-pop .f-error {
  position: absolute;
  top: 42px;
}
.x-wd-pop .f-error p {
  color: #e41827;
  font-size: 12px;
}
.x-pop--sms {
  padding-bottom: 25px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-pop--sms .f-tips {
  margin-top: 36px;
}
.x-pop--sms .f-sms {
  padding: 16px 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 20px;
  line-height: 24px;
  font-weight: bold;
}
.x-pop--sms .x-icon-check {
  font-size: 14px;
  line-height: 16px;
}
.x-pop--sms .x-icon-check::before {
  content: '\e614';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-pop--sms .x-icon-check:before {
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
  font-size: 15px;
}
.x-pop--sms .x-icon-checked::before {
  content: '\e658';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-pop--sms .f-line--opt {
  margin-top: 30px;
}
.x-pop--sms .f-error {
  width: 100%;
  top: 20px;
}

.x-wd-pop .f-line .af-button--text {
  color: var(--brand-primary);
  border: 1px solid var(--brand-primary) !important;
  font-weight: 600;
  margin-right: 8px;
}
.x-wd-pop .f-line .is-disabled {
  cursor: pointer;
  background: #dcdee5 !important;
  color: #fff !important;
}
.x-wd-pop .f-line .is-disabled:hover,
.x-wd-pop .f-line .is-disabled:active {
  background: #dcdee5 !important;
  color: #fff !important;
}
.x-wd-pop .f-line .x-input-wrapper {
  width: 100%;
}
.x-wd-pop .f-line .x-input-wrapper .x-input-text--icon {
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  text-align: left;
  text-indent: 4px;
  width: 32px;
}
.x-wd-pop .f-line .x-input-wrapper .x-input-text--icon + .x-input {
  padding-right: 55px;
}
.x-wd-pop .f-line .x-input-wrapper .x-input-icon {
  text-align: left;
  text-indent: 2px;
}
.x-wd-pop .f-line .x-input-wrapper .x-input-icon + .x-input {
  padding-right: 40px;
}
.x-wd-pop .f-line .x-input-wrapper .x-input {
  border: 1px solid #b4b4b4;
  border-radius: 2px;
  font-size: 14px;
  height: 100%;
  padding-left: 18px;
}
.x-wd-pop .f-line .x-input-wrapper .x-input-icon:before {
  line-height: 16px;
}
.x-wd-pop .f-line .x-input-wrapper.x-input-wrapper--active .x-input {
  border-color: var(--brand-primary);
}
.x-wd-pop .f-line .x-input-wrapper.x-input-wrapper--active .x-input-prepend {
  border-color: var(--brand-primary);
}
.x-wd-pop .f-line .x-input-wrapper.x-input-wrapper--active .x-input-icon--clickable:hover {
  color: var(--brand-primary) !important;
}

.x-wd-pop
  .f-line
  .x-input-wrapper.x-input-wrapper--error
  .x-input-icon--clickable:hover
  + .x-input {
  border-color: #e41827 !important;
}
.x-wd-pop .f-line .x-input-wrapper:nth-of-type(2).x-input-wrapper--active .x-input {
  border-color: var(--brand-primary);
}
.x-wd-pop .f-line .x-input-wrapper .x-input-icon--clickable:hover {
  color: #9ca0ab !important;
}
.x-wd-pop .f-line .x-input-wrapper .x-input-icon--clickable:hover + .x-input {
  border-color: #b4b4b4 !important;
}
.x-wd-pop .f-line .x-input-group--prepend.x-input-wrapper--error .x-input {
  border-left: none !important;
}
.x-wd-pop .f-line .x-input-group--prepend .x-input-prepend {
  border-color: #b4b4b4;
  border-radius: 2px 0 0 2px;
  padding-left: 18px;
}
.x-pop--confirm section {
  padding: 30px 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-pop--confirm .f-line {
  margin-bottom: 10px;
}
.x-pop--confirm .f-line--opt {
  margin: 20px auto 0;
}
.x-pop--confirm .i-label,
.x-pop--confirm .i-value {
  display: inline-block;
  vertical-align: top;
  font-size: 14px;
  line-height: 19px;
}
.x-pop--confirm .i-label {
  text-align: right;
  width: 234px;
  padding-right: 20px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-pop--confirm .i-value {
  text-align: left;
  width: 243px;
  font-weight: bold;
}
</style>
