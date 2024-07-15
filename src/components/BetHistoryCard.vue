<template>
  <div class="x-order-list">
    <div class="x-order-header">
      <span class="x-order-left">{{ moment(betData.created).format('DD/MM/YYYY HH:mm') }}</span>
    </div>
    <div
      class="x-order-bar"
      :class="betData.statusCode === 1 ? 'green' : betData.statusCode === 2 ? 'gray' : ''"
    >
      <span class="x-order-type"> {{ betData.betCategory }} </span>

      <span class="x-order-status" data-cms-key="running">{{ betData.statusDescription }}</span>
      <i class="x-order-detail"></i>
    </div>
    <div class="x-order-selection">
      <div class="x-order-vs-wrap">
        <div
          class="x-order-vs label"
          v-for="(selection, i) in betData.selections.slice(0, 3)"
          :key="i"
        >
          {{ selection.eventName }}
        </div>
        <div class="x-order-vs label" v-if="betData.selections.length > 3">
          <span>and {{ betData.selections.length - 3 }} other matches</span>
        </div>
      </div>
      <div class="x-order-total-stake">
        <div class="total-stake label" data-cms-key="total_stake">Total Stake</div>
        <div class="stake label">{{ formatNumber(betData.stake) }}</div>
      </div>
      <div class="x-order-total-return">
        <div class="total-return label" data-cms-key="total_return">Total Return</div>
        <div class="stake label">
          {{ betData.winnings ? formatNumber(betData.winnings) : '0.00' }}
        </div>
      </div>
    </div>

    <div class="triangle left"></div>
    <div class="triangle right"></div>
  </div>
</template>

<script setup>
import { formatNumber } from '@/helpers'
import moment from 'moment'
const props = defineProps({
  betData: Object
})
</script>

<style scoped>
.x-text-second {
  font-size: 13px;
  line-height: 1;
}
.x-order-list {
  padding: 0 20px 15px 20px;
  position: relative;
  background-color: #fff;
  margin-top: 3px;
}
.x-order-list .x-bet-bluetxt {
  color: #3656a3;
  cursor: pointer;
}
.x-order-list .x-order-header {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  line-height: 32px;
  font-size: 12px;
  font-weight: 500;
  color: #353a45;
}
.x-order-list .x-order-header .x-order-timestamp {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  text-align: left;
}
.x-order-list .x-order-header .x-order-id {
  margin-left: 20px;
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  text-align: left;
}
.x-order-list .x-order-header .x-order-icon.share {
  margin-right: 7px;
  cursor: pointer;
}
.x-order-list .x-order-header .x-order-icon.share::before {
  content: '\e63d';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-order-list .x-order-header .x-order-icon.share::before {
  font-size: 12px;
}
.x-order-list .x-order-header .x-order-share {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}
.x-order-list .x-order-bar {
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
  font-size: 14px;
  line-height: 24px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  padding: 0 6px;
  margin-bottom: 10px;
  background-color: #353a45;
}
.x-order-list .x-order-bar.green {
  background-color: rgb(0, 193, 0);;
}
.x-order-list .x-order-bar.gray {
  background-color: #9ca0ab;
}
.x-order-list .x-order-bar .x-order-type {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  text-align: left;
}
.x-order-list .x-order-bar .x-order-icon {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin: 0 4px;
}
.x-order-list .x-order-bar .x-order-icon.win {
  color: #fff;
}
.x-order-list .x-order-bar .x-order-icon.win::before {
  content: '\e626';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-order-list .x-order-bar .x-order-icon.pending {
  background-color: #e41827;
  height: 16px;
  width: 16px;
}
.x-order-list .x-order-bar .x-order-status {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin-right: 13px;
}
.x-order-list .x-order-bar .x-order-detail {
  color: #fff;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  height: 24px;
}
.x-order-list .x-order-bar .x-order-detail::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-order-list .x-order-selection {
  -webkit-box-align: start;
  -webkit-align-items: flex-start;
  -ms-flex-align: start;
  align-items: flex-start;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding-left: 2px;
}
.x-order-list .x-order-selection .label {
  color: #353a45;
  font-size: 12px;
  line-height: 14px;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.x-order-list .x-order-selection .x-order-vs-wrap {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  width: 265px;
}
.x-order-list .x-order-selection .x-order-vs-wrap .vs-text {
  color: #9ca0ab;
  margin: 0 4px;
}
.x-order-list .x-order-selection .x-order-total-stake {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  margin-left: 40px;
  width: 94px;
}
.x-order-list .x-order-selection .x-order-total-stake .total-stake.label {
  color: #9ca0ab;
  text-align: right;
}
.x-order-list .x-order-selection .x-order-total-stake .stake.label {
  color: #353a45;
  font-size: 14px;
  font-weight: bold;
  line-height: 19px;
  text-align: right;
}
.x-order-list .x-order-selection .x-order-total-return {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin-left: 40px;
  width: 94px;
}
.x-order-list .x-order-selection .x-order-total-return .total-return.label {
  color: #9ca0ab;
  text-align: right;
}
.x-order-list .x-order-selection .x-order-total-return .stake.label {
  color: #353a45;
  font-size: 14px;
  font-weight: bold;
  line-height: 19px;
  text-align: right;
}
.x-order-list .x-order-selection .x-order-total-return .stake.label.green {
  color: rgb(0, 193, 0);
}
.x-order-list .x-order-tips {
  color: #9ca0ab;
  font-size: 12px;
  line-height: 14px;
  margin-top: 12px;
}
.x-order-list .triangle {
  background-color: #eaecef;
  bottom: -9px;
  height: 15px;
  position: absolute;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  width: 15px;
  z-index: 1;
}
.x-order-list .triangle.left {
  left: -10px;
}
.x-order-list .triangle.right {
  right: -10px;
}
</style>
