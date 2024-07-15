<template>
  <BetHistoryLayout>
    <div class="x-order-wrapper">
      <div>
        <div class="x-order-detail-wrap">
          <div class="back-wrap">
            <div @click="$router.go(-1)" class="back-btn">
              <i class="icon-back"></i>
              <span>Back</span>
            </div>
            <div class="blank-block"></div>
          </div>
          <div class="title-wrap">
            <span class="title" data-cms-key="ticket_details_id_vid"
              >Ticket Details (ID: {{ betDetail.id }})</span
            >
          </div>
          <div class="timestamp">{{ moment(betDetail.created).format('DD/MM/YYYY HH:mm') }}</div>
          <div
            class="status-bar"
            :class="betDetail.statusCode === 1 ? 'green' : betDetail.statusCode === 2 ? 'gray' : ''"
          >
            <span class="x-order-type">{{ betDetail.betCategoryDesc }}</span>

            <span class="x-order-status" data-cms-key="running">{{
              betDetail.statusDescription
            }}</span>
          </div>
          <div class="stake-wrap">
            <div class="cell total-stake">
              <span class="label" data-cms-key="total_stake">Total Stake</span>
              <span>: </span>
              <span class="value"> {{ formatNumber(betDetail.stake) }} </span>
            </div>
            <!-- <div class="cell bonus">
              <span class="label" data-cms-key="max_bonus" 
                >Max Bonus</span
              >
              <span>: </span>
              <span class="value"> 523.45 </span>
            </div> -->

            <div class="cell pot-win">
              <span class="label" data-cms-key="total_odds">Total Odds</span>
              <span>: </span>
              <span class="value"> {{ betDetail.totalOdd.toFixed(2) }} </span>
            </div>

            <!-- <div class="cell pot-win">
              <span class="label" data-cms-key="pot_win">Pot. Win</span>
              <span>: </span>
              <span class="value"> {{ formatNumber(betDetail.possibleWin) }} </span>
            </div> -->

            <div class="cell total-return">
              <span class="label" data-cms-key="total_return">Total Return</span>
              <span>: </span>
              <span class="value" :class="{ green: betDetail.winnings }">
                {{ betDetail.winnings ? formatNumber(betDetail.winnings) : '0.00' }}
              </span>
            </div>
          </div>
          <div class="rebet-wrap">
            <div class="left">
              <input type="text" id="betCode" class="invisiable-code" />
              <div class="code-string" data-cms-key="booking_code_vcode">
                Booking Code: {{ betDetail.betslipId }}
              </div>
            </div>
          </div>
          <div class="triangle left"></div>
          <div class="triangle right"></div>
        </div>
        <div class="x-order-detail-wrap list">
          <div
            v-for="(selection, index) in betDetail.selections"
            :key="index"
            class="selection-detail-wrap"
          >
            <div class="selection-num">{{ index + 1 }}</div>
            <div class="selection-detail">
              <div class="selection-header">
                <span class="game-timestamp">{{
                  moment(betDetail.eventDate).format('DD/MM HH:mm')
                }}</span>
                <span class="game-id" data-cms-key="game_id_vid"
                  >Game ID: {{ selection.matchId }}</span
                >

                <span class="selection-status">
                  <span v-if="selection.statusDescription === 'Lost'">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="20"
                      fill="red"
                      class="bi bi-x-octagon-fill"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"
                      />
                    </svg>
                  </span>
                  <span v-if="selection.statusDescription === 'Won'">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="20"
                      fill="green"
                      class="bi bi-shield-fill-check"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m2.146 5.146a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793z"
                      />
                    </svg>
                  </span>
                  <span v-if="selection.statusDescription === 'Pending'">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="20"
                      fill="#333"
                      class="bi bi-clock-fill"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"
                      />
                    </svg>
                  </span>
                </span>
              </div>
              <div class="selection-body">
                <div class="team-wrap">
                  <p class="team-label home">{{ selection.eventName.split('vs.')[0] }}</p>
                  <p class="team-label">{{ selection.eventName.split('vs.')[1] }}</p>
                </div>
                <div class="score-wrap">
                  <span class="no-score">--</span>
                </div>

                <div class="outcome-wrap">
                  <div class="outcome-row">
                    <span class="outcome-label" data-cms-key="pick">Pick</span>
                    <p class="outcome-value">
                      {{ getTeamShortName(selection.eventName, selection.outcomeName) }} @{{
                        selection.odds.toFixed(2)
                      }}
                    </p>
                  </div>
                  <div class="outcome-row">
                    <span class="outcome-label" data-cms-key="market">Market</span>
                    <p class="outcome-value">{{ selection.marketName }}</p>
                  </div>
                  <!-- <div class="outcome-row">
                    <span class="outcome-label" data-cms-key="result">Result</span>
                    <p class="outcome-value">--</p>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BetHistoryLayout>
