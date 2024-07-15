<template>
  <div class="es-dialog-wrap" id="esDialog0" style="visibility: visible">
    <div class="layout mask" @click="emitter.emit('hideDialog')"></div>

    <AuthDialog v-if="dialogType == 'auth'" :auth-type="dialogData"></AuthDialog>
    <WithdrawalDialog v-if="dialogType == 'withdrawal'" :data="dialogData"></WithdrawalDialog>
    <ErrorDialog v-if="dialogType == 'error'" :data="dialogData"></ErrorDialog>
    <PlaceBetDialog v-if="dialogType == 'place-bet'" :response="dialogData.data"></PlaceBetDialog>
  </div>
</template>

<script setup>
import AuthDialog from '../Dialog/AuthDialog.vue'
import WithdrawalDialog from '../Dialog/WithdrawalDialog.vue'
import ErrorDialog from '../Dialog/ErrorDialog.vue'
import PlaceBetDialog from '../Dialog/PlaceBetDialog.vue'
import emitter from '@/plugins/emitter'

defineProps({
  dialogType: String,
  dialogData: Object
})
</script>

<style>
.es-dialog-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

.layout {
  z-index: -1; /* Ensure the layout mask is behind the dialog */
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #000;
  opacity: 0.4;
}
.x-pop-wrapper {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 441px;
  left: 50%;
  overflow: hidden;
  padding-left: 60px;
  position: absolute;
  top: 50%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  width: 850px;
}
.x-pop-wrapper.height-600 {
  height: 600px;
}
.x-pop-wrapper .x-pop-bg {
  background: transparent
    url(//s.sporty.net/global/main/modules/main/desktop/common/components/login/image/popupBall2.0aaeb1c629.png)
    no-repeat;
  height: 157px;
  left: 0;
  position: absolute;
  top: 87px;
  width: 164px;
  z-index: 2;
}
.x-pop-wrapper .x-pop-mian {
  height: 100%;
  position: relative;
  width: 790px;
}
.x-pop-wrapper .x-pop-dialog {
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
.x-pop-dialog {
  height: 100%;
  width: 100%;
}
.x-pop-dialog .x-list__item {
  background: #fff
    url(//s.sporty.net/global/main/modules/main/desktop/common/components/login/image/popupBg2-big.d8f52cc4da.png)
    no-repeat;
}
.x-pop-dialog .x-pop-dialog__wrapper .x-page {
  height: 100%;
  width: 100%;
}
.x-pop-dialog .x-pop-dialog__wrapper .x-page-main {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-bottom: 44px;
  padding-top: 48px;
}
.x-pop-dialog .x-pop-dialog__wrapper .x-text-tips {
  color: #000;
  font-size: 18px;
  line-height: 33px;
  text-align: center;
}
.x-pop-dialog .x-pop-dialog__wrapper .x-page-opt .af-button {
  font-size: 16px;
}
.x-pop-dialog .x-pop-dialog__wrapper .x-page-opt .x-input {
  background: transparent;
  font-size: 14px;
}
.x-pop-dialog .x-pop-dialog__wrapper .x-popOver-wrapper {
  border: none;
}
.x-pop-dialog .x-pop-dialog__wrapper .x-popOver-wrapper .x-popOver-arrow {
  border: none;
  top: -6px !important;
}
.x-pop-dialog__wrapper .x-page--login {
  padding: 0;
}
.x-pop-dialog__wrapper .x-page--login .x-page-main {
  padding: 0 44px !important;
  position: relative;
  top: -110px;
}
.x-pop-dialog__wrapper .x-page--login .x-tab-wrapper {
  height: 110px;
  position: relative;
  z-index: 999;
}
.x-pop-dialog__wrapper .x-page--login .x-page-nav {
  border-bottom: none;
  margin: 0 auto;
  -webkit-transform: translate3d(0, 33px, 0);
  transform: translate3d(0, 33px, 0);
  width: 300px;
}
.x-pop-dialog__wrapper .x-page--login .x-page-nav .x-tabs-nav .x-tabs-tab {
  color: #000;
  font-size: 24px;
  height: 38px;
  line-height: 38px;
  padding: 0 !important;
}
.x-pop-dialog__wrapper .x-page--login .x-page-nav .x-tabs-nav .x-tabs-tab-active {
  color: var(--brand-secondary);
}
.x-pop-dialog__wrapper .x-page--login .x-page-nav .x-tabs-nav .x-tabs-ink-bar {
  height: 3px;
}
.x-pop-dialog__wrapper .x-page--login .x-page-opt {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0;
  width: 310px;
}
.x-pop-dialog__wrapper .x-page--login .x-page-opt.without-error {
  padding-top: 36px;
}
.x-pop-dialog__wrapper .x-page--login .x-page-opt .x-input-wrapper {
  background: transparent;
  padding: 0;
}
.x-pop-dialog__wrapper .x-page--login .x-page-opt .x-input-wrapper .x-input-prepend,
.x-pop-dialog__wrapper .x-page--login .x-page-opt .x-input-wrapper .x-input {
  background: #fff;
}
.x-pop-dialog__wrapper .x-page--login .x-page-opt .x-input-wrapper .x-input-prepend {
  border-radius: 2px 0 0 0;
}
.x-pop-dialog__wrapper .x-page--login .x-info-wrapper {
  margin: 0 auto;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  text-align: left;
  width: 400px;
}
.x-pop-dialog__wrapper .x-page--login .x-info-wrapper .x-log-third {
  display: block;
  margin: 0 auto;
  width: 300px;
}
.x-pop-dialog__wrapper .x-page--login .x-info-wrapper .x-text-tips {
  text-align: left;
}
.x-pop-dialog__wrapper .x-page--code,
.x-pop-dialog__wrapper .x-page--sms {
  padding: 0;
}
.x-pop-dialog__wrapper .x-page--success {
  padding: 0;
}
.x-pop-dialog__wrapper .x-page--success .x-page-main {
  padding-top: 0;
}
.x-pop-dialog__wrapper .x-item-suc {
  background: #fff
    url(//s.sporty.net/global/main/modules/main/desktop/common/components/login/image/popSuc.7d70e85ff0.jpg)
    no-repeat;
}
/* .es-dialog.x-dialog {
  z-index: 1001;
  position: fixed;
  width: auto;
  left: 50%;
  top: 50%;
  margin-top: -41px;
  margin-left: -16px;
} */
</style>
