<template>
  <div class="es-dialog x-dialog place-bet">
    <div class="es-dialog-body x-dialog-body">
      <div class="es-dialog-body m-dialog-body">
        <div class="es-dialog-main m-dialog-main" style="height: auto">
          <div class="m-dialog-wrapper m-dialog-suc">
            <div class="m-pop-header m-pop-header-fix">
              <span data-cms-key="submission_successful" data-cms-page="common_feedback"
                >Submission Successful</span
              >
              <i data-action="close" data-ret="close" class="m-icon-close"></i>
            </div>
            <div class="m-pop-main">
              <ul class="m-order">
                <li class="m-order-info">
                  <div class="m-label" data-cms-key="total_stake">Total Stake</div>
                  <div class="m-value">{{ response.stake }}</div>
                </li>
                <li class="m-order-info">
                  <div class="m-label" data-cms-key="potential_win">Potential Win</div>
                  <div class="m-value">{{ response.possibleWin.toFixed(2) }}</div>
                </li>
                <li class="m-order-info share-code">
                  <div class="m-label" style="position: relative">
                    <span data-cms-key="booking_code">Booking Code</span>
                    <em></em>
                    <div
                      class="m-popOver-wrapper m-popOver-wrapper--bottom"
                      style="display: none; min-width: 320px"
                    >
                      <div class="m-popOver">
                        <p data-cms-key="input_this_code_in_betslip_to_restore_selections">
                          Input this code in betslip to restore selections.
                        </p>
                      </div>
                      <i class="m-popOver-arrow m-popOver-arrow--bottom"></i>
                    </div>
                  </div>
                  <div class="m-value">
                    <img
                      src="//s.sporty.net/global/main/modules/main/desktop/common/components/betslips/image/ic-share.35f43c7b64.svg"
                    />
                    <img
                      src="//s.sporty.net/global/main/modules/main/desktop/common/components/betslips/image/ic-content-copy.8a86da1097.svg"
                    />
                    <div class="booking-code">{{ response.betslipId }}</div>
                  </div>
                </li>
              </ul>

              <div class="m-btn-wrapper m-ok-wrap">
                <button class="af-button af-button--primary" @click="emitter.emit('clearBetslip')">
                  <span><span>OK</span></span>
                </button>
              </div>
              <!-- <div classs="m-btn-wrapper m-share-wrap">
                <button
                  class="af-button rebet af-button--primary"
                  @click="emitter.emit('hideDialog')"
                >
                  <span><span>Rebet</span></span>
                </button>
              </div> -->
              <div class="m-btn-text">
                <a @click.prevent="$router.push({ name: 'account-bethistory' })"
                  ><span>Check Bet History</span> <i class="m-icon-more"></i
                ></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import emitter from '@/plugins/emitter'

defineProps({
  response: Object
})
</script>