</template>

<script setup>
import { watch, ref } from 'vue'
import BetHistoryLayout from '@/components/Shared/BetHistoryLayout.vue'
import { useRoute } from 'vue-router'
import { formatNumber } from '@/helpers'
import moment from 'moment'

const route = useRoute()
const isLoading = ref(false)
const betDetail = ref()

watch(
  () => route.params.bet_id,
  async (bet_id) => {
    await getBetDetails(bet_id)
  },
  { immediate: true } // Trigger the watch callback immediately on component mount
)

async function getBetDetails() {
  isLoading.value = true
  const res = localStorage.getItem('betDetail')
  betDetail.value = JSON.parse(res)
  isLoading.value = false
}

const getTeamShortName = (eventName, outcomeName) => {
  let home = eventName.split('vs.')[0].trim()
  let away = eventName.split('vs.')[1].trim()
  let name

  if (outcomeName === home) {
    name = 'Home'
  } else if (outcomeName === away) {
    name = 'Away'
  } else {
    name = outcomeName
  }
  return name
}
</script>

<style>
.x-order-wrapper .af-button--primary {
  background: var(--brand-primary) !important;
  border: 0px;
  color: #fff !important;
}
.x-order-wrapper .af-button--primary:hover {
  background: #32ce62 !important;
}

.x-order-wrapper .is-disabled,
.x-order-wrapper .is-disabled:hover {
  background: #dcdee5 !important;
  color: #9ca0ab !important;
}
.x-order-wrapper .x-order-detail-wrap {
  background-color: #fff;
  margin-bottom: 3px;
  padding: 22px 20px 14px 20px;
  position: relative;
}
.x-order-wrapper .x-order-detail-wrap .title-wrap {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-bottom: 12px;
}
.x-order-wrapper .x-order-detail-wrap .title-wrap .title {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  font-size: 14px;
  font-weight: bold;
  line-height: 19px;
}
.x-order-wrapper .x-order-detail-wrap .title-wrap .icon-print {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin-right: 7px;
}
.x-order-wrapper .x-order-detail-wrap .title-wrap .icon-print::before {
  content: '\e77b';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-order-wrapper .x-order-detail-wrap .title-wrap .print {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  font-size: 12px;
  margin-right: 16px;
}
.x-order-wrapper .x-order-detail-wrap .title-wrap .icon-share {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin-right: 7px;
}
.x-order-wrapper .x-order-detail-wrap .title-wrap .icon-share::before {
  content: '\e63d';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-order-wrapper .x-order-detail-wrap .title-wrap .share {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  font-size: 12px;
}
.x-order-wrapper .x-order-detail-wrap .back-wrap {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  line-height: 20px;
  margin-bottom: 12px;
}
.x-order-wrapper .x-order-detail-wrap .back-wrap .back-btn {
  cursor: pointer;
}
.x-order-wrapper .x-order-detail-wrap .back-wrap .icon-back {
  margin-right: 8px;
}
.x-order-wrapper .x-order-detail-wrap .back-wrap .icon-back::before {
  content: '\e620';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-order-wrapper .x-order-detail-wrap .back-wrap .icon-back::before {
  font-size: 12px;
}
.x-order-wrapper .x-order-detail-wrap .back-wrap .blank-block {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
}
.x-order-wrapper .x-order-detail-wrap .back-wrap .delete-btn {
  background: #fff;
  border: 1px solid #dcdee5;
  color: #e41827;
  cursor: pointer;
  height: 18px;
  line-height: 18px;
  padding: 0 16px 0 16px;
}
.x-order-wrapper .x-order-detail-wrap .back-wrap .delete-btn:hover {
  background: #eaecef;
}
.x-order-wrapper .x-order-detail-wrap .timestamp {
  font-size: 12px;
  line-height: 14px;
  margin-bottom: 9px;
}

.x-order-wrapper .x-order-detail-wrap .status-bar {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #353a45;
  color: #fff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 14px;
  font-weight: bold;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  line-height: 24px;
  margin-bottom: 10px;
  padding: 0 6px;
}
.x-order-wrapper .x-order-detail-wrap .status-bar.green {
  background-color: rgb(0, 193, 0);
}
.x-order-wrapper .x-order-detail-wrap .status-bar.gray {
  background-color: #9ca0ab;
}
.x-order-wrapper .x-order-detail-wrap .status-bar .x-order-type {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  text-align: left;
}
.x-order-wrapper .x-order-detail-wrap .status-bar .x-order-icon {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin: 0 4px;
}
.x-order-wrapper .x-order-detail-wrap .status-bar .x-order-icon.win {
  color: #fff;
}
.x-order-wrapper .x-order-detail-wrap .status-bar .x-order-icon.win::before {
  content: '\e626';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-order-wrapper .x-order-detail-wrap .status-bar .x-order-icon.pending {
  background-color: #e41827;
  height: 16px;
  width: 16px;
}
.x-order-wrapper .x-order-detail-wrap .status-bar .x-order-status {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin-right: 13px;
}
.x-order-wrapper .x-order-detail-wrap .stake-wrap {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.x-order-wrapper .x-order-detail-wrap .stake-wrap .cell {
  height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 50%;
}
.x-order-wrapper .x-order-detail-wrap .stake-wrap .cell .label {
  color: #9ca0ab;
  font-size: 12px;
}
.x-order-wrapper .x-order-detail-wrap .stake-wrap .cell .value {
  color: #353a45;
  font-size: 14px;
  line-height: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.x-order-wrapper .x-order-detail-wrap .stake-wrap .cell.total-stake .value {
  font-size: 14px;
}
.x-order-wrapper .x-order-detail-wrap .stake-wrap .cell.total-return .value {
  color: #353a45;
  font-size: 14px;
  font-weight: bold;
}
.x-order-wrapper .x-order-detail-wrap .stake-wrap .cell.total-return .value.green {
  color: rgb(0, 193, 0);
}
.x-order-wrapper .x-order-detail-wrap .stake-wrap .cell .one-bet-cut-icon-img {
  margin-top: -4px;
}
.x-order-wrapper .x-order-detail-wrap .cashout-rule {
  color: #9ca0ab;
  font-size: 12px;
  line-height: 12px;
  text-align: left;
}
.x-order-wrapper .x-order-detail-wrap .rebet-wrap {
  border-top: 1px solid #dcdee5;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  margin-top: 16px;
}
.x-order-wrapper .x-order-detail-wrap .rebet-wrap > div {
  padding-top: 10px;
}
.x-order-wrapper .x-order-detail-wrap .rebet-wrap .left {
  color: #353a45;
  height: 30px;
  line-height: 30px;
  padding-top: 15px;
  width: 100%;
}
.x-order-wrapper .x-order-detail-wrap .rebet-wrap .left img {
  cursor: pointer;
  margin-left: 8px;
  width: 18px;
}
.x-order-wrapper .x-order-detail-wrap .rebet-wrap .left > * {
  display: inline-block;
}
.x-order-wrapper .x-order-detail-wrap .rebet-wrap .left .code-string {
  line-height: 18px;
}
.x-order-wrapper .x-order-detail-wrap .rebet-wrap .left .rebet-btn {
  border: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  float: right;
  height: 28px;
  min-width: 63px;
  padding: 0 5px;
  text-align: center;
}
.x-order-wrapper .x-order-detail-wrap .rebet-wrap .left .invisiable-code {
  bottom: -100vh;
  position: fixed;
}
.x-order-wrapper .x-order-detail-wrap .rebet-wrap .right {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 1;
  -ms-flex: 0 0 1;
  flex: 0 0 1;
  width: 216px;
}
.x-order-wrapper .x-order-detail-wrap .rebet-wrap .right > div:only-child {
  height: 30px;
  line-height: 30px;
}
.x-order-wrapper .x-order-detail-wrap .rebet-wrap .right .tip {
  color: #9ca0ab;
  font-size: 10px;
  line-height: 20px !important;
  padding-bottom: 20px;
  padding-left: 16px;
  width: 100%;
}
.x-order-wrapper .x-order-detail-wrap .rebet-wrap .right .tip .icon-tip {
  font-size: 12px;
  margin-left: 4px;
  vertical-align: middle;
}
.x-order-wrapper .x-order-detail-wrap .rebet-wrap .right .tip .icon-tip::before {
  content: '\e651';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-order-wrapper .x-order-detail-wrap .rebet-wrap .right .tip .icon-tip .x-popOver-wrapper {
  margin-bottom: 6px;
  margin-left: 5px;
}
.x-order-wrapper
  .x-order-detail-wrap
  .rebet-wrap
  .right
  .tip
  .icon-tip
  .x-popOver-wrapper
  .x-popOver-arrow {
  height: 6px;
  width: 6px;
}
.x-order-wrapper
  .x-order-detail-wrap
  .rebet-wrap
  .right
  .tip
  .icon-tip
  .x-popOver-wrapper
  .x-popOver-arrow.x-popOver-arrow--bottom {
  top: -5px;
}
.x-order-wrapper .x-order-detail-wrap .triangle {
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
.x-order-wrapper .x-order-detail-wrap .triangle.left {
  left: -10px;
}
.x-order-wrapper .x-order-detail-wrap .triangle.right {
  right: -10px;
}
.x-order-wrapper .x-order-detail-wrap.list {
  padding: 15px 20px 20px 20px;
}
.x-order-wrapper .x-order-detail-wrap.list .selection-detail-wrap {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  border-bottom: 2px solid #eaecef;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding: 9px 0;
  position: relative;
}
.x-order-wrapper .x-order-detail-wrap.list .selection-detail-wrap .selection-num {
  font-size: 14px;
  font-weight: bold;
  left: 0;
  line-height: 16px;
  position: absolute;
  top: 9px;
  width: 25px;
}
.x-order-wrapper .x-order-detail-wrap.list .selection-detail-wrap .selection-detail {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  margin-left: 25px;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-header {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 12px;
  /* font-weight: 500; */
  line-height: 16px;
  margin-bottom: 6px;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-header
  .live-icon {
  background: #33ea6a;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  height: 16px;
  line-height: 16px;
  margin-right: 10px;
  padding: 0 3px;
  position: relative;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-header
  .live-icon:after {
  border-bottom: 8px solid transparent;
  border-left: 1px solid #33ea6a;
  border-right: 1px solid transparent;
  border-top: 8px solid #33ea6a;
  content: '';
  height: 0;
  position: absolute;
  right: -2px;
  top: 0;
  width: 0;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-header
  .game-id,
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-header
  .game-timestamp {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin-right: 11px;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-header
  .game-statistics,
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-header
  .game-live-tracker {
  color: #3656a3;
  cursor: pointer;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin-left: 13px;
}

.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-header
  .selection-status {
  color: #9ca0ab;
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  font-weight: bold;
  text-align: right;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-header
  .selection-status.running {
  color: #353a45;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-header
  .selection-status.checked::before {
  content: '\e60b';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-header
  .selection-status.checked::before {
  color: var(--brand-primary);
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body
  .team-wrap {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  width: 180px;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body
  .score-wrap {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  margin: 0 21px;
  width: 70px;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body
  .score-wrap
  .no-score {
  line-height: 34px;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body
  .score-wrap
  .score-pairs {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: bold;
  line-height: 14px;
  margin-right: 1px;
  min-width: 14px;
  text-align: center;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body
  .score-wrap
  .score-pairs
  .home-score {
  background-color: #fff;
  border: 1px solid #dcdee5;
  color: #9ca0ab;
  margin-bottom: 2px;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body
  .score-wrap
  .score-pairs
  .home-score.main {
  background-color: #f2f3f5;
  color: #353a45;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body
  .score-wrap
  .score-pairs
  .away-score {
  background-color: #fff;
  border: 1px solid #dcdee5;
  color: #9ca0ab;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body
  .score-wrap
  .score-pairs
  .away-score.main {
  background-color: #f2f3f5;
  color: #353a45;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body
  .blank-wrap {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body
  .banker-wrap {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  height: 48px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-right: 16px;
  width: 16px;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body
  .banker-wrap
  .banker-icon {
  border: 1px solid var(--brand-primary);
  border-radius: 8px;
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: bold;
  height: 14px;
  line-height: 14px;
  text-align: center;
  width: 14px;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body
  .outcome-wrap {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  margin-right: 16px;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body
  .outcome-wrap
  .outcome-row {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 12px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  line-height: 16px;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body
  .outcome-wrap
  .outcome-row
  .outcome-label {
  color: #9ca0ab;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  width: 60px;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body
  .outcome-wrap
  .outcome-row
  .outcome-value {
  color: #353a45;
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
}
.x-order-wrapper
  .x-order-detail-wrap.list
  .selection-detail-wrap
  .selection-detail
  .selection-body
  .delay-icon {
  -webkit-align-self: flex-start;
  -ms-flex-item-align: start;
  align-self: flex-start;
  cursor: pointer;
}
.x-order-wrapper .x-order-detail-wrap.list .bet-number-wrap {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 12px;
  font-weight: bold;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  line-height: 16px;
  margin-top: 13px;
}
.x-order-wrapper .x-order-detail-wrap.list .bet-number-wrap .bet-number {
  color: #353a45;
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  text-align: left;
}
.x-order-wrapper .x-order-detail-wrap.list .bet-number-wrap .bet-detail {
  color: var(--brand-primary);
  cursor: pointer;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}
.x-order-wrapper .x-order-detail-wrap.list .bet-number-wrap .bet-detail-icon {
  color: var(--brand-primary);
  cursor: pointer;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin-left: 6px;
}
.x-order-wrapper .x-order-detail-wrap.list .bet-number-wrap .bet-detail-icon::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-order-wrapper .x-order-detail-wrap.list .bet-number-wrap .bet-detail-icon::before {
  font-size: 12px;
  vertical-align: middle;
}
.x-order-wrapper .x-order-detail-wrap.cashout {
  padding: 11px 20px 21px 20px;
}
.x-order-wrapper .x-order-detail-wrap.cashout .cashout-detail {
  font-size: 14px;
  font-weight: bold;
  line-height: 16px;
  margin-bottom: 10px;
}
.x-order-wrapper .x-order-detail-wrap.cashout .cashout-detail-wrap {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
}
.x-order-wrapper .x-order-detail-wrap.cashout .cashout-detail-wrap .total-cashout {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin-right: 40px;
}
.x-order-wrapper .x-order-detail-wrap.cashout .cashout-detail-wrap .remain-stake {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  margin-right: 41px;
}
.x-order-wrapper .x-order-detail-wrap.cashout .cashout-detail-wrap .pot-win {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}
.x-order-wrapper .x-order-detail-wrap.cashout .cashout-detail-wrap .label {
  color: #9ca0ab;
  font-size: 12px;
  line-height: 14px;
  text-align: right;
}
.x-order-wrapper .x-order-detail-wrap.cashout .cashout-detail-wrap .value {
  color: #353a45;
  font-size: 14px;
  line-height: 16px;
  text-align: right;
}
.tracker.es-dialog {
  border-color: #353a45;
}
.tracker.es-dialog .es-dialog-head .es-dialog-close {
  cursor: pointer;
  right: -27px;
  text-decoration: none;
  top: 0px;
}
.tracker.es-dialog .es-dialog-head .es-dialog-close em {
  color: #fff;
  cursor: pointer;
}
.tracker.es-dialog .es-dialog-body .es-dialog-main {
  background-color: #353a45;
  max-height: 400px;
}
.tracker.es-dialog .es-dialog-head {
  background-color: #353a45;
  height: 0px;
}
.bet-detail .es-dialog-head {
  height: 20px;
}
.bet-detail .es-dialog-head h1 {
  line-height: 20px;
  padding-left: 0px;
}
.bet-detail .es-dialog-main.x-dialog-main {
  padding-top: 0px;
}
.x-order-wrapper .x-order-detail-wrap .rebet-wrap .left[data-v-ebf94b22] {
  color: #353a45;
  height: 30px;
  line-height: 30px;
  padding-top: 15px;
  width: 100%;
}
</style>