<style>
.es-dialog.x-dialog.place-bet {
  margin-left: auto;
}
.m-dialog-wrapper {
  background: #ffffff;
  left: 50%;
  position: absolute;
  top: 50%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  width: 315px;
}
.m-dialog-wrapper .invisiable-item {
  left: 300vw;
  position: fixed;
}
.m-dialog-wrapper .m-holding-icon {
  -webkit-animation: loading-rotate 1.2s linear infinite;
  animation: loading-rotate 1.2s linear infinite;
  display: inline-block;
  left: calc(50% - 15px);
  position: absolute;
  top: 170px;
}
.m-dialog-wrapper .m-holding-icon::before {
  content: '\e654';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-dialog-wrapper .m-holding-icon:before {
  color: #262262;
  font-size: 30px;
  line-height: 1;
  vertical-align: top;
}
.m-dialog-wrapper .m-pop-header {
  position: relative;
}
.m-dialog-wrapper .m-pop-header > span {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  font-size: 16px;
  line-height: 22px;
  max-width: calc(100% - 24px);
  padding: 15px 13px;
}
.m-dialog-wrapper .m-pop-header .close-icon {
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 20px;
}
.m-dialog-wrapper .m-pop-header .m-icon-close {
  cursor: pointer;
  position: absolute;
  right: 13px;
  top: 50%;
  -webkit-transform: translate3d(0, -50%, 0);
  transform: translate3d(0, -50%, 0);
}
.m-dialog-wrapper .m-pop-header .m-icon-close::before {
  content: '\e69a';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-dialog-wrapper .m-pop-header-fix {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 20px 0 0;
  text-align: center;
}
.m-dialog-wrapper .m-pop-header-fix .m-icon-suc {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: block;
  padding: 20px 0 0;
}
.m-dialog-wrapper .m-pop-header-fix .m-icon-suc::before {
  content: '\e60b';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-dialog-wrapper .m-pop-header-fix .m-icon-suc:before {
  color: #262262;
  font-size: 28px;
  line-height: 1;
}
.m-dialog-wrapper .m-pop-header-fix > span {
  width: 100%;
}
.m-dialog-wrapper .m-pop-header-fix .m-icon-close {
  top: 20px;
}
.m-dialog-wrapper .m-pop-main {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 36px 0 15px;
  width: 100%;
}
.m-dialog-wrapper .m-pop-main > p {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  font-size: 14px;
  line-height: 20px;
  padding: 0 13px;
}
.m-dialog-wrapper .m-pop-main .m-tips-strong {
  color: #000000;
  font-weight: bold;
}
.m-dialog-wrapper .m-order-info {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 0;
  height: 26px;
  line-height: 26px;
  overflow: hidden;
  padding: 0 13px;
}
.m-dialog-wrapper .m-order-info .m-label,
.m-dialog-wrapper .m-order-info .m-value {
  color: #353a45;
  display: inline-block;
  font-size: 14px;
  line-height: 1;
  vertical-align: middle;
}
.m-dialog-wrapper .m-order-info .icon-one-bet-cut {
  background: #32ce62;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-clip-path: polygon(0 1%, 91% 1%, 70% 100%, 0% 100%);
  clip-path: polygon(0 1%, 91% 1%, 70% 100%, 0% 100%);
  color: #ffffff;
  display: inline-block;
  font-family: Roboto;
  height: 16px;
  line-height: 16px;
  overflow: hidden;
  position: relative;
  width: 16px;
}
.m-dialog-wrapper .m-order-info .icon-one-bet-cut > span {
  font-size: 24px;
  font-style: italic;
  font-weight: bold;
  left: -2px;
  position: absolute;
  top: 3px;
}
.m-dialog-wrapper .m-order-info .m-value {
  float: right;
}
.m-dialog-wrapper .m-btn-wrapper {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-top: 28px;
  padding: 0 13px;
  text-align: right;
}
.m-dialog-wrapper .m-btn-wrapper .af-button {
  border-radius: 2px;
}
.m-dialog-wrapper .m-btn-wrapper .af-button:not(:last-of-type) {
  margin-right: 10px;
}
.m-dialog-wrapper .af-button--text {
  color: #262262;
  font-size: 14px;
  font-weight: bold;
}
.m-dialog-wrapper .af-button--primary {
  background: #262262 !important;
  border: none;
  color: #ffffff !important;
  font-size: 12px;
  font-weight: bold;
  height: 32px;
}

.m-dialog-wrapper .m-share-wrapper {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 20px 60px 0;
}
.m-dialog-wrapper .m-share-wrapper .booking-code-share {
  margin-top: -17px;
  text-align: center;
}
.m-dialog-wrapper .m-share-wrapper .booking-code-share .booking-code-title {
  font-size: 12px;
  font-weight: bold;
  line-height: 14px;
  margin-bottom: 8px;
}
.m-dialog-wrapper .m-share-wrapper .booking-code-share .booking-code-share-code {
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
.m-dialog-wrapper .m-share-wrapper .booking-code-share .booking-code-share-code #content-copy {
  left: 100%;
  margin-left: 12px;
  margin-top: 4px;
  position: absolute;
}
.m-dialog-wrapper .m-share-wrapper .booking-code-share .booking-code-time {
  color: #9ca0ab;
  font-size: 12px;
  line-height: 14px;
  margin-bottom: 24px;
}
.m-dialog-wrapper .m-share-wrapper .booking-code-share .zoom-image-container {
  margin: auto;
  position: relative;
}
.m-dialog-wrapper .m-share-wrapper .booking-code-share .zoom-image-container .zoom-image {
  height: 100px;
}
.m-dialog-wrapper .m-share-wrapper .booking-code-share .zoom-image-container .zoom-handler {
  cursor: pointer;
  left: 50%;
  position: absolute;
  top: 50%;
  -webkit-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);
}
.m-dialog-wrapper .m-share-wrapper .booking-code-share #content-copy {
  margin-bottom: 6px;
  margin-left: 5px;
  width: 24px;
}
.m-dialog-wrapper .m-share-wrapper .booking-code-share #content-copy:hover {
  cursor: pointer;
}
.m-dialog-wrapper .m-share-wrapper .booking-code-share .invisible-element {
  bottom: -100vh;
  position: fixed;
}
.m-dialog-wrapper .m-share-wrapper .booking-code-share .links-container {
  border-collapse: separate;
  border-spacing: 15px;
  margin: auto;
  margin-top: 36px;
  width: -webkit-max-content;
  width: -moz-max-content;
  width: max-content;
}
.m-dialog-wrapper .m-share-wrapper .booking-code-share .links-container > div {
  display: inline-block;
  margin: 0px 7px;
}
.m-dialog-wrapper .m-share-wrapper .booking-code-share .links-container .link-icon {
  cursor: pointer;
  margin-bottom: 8px;
}
.m-dialog-wrapper .m-share-wrapper .m-label,
.m-dialog-wrapper .m-share-wrapper .m-value {
  color: #353a45;
  display: inline-block;
  font-size: 16px;
  vertical-align: middle;
}
.m-dialog-wrapper .m-share-wrapper .m-label {
  line-height: 31px;
  width: 125px;
}
.m-dialog-wrapper .m-share-wrapper .m-value {
  font-size: 16px;
  font-weight: bold;
}
.m-dialog-wrapper .m-share-wrapper .af-button {
  background: #3656a3 !important;
  border: none !important;
  border-radius: 2px;
  color: #ffffff !important;
  line-height: 32px;
  margin-left: 125px;
  margin-top: 35px;
  padding: 0 15px 0 12px;
  width: auto !important;
}
.m-dialog-wrapper .m-share-wrapper .af-button:hover {
  background: #3254a5 !important;
}
.m-dialog-wrapper .m-share-wrapper .af-button:active {
  background: #315eca !important;
}
.m-dialog-wrapper .m-share-wrapper .af-icon-faceBook {
  margin-left: 0;
}
.m-dialog-wrapper .m-share-wrapper .af-icon-faceBook::before {
  content: '\e6e2';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-dialog-wrapper .m-share-wrapper .m-opt-wrapper {
  display: inline-block;
  vertical-align: middle;
}
.m-dialog-wrapper .m-share-wrapper .m-input-wrapper {
  outline: none;
}
.m-dialog-wrapper .m-share-wrapper .m-input-wrapper .m-input {
  border: 1px solid #eaecef;
  border-radius: 2px 0 0 2px;
  border-right: none;
  height: 28px;
}
.m-dialog-wrapper .m-share-wrapper .m-input-wrapper.m-input-wrapper--error .m-input,
.m-dialog-wrapper .m-share-wrapper .m-input-wrapper.m-input-wrapper--error .m-input-append {
  border-color: #e41827 !important;
}
.m-dialog-wrapper .m-share-wrapper .m-input-wrapper.m-input-wrapper--active .m-input,
.m-dialog-wrapper .m-share-wrapper .m-input-wrapper.m-input-wrapper--active .m-input-append {
  border-color: #262262;
}
.m-dialog-wrapper .m-share-wrapper .m-input-wrapper .m-input-append {
  background: #f2f3f5;
  border: 1px solid #eaecef;
  border-left: none;
  border-radius: 0 2px 2px 0;
  color: #262262;
  cursor: pointer;
}
.m-dialog-suc {
  width: 512px;
}
.m-dialog-suc .m-pop-header > span {
  font-size: 18px;
  font-weight: bold;
  padding: 12px 0 20px;
}
.m-dialog-suc .m-pop-header .m-icon-suc {
  padding: 10px 0 0;
}
.m-dialog-suc .m-pop-header .m-icon-suc::before {
  content: '\e60b';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-dialog-suc .m-pop-header .m-icon-suc:after {
  background: #262262;
  content: '';
  display: inline-block;
  height: 25px;
  left: -24px;
  position: relative;
  vertical-align: middle;
  width: 25px;
  z-index: 10;
}
.m-dialog-suc .m-pop-header .m-icon-suc:before {
  color: #32ce62;
  font-size: 40px;
  left: 9px;
  line-height: 1;
  position: relative;
  vertical-align: middle;
  z-index: 11;
}
.m-dialog-suc .m-pop-header .m-icon-close:before {
  font-size: 10px;
}
.m-dialog-suc .m-pop-main {
  padding: 0 116px 26px;
}
.m-dialog-suc .m-pop-main .cashout-top {
  color: #9ca0ab;
  font-size: 10px;
}
.m-dialog-suc .m-order-wrapper {
  border-bottom: 1px solid #eaecef;
  border-top: 1px solid #eaecef;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 10px 0;
}
.m-dialog-suc .m-order-info {
  height: 26px;
}
.m-dialog-suc .m-order-info .m-value,
.m-dialog-suc .m-order-info .m-label {
  line-height: 26px;
}
.m-dialog-suc .m-order-info .m-value {
  font-weight: bold;
}
.m-dialog-suc .m-order-info .m-value .booking-code {
  display: inline-block;
  -webkit-transform: translateY(2px);
  -ms-transform: translateY(2px);
  transform: translateY(2px);
}
.m-dialog-suc .m-order-info .m-value img {
  cursor: pointer;
  margin-right: 3px;
}
.m-dialog-suc .share-code {
  overflow: visible;
}
.m-dialog-suc .share-code .m-value i {
  border: solid 1px #eaecef;
  border-radius: 2px;
  color: #3656a3;
  display: inline-block;
  font-size: 10px;
  height: 20px;
  line-height: 20px;
  margin-left: 7px;
  text-align: center;
  vertical-align: middle;
  width: 48px;
}
.m-dialog-suc .share-code .m-label em::before {
  content: '\e651';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-dialog-suc .share-code .m-label em:before {
  color: #9ca0ab;
  padding-left: 5px;
}
.m-dialog-suc .m-btn-wrapper {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-top: 0;
  padding: 20px 0;
  text-align: center;
}
.m-dialog-suc .m-ok-wrap .af-button {
  width: 170px;
}
.m-dialog-suc .m-share-wrap {
  padding: 0 0 20px;
}
.m-dialog-suc .m-share-wrap .af-button {
  background: #ffffff !important;
  border: 1px solid #262262;
  color: #262262 !important;
  width: 170px;
}
.m-dialog-suc .m-share-wrap .af-button:active {
  background: #ffffff !important;
  border: 1px solid #096b27;
}
.m-dialog-suc .m-btn-text {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 16px;
  text-align: center;
}
.m-dialog-suc .m-btn-text > a {
  color: #262262;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  line-height: 16px;
  text-decoration: none;
}
.m-dialog-suc .m-btn-text .m-icon-more {
  display: inline-block;
  height: 16px;
  margin-left: 10px;
  vertical-align: middle;
}
.m-dialog-suc .m-btn-text .m-icon-more::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-dialog-suc .m-btn-text .m-icon-more:before {
  font-size: 12px;
  line-height: 16px;
}
.m-dialog-wrapper-fix {
  width: 486px;
}
.m-dialog-wrapper-fix .m-pop-header > span {
  font-weight: bold;
  line-height: 19px;
  padding: 0;
}
.m-dialog-wrapper-fix .m-pop-header .m-icon-close:before {
  font-size: 10px;
  line-height: 20px;
}
.m-dialog-wrapper-fix .m-pop-main {
  padding-bottom: 36px;
}
.m-dialog-wrapper-fix .m-pop-main > p {
  font-size: 12px;
  line-height: 16px;
  padding: 0 60px;
}
.es-dialog.desktop .es-dialog-footer {
  margin-bottom: 14px;
  padding: 0 16px;
}
.es-dialog.desktop .es-dialog-footer .es-dialog-btn {
  background: #262262;
  color: #ffffff;
  font-size: 14px;
  padding: 6px 16px;
}
.m-print-bar {
  z-index: -9999;
  position: absolute;
  top: 0;
  right: 0;
}
</style>
