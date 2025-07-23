<template>
  <SportsLayout>
    <!-- <template #left-content>
    </template> -->
    <template #fixtures-list>
      <!-- <LiveInplay></LiveInplay> -->
      <div>
        <div class="crumb-wrap">
          <div class="crumb">
            <span>{{ unslugify(route.params.sport) }} / </span
            ><span
              >
              {{ unslugify(route.params.tournament_name) }} / </span
            ><span>{{ unslugify(route.params.event_name) }}</span>
          </div>
          <div class="btns">
            <span class="refresh"></span>
          </div>
        </div>
        <div class="x-eventDetail">
          <div v-if="!isLoading">
            <p class="x-t-info">
              <span class="game-time"
                >{{ moment(matchDetails.date).format("dddd DD/MM  hh:mm") }}
              </span>

              <span class="event-id"> ID:{{ matchDetails.gameID }}</span>
            </p>
            <div id="j_title" class="x-title-wrapper">
              <div class="x-left">
                <span class="x-against">{{ matchDetails.name }}</span>
              </div>
              <div class="x-right" @click="showFixtureAnalysis(matchDetails.matchID)">
                <i class="x-icon-h2h"><em></em></i>
              </div>
            </div>

            <div class="x-detail-wrapper">
              <div
                v-for="(market, index) in matchDetails.markets"
                :key="index"
                class="x-table__wrapper"
              >
                <div class="x-table x-table-header">
                  <div class="x-table-row">
                    <div
                      class="x-table-cell x-table-cell--responsive x-table-cell--transparent"
                    >
                      <i class="x-icon--bg x-icon--fold"></i>
                      <span class="x-table-header-title">{{ market.marketName }}</span>
                    </div>
                    <div
                      class="x-table-cell x-table-cell--responsive x-table-cell--transparent"
                    ></div>
                  </div>
                </div>
                <div class="x-table">
                  <div
                    class="x-table-row x-outcome"
                    v-for="(group, g) in getChunks(market.outcomes, 3)"
                    :key="g"
                  >
                    <div
                      v-for="(outcome, o) in sortByKey(group, 'outcomeID')"
                      :key="o"
                      class="x-table-cell x-table-cell--responsive"
                      :style="group.length === 2 ? 'width: 33.3333%' : 'width: 33.3333%'"
                      @click="addToBetslip(matchDetails, outcome, market)"
                      :class="
                        isSelected(
                          createID(
                            matchDetails.gameID,
                            matchDetails.matchID,
                            outcome.outcomeName,
                            outcome.oddID,
                            matchDetails.name
                          ),
                          couponStore.coupon
                        )
                          ? 'x-table-cell--checked'
                          : ''
                      "
                    >
                      <span class="x-table-cell-item" style="text-transform: capitalize"
                        >{{
                          market.specifier !== ""
                            ? outcome.outcomeName
                            : outcome.displayName ?? outcome.outcomeName
                        }} </span
                      ><span class="x-table-cell-item">{{
                        outcome.odds.toFixed(2)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <LoadingSpinner v-else></LoadingSpinner>
        </div>
      </div>
    </template>
  </SportsLayout>
</template>
<script setup>
import SportsLayout from "@/components/Shared/SportsLayout.vue";
import { useRoute } from "vue-router";
import LoadingSpinner from "@/components/Loaders/LoadingSpinner.vue";
import { ref, onMounted } from "vue";
import { useCouponStore } from "@/stores";
import emitter from "@/plugins/emitter";

import _ from "lodash";
import { getFixtureMarkets, unslugify, createID, isSelected } from "@/helpers";
import moment from "moment";
// import LiveInplay from '@/components/LiveInplay.vue'

const couponStore = useCouponStore();
const route = useRoute();
const isLoading = ref(false);
const matchDetails = ref({});

const competitor1 = ref();
const competitor2 = ref();

async function fetchMatchDetails() {
  isLoading.value = true;
  const id = route.params.event_id;
  const res = await getFixtureMarkets(id);
  isLoading.value = false;
  if (res && !_.isEmpty(res) && res.markets) {
    matchDetails.value = res;
    competitor1.value = res.competitor1;
    competitor2.value = res.competitor2;
  } else {
    emitter.emit("showDialog", {
      dialogType: "error",
      dialogData: {
        data: { message: "This event is no longer available" },
        nextRoute: "/",
      },
    });
  }
}

const getChunks = (outcomes, n) => {
  let x = uniqueOutcomes(outcomes);
  return _.chunk(x, n);
};

function showFixtureAnalysis(id) {
  return window.open(
    `https://s5.sir.sportradar.com/betradar/en/match/${id}`,
    "stats",
    "width=1078,height=768"
  );
}

const uniqueOutcomes = (outcomes) => {
  let x = outcomes.filter(
    (outcome, index, self) =>
      index === self.findIndex((o) => o.outcomeID === outcome.outcomeID)
  );
  return x;
};

function addToBetslip(event, odd, market) {
  if (odd.odds < 1) return;
  const id = createID(
    event.gameID,
    event.matchID,
    odd.outcomeName,
    odd.oddID,
    event.name
  );
  const data = {
    fixture: event,
    market_name: market.marketName,
    market_id: market.marketID,
    ele_id: id,
    outcome: odd,
    odds: odd.odds,
    odd_id: odd.oddID,
    odd_name: odd.outcomeName,
    type: "prematch",
    event_id: event.gameID,
    specifier: market.specifier,
  };

  
  // return couponStore.addToCoupon(data)

  const existsInBetslip = isSelected(id, couponStore.coupon);
  return existsInBetslip
    ? couponStore.removeSelection(id)
    : couponStore.addToCoupon(data);
}

function sortByKey(array, key, ascending = true) {
  return array.slice().sort((a, b) => {
    const valA = parseInt(a[key], 10);
    const valB = parseInt(b[key], 10);

    if (isNaN(valA) || isNaN(valB)) {
      // Handle cases where parsing fails
      return 0;
    }

    return ascending ? valA - valB : valB - valA;
  });
}

onMounted(async () => {
  await fetchMatchDetails();
});
</script>

<style scoped>
.x-dialog-wrapper .x-pop-header > span {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  font-size: 16px;
  line-height: 22px;
  max-width: calc(100% - 24px);
  padding: 15px 13px;
}
.x-text-second {
  font-size: 13px;
  line-height: 1;
}

/*  */
.x-eventDetail {
  background: #fff;
}
.x-detail-wrapper {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 20px 10px 0;
  width: 100%;
}
.x-detail-wrapper .x-nav {
  border-bottom: 1px solid rgba(180, 180, 180, 0.5);
  width: 100%;
}
.x-detail-wrapper .x-nav .x-nav-item {
  border-bottom: 3px solid transparent;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  padding: 6px 14px;
  vertical-align: top;
}
.x-detail-wrapper .x-nav .x-nav-item:hover {
  border-bottom: 3px solid rgba(13, 151, 55, 0.7);
}
.x-detail-wrapper .x-nav .x-nav-item div {
  color: #fff;
  font-size: 14px;
  line-height: 18px;
  text-transform: capitalize;
}
.x-detail-wrapper .x-nav .x-nav-item--active {
  border-bottom: 3px solid var(--brand-secondary) !important;
  font-weight: bold;
}
.x-detail-wrapper .x-detail-loading {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  height: 200px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.x-detail-wrapper .x-detail-loading > div {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
.x-detail-wrapper .x-detail-loading .x-icon-loading {
  -webkit-animation: logoLoading 1s infinite cubic-bezier(0.4, 0, 1, 1) alternate;
  animation: logoLoading 1s infinite cubic-bezier(0.4, 0, 1, 1) alternate;
  background: rgba(234, 236, 239, 0.15);
  border-radius: 50%;
  color: #353a45;
  display: block;
  height: 60px;
  line-height: 60px;
  margin-bottom: 10px;
  width: 60px;
}
.x-detail-wrapper .x-detail-loading .x-icon-loading::before {
  content: "\e610";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-detail-wrapper .x-detail-loading .x-icon-loading:before {
  font-size: 32px;
}
.x-detail-wrapper .x-detail-loading .x-text-msg {
  color: #9ca0ab;
  font-size: 12px;
  line-height: 16px;
}
.x-detail-wrapper .x-detail-error {
  -webkit-box-align: start;
  -webkit-align-items: flex-start;
  -ms-flex-align: start;
  align-items: flex-start;
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
}
.x-detail-wrapper .x-detail-error > div {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 30px 40px;
  text-align: left;
  vertical-align: top;
}
.x-detail-wrapper .x-detail-error .x-error-title {
  color: #9ca0ab;
  font-size: 64px;
  line-height: 87px;
}
.x-detail-wrapper .x-detail-error .x-error-msg {
  color: #dcdee5;
  display: block;
  font-size: 14px;
  line-height: 19px;
  margin: 4px 0 18px;
}
.x-detail-wrapper .x-detail-error .af-button {
  border: none;
  border-radius: 2px;
  font-size: 12px;
  height: 32px;
  padding: 0 !important;
  width: 65px;
  background: var(--brand-secondary) !important;
  color: #fff !important;
}
.x-detail-wrapper .x-detail-error .af-button:hover {
  background: #32ce62 !important;
}
.x-detail-wrapper .x-detail-error .af-button:active {
  background: #3d31a5 !important;
}
.x-detail-wrapper .x-detail-error-fix > div {
  padding: 50px 40px;
}

/*  */
.x-eventDetail {
  width: 100%;
  border: 1px solid #eaecef;
}
.x-eventDetail .x-t-info {
  font-size: 12px;
  line-height: 16px;
  padding: 10px 10px 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #353a45;
}
.x-eventDetail .x-t-info .game-time {
  word-spacing: 8px;
}
.x-eventDetail .x-t-info .game-time::before {
  content: "\e668";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-eventDetail .x-t-info .game-time::before {
  content: "\e68e";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-eventDetail .x-t-info .game-time::before {
  font-size: 12px;
  margin-right: 2px;
}
.x-eventDetail .x-t-info span {
  margin-right: 8px;
}
.x-eventDetail .x-t-info .live-in-play::before {
  content: "\e64e";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-eventDetail .x-t-info .live-in-play::before {
  margin-right: 2px;
  vertical-align: top;
}
.x-eventDetail .x-title-wrapper {
  padding: 17px 10px 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-eventDetail .x-title-wrapper .x-left {
  display: inline-block;
  vertical-align: top;
  position: relative;
  max-width: 85%;
}
.x-eventDetail .x-title-wrapper .x-right {
  float: right;
  height: 32px;
  line-height: 32px;
}
.x-eventDetail .x-title-wrapper .x-right:after {
  clear: both;
  content: ".";
  display: block;
  height: 0;
  visibility: hidden;
}
.x-eventDetail .x-title-wrapper .x-against {
  font-size: 20px;
  color: #000;
  display: inline-block;
  vertical-align: middle;
  height: 32px;
  line-height: 32px;
  margin-right: 10px;
  white-space: nowrap;
}
.x-eventDetail .x-title-wrapper .x-text-btn {
  display: inline-block;
  vertical-align: middle;
  padding: 6px 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid #dcdee5;
  font-size: 12px;
  color: #353a45;
  border-radius: 2px;
}
.x-eventDetail .x-title-wrapper .x-icon-pack,
.x-eventDetail .x-title-wrapper .x-icon-unpack {
  color: var(--brand-secondary);
  display: inline-block;
  vertical-align: middle;
  width: 16px;
  height: 16px;
  margin-left: 5px;
  margin-top: -7px;
}
.x-eventDetail .x-title-wrapper .x-icon-unpack {
  margin-top: -10px;
}
.x-eventDetail .x-title-wrapper .x-icon-unpack::before {
  content: "\e62d";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-eventDetail .x-title-wrapper .x-icon-pack::before {
  content: "\e6a3";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-eventDetail .x-title-wrapper .x-btn-wrapper {
  display: inline-block;
  position: relative;
  z-index: 3;
}
.x-eventDetail .x-title-wrapper .x-btn-wrapper:hover {
  cursor: pointer;
}
.x-eventDetail .x-title-wrapper .x-btn-wrapper:focus {
  outline: none;
}
.x-eventDetail .x-title-wrapper .x-text-btn--active {
  position: relative;
  border-bottom: none;
  z-index: 3;
  background: #fff;
}
.x-eventDetail .x-title-wrapper .x-icon-h2h {
  display: inline-block;
  vertical-align: middle;
  padding-right: 12px;
  color: #353a45;
}
.x-eventDetail .x-title-wrapper .x-icon-h2h::before {
  content: "\e61d";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-eventDetail .x-title-wrapper .x-icon-h2h.active {
  color: var(--brand-secondary);
}
.x-eventDetail .x-title-wrapper .x-icon-h2h.active em::before {
  content: "\e62d";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-eventDetail .x-title-wrapper .x-icon-h2h.active em::before {
  position: absolute;
  font-size: 10px;
}
.x-eventDetail .x-title-wrapper .x-icon-h2h:hover {
  cursor: pointer;
}
.x-eventDetail .x-list-wrapper {
  position: absolute;
  right: 0px;
  background: #fff;
  z-index: 2;
  border: 1px solid #eaecef;
  padding: 8px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 400px;
  right: 0;
  border-radius: 2px;
}
.x-eventDetail .x-list-wrapper .x-list {
  color: #353a45;
  font-size: 12px;
  line-height: 14px;
  border-bottom: 1px solid #eaecef;
}
.x-eventDetail .x-list-wrapper .x-list:last-of-type {
  border-bottom: none;
}
.x-eventDetail .x-list-wrapper .x-list .x-info--live {
  line-height: 14px;
  font-size: 10px;
  font-weight: 500;
  color: #9ca0ab;
  padding-top: 3px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-eventDetail .x-list-wrapper .x-list .x-icon--live {
  background: #33ea6a;
  color: #353a45;
  position: relative;
  margin-right: 10px;
}
.x-eventDetail .x-list-wrapper .x-list .x-icon--live:after {
  position: absolute;
  top: 0;
  right: -6px;
  content: "";
  width: 0;
  height: 0;
  border-top: 7px solid #33ea6a;
  border-left: 3px solid #33ea6a;
  border-right: 3px solid transparent;
  border-bottom: 7px solid transparent;
}
.x-eventDetail .x-list-wrapper .x-list .x-info-wrapper {
  display: table;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding-bottom: 8px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-eventDetail .x-list-wrapper .x-list .x-info-wrapper .x-name,
.x-eventDetail .x-list-wrapper .x-list .x-info-wrapper .x-score {
  display: table-cell;
  vertical-align: middle;
}
.x-eventDetail .x-list-wrapper .x-list .x-info-wrapper .x-name {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-width: 1%;
  max-width: calc(100% - 90px);
  line-height: 16px;
  font-size: 12px;
  font-weight: 500;
  color: #1b1e25;
}
.x-eventDetail .x-list-wrapper .x-list .x-info-wrapper .x-score {
  font-size: 12px;
  line-height: 16px;
  text-align: right;
  color: #33ea6a;
  max-width: 90px;
}
.x-eventDetail .x-list-wrapper .x-list .x-info-wrapper .x-score > div {
  display: inline-block;
  vertical-align: middle;
}
.x-eventDetail .x-list-wrapper .x-list .x-info-wrapper .x-score > div > span {
  margin-right: 10px;
}
.x-eventDetail .x-list-wrapper .x-list .x-info-wrapper .x-score > div > span:last-of-type,
.x-eventDetail
  .x-list-wrapper
  .x-list
  .x-info-wrapper
  .x-score
  > div
  > span:only-of-type {
  margin-right: 0;
}
.x-eventDetail .x-list-wrapper .x-list .x-info-wrapper .x-icon-more {
  display: inline-block;
  vertical-align: middle;
  text-align: right;
  line-height: 16px;
}
.x-eventDetail .x-list-wrapper .x-list .x-info-wrapper .x-icon-more::before {
  content: "\e608";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-eventDetail .x-list-wrapper .x-list .x-info-wrapper .x-icon-more:before {
  color: #b4b4b4;
  font-size: 10px;
}
.x-eventDetail .x-list-wrapper .x-list:hover {
  background: #f8f8f8;
}
.x-eventDetail .x-list-wrapper .x-list:active {
  color: var(--brand-secondary);
}
.x-eventDetail .x-list-wrapper .x-list--active .x-name {
  color: var(--brand-secondary) !important;
}
.x-eventDetail .x-list-wrapper .x-info-wrapper-fix {
  padding-top: 8px;
}
.x-eventDetail .x-list-wrapper .x-info-wrapper-fix .x-name {
  max-width: calc(100% - 20px) !important;
}
.x-eventDetail .delayed-settlement {
  font-size: 12px;
  color: #9ca0ab;
  padding-left: 8px;
  display: inline-block;
  line-height: 12px;
}
.x-eventDetail .delayed-settlement > img {
  vertical-align: top;
}
.x-eventDetail {
  border: 1px solid #b4b4b4;
  -webkit-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.11);
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.11);
}
.x-eventDetail .x-detail-wrapper .x-nav .x-nav-item > div {
  color: #353a45 !important;
}
.x-eventDetail .x-detail-wrapper .x-nav .x-nav-item:hover {
  cursor: pointer;
}
.x-eventDetail .x-detail-wrapper .x-table-header-title {
  color: #353a45;
}
.x-eventDetail .x-detail-wrapper .x-icon--bg {
  background: #eaecef;
}
.x-eventDetail .x-table--col .x-table-row .x-outcome-title {
  background: #096b27 !important;
  font-size: 12px;
}
.x-eventDetail .x-table--col .x-table-row:first-of-type {
  background: #f2f3f5 !important;
  padding: 5px 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-eventDetail .x-table--col .x-table-row:first-of-type .x-outcome-title {
  color: #353a45;
  line-height: 16px;
  margin-bottom: 0;
  height: auto;
  background: transparent !important;
}
.x-eventDetail .x-table--col .x-table-row:nth-of-type(2) {
  padding-top: 8px;
}
.x-eventDetail .x-detail-error .x-error-msg {
  color: #353a45 !important;
}
.x-eventDetail .x-outcome .x-table-cell--disable,
.x-eventDetail .x-outcome .x-table-cell--disable:hover,
.x-eventDetail .x-outcome .x-table-cell--disable:active {
  background: #dcdee5 !important;
  color: #9ca0ab !important;
}
@-webkit-keyframes logoLoading {
  0% {
    -webkit-transform: scale(1) translateZ(0);
    transform: scale(1) translateZ(0);
  }
  37.5% {
    -webkit-transform: scale(0.8) translateZ(0);
    transform: scale(0.8) translateZ(0);
  }
  62.5% {
    -webkit-transform: scale(0.6) translateZ(0);
    transform: scale(0.6) translateZ(0);
  }
  87.5% {
    -webkit-transform: scale(0.5) translateZ(0);
    transform: scale(0.5) translateZ(0);
  }
  100% {
    -webkit-transform: scale(0.4) translateZ(0);
    transform: scale(0.4) translateZ(0);
  }
}
@keyframes logoLoading {
  0% {
    -webkit-transform: scale(1) translateZ(0);
    transform: scale(1) translateZ(0);
  }
  37.5% {
    -webkit-transform: scale(0.8) translateZ(0);
    transform: scale(0.8) translateZ(0);
  }
  62.5% {
    -webkit-transform: scale(0.6) translateZ(0);
    transform: scale(0.6) translateZ(0);
  }
  87.5% {
    -webkit-transform: scale(0.5) translateZ(0);
    transform: scale(0.5) translateZ(0);
  }
  100% {
    -webkit-transform: scale(0.4) translateZ(0);
    transform: scale(0.4) translateZ(0);
  }
}
.x-eventDetail .x-error-wrapper {
  height: 300px;
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
.x-eventDetail .x-error-wrapper > div {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
.x-eventDetail .x-error-wrapper .x-icon-loading {
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
.x-eventDetail .x-error-wrapper .x-icon-loading::before {
  content: "\e610";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-eventDetail .x-error-wrapper .x-icon-loading:before {
  font-size: 28px;
}
.x-eventDetail .x-error-wrapper .x-text-msg {
  color: #353a45;
  font-size: 12px;
  line-height: 16px;
}
.x-eventDetail .x-error-wrapper-fix {
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -webkit-box-align: start;
  -webkit-align-items: flex-start;
  -ms-flex-align: start;
  align-items: flex-start;
}
.x-eventDetail .x-error-wrapper-fix > div {
  text-align: left;
  vertical-align: top;
  padding: 30px 40px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-eventDetail .x-error-wrapper-fix .x-error-title {
  font-size: 64px;
  color: #9ca0ab;
  line-height: 87px;
}
.x-eventDetail .x-error-wrapper-fix .x-error-msg {
  display: block;
  font-size: 14px;
  line-height: 19px;
  color: #353a45;
  margin: 4px 0 18px;
}
.x-eventDetail .x-error-wrapper-fix .af-button {
  background: var(--brand-secondary) !important;
  color: #fff !important;
  width: 65px;
  height: 32px;
  font-size: 12px;
  border: none;
  padding: 0 !important;
}
.x-eventDetail .x-error-wrapper-fix .af-button:hover {
  background: #32ce62 !important;
}

.x-eventDetail .x-list-wrapper .x-error-wrapper {
  height: 267px;
}
.x-eventDetail .x-list-wrapper .x-error-msg {
  margin: 0 !important;
}
.x-eventDetail .x-list-wrapper .x-error-wrapper-fix {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}

.x-text-second {
  font-size: 13px;
  line-height: 1;
}
.x-table .x-table-cell-item {
  display: inline-block;
  height: 100%;
  font-size: 14px;
}
.x-table .x-outcome-title {
  background: transparent !important;
  color: #fff;
  font-size: 14px;
  height: 25px;
  text-align: center;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.x-table .x-table--col .x-table-row .x-table-cel:first-of-type {
  max-width: 114px;
}
.x-detail-wrapper .x-table .x-table-row {
  -webkit-align-content: stretch;
  -ms-flex-line-pack: stretch;
  align-content: stretch;
  border-collapse: separate;
  border-spacing: 2px;
}
.x-table__wrapper {
  margin: 0 -2px;
}
.x-table__wrapper:first-of-type .x-table-header {
  border-top: none;
}
.x-table-header {
  cursor: pointer;
  height: 38px;
  border-top: 1px solid rgba(180, 180, 180, 0.5);
  padding: 0 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-table-header .x-icon--bg {
  background: rgba(180, 180, 180, 0.5);
  width: 16px;
  height: 16px;
  border-radius: 2px;
}
.x-table-header .x-table-row {
  height: 100%;
  padding: 10px 0 9px 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-table-header .x-table-cell {
  color: #fff;
  line-height: 19px;
  vertical-align: middle;
  width: calc(100% - 60px);
}
.x-table-header .x-table-cell:last-of-type {
  text-align: right;
  width: 60px;
}
.x-table-header .x-icon--bg,
.x-table-header .x-tips,
.x-table-header .x-table-header-title {
  display: inline-block;
  vertical-align: middle;
}
.x-table-header .x-table-cell-item {
  padding: 5px 8px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-table-header:hover {
  background: rgba(255, 255, 255, 0.1);
}
.x-table-header:hover .x-icon-priority {
  display: inline-block;
}
.x-table-header .x-icon-priority {
  display: none;
}
.x-table-header .x-table-header-title {
  font-size: 14px;
  /* font-weight: bold; */
  margin-left: 6px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: calc(100% - 36px);
}
.x-table-header .x-icon--unfold,
.x-table-header .x-icon--fold {
  text-align: center;
}
.x-table-header .x-icon--unfold:before,
.x-table-header .x-icon--fold:before {
  color: var(--brand-secondary);
  font-size: 10px !important;
  display: inline-block;
}
.x-table-header .x-icon--unfold:hover,
.x-table-header .x-icon--fold:hover {
  cursor: pointer;
}
.x-table-header .x-icon--unfold::before {
  content: "\e6a3";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-table-header .x-icon--unfold:before {
  -webkit-transform: translate3d(0, -2px, 0) rotate(-90deg);
  transform: translate3d(0, -2px, 0) rotate(-90deg);
}
.x-table-header .x-icon--fold::before {
  content: "\e6a3";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-table-header .x-icon--fold:before {
  -webkit-transform: translate3d(0, -1px, 0);
  transform: translate3d(0, -1px, 0);
}
.x-table-header .x-icon-priority {
  width: 16px;
  height: 16px;
  line-height: 16px;
  padding: 1px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 2px;
  background: rgba(234, 236, 239, 0.15);
}
.x-table-header .x-icon-priority::before {
  content: "\e60c";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-table-header .x-icon-priority:before {
  color: #32ce62;
  font-size: 14px;
}
.x-table-header .x-icon-priority:hover {
  cursor: pointer;
}
.x-table-header .x-icon-priority--checked {
  width: 16px;
  height: 16px;
  line-height: 16px;
  padding: 1px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 2px;
  background: #096b27;
  display: inline-block;
}
.x-table-header .x-icon-priority--checked::before {
  content: "\e60c";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-table-header .x-icon-priority--checked:before {
  color: #353a45;
  font-size: 14px;
}
.x-table-header .x-icon-priority--checked:hover {
  cursor: pointer;
}
.x-table-header .x-tips {
  height: 19px;
  margin-left: 4px;
}
.x-table-header .x-tips .x-popOver-wrapper {
  max-width: 380px !important;
}
.x-table-header .x-tips .x-popOver-content {
  white-space: normal;
}
.x-table-header .x-tips:hover {
  cursor: pointer;
}
.x-table-header .x-icon-tips::before {
  content: "\e651";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-table-header .x-icon-tips:before {
  color: #9ca0ab;
  font-size: 10px;
}
.x-table-header .x-popOver-wrapper {
  padding: 6px 5px !important;
  border: none;
  margin-bottom: 10px;
}
.x-table-header .x-popOver-wrapper .x-popOver-content {
  font-size: 10px !important;
}
.x-table-header .x-popOver-wrapper .x-popOver-arrow {
  height: 8px;
  width: 8px;
  border: none;
}
.x-table-header .x-popOver-wrapper .x-popOver-arrow--bottom {
  top: -4px !important;
}
.x-outcome {
  padding-bottom: 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-outcome .x-table-cell {
  vertical-align: middle;
  margin: 0 2px;
  position: relative;
  padding: 7px 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: var(--brand-prematch-odds-bg);
  color: #fff;
  border-radius: 4px;
}
.x-outcome .x-table-cell:last-of-type {
  margin-right: 0;
}
.x-outcome .x-outcome-title {
  text-align: right;
  height: 32px;
  margin-bottom: 0;
}
.x-outcome .x-table-cell-item {
  font-size: 12px;
  overflow: hidden;
}
.x-outcome .x-table-cell-item.x-icon-arrow--up:before,
.x-outcome .x-table-cell-item.x-icon-arrow--down:before {
  color: inherit;
  -webkit-transform-origin: top right;
  -ms-transform-origin: top right;
  transform-origin: top right;
  -webkit-transform: scale(0.6);
  -ms-transform: scale(0.6);
  transform: scale(0.6);
  font-size: 10px;
  line-height: 1;
  position: absolute;
  top: 2px;
  right: 2px;
}
.x-outcome .x-table-cell-item.x-icon-arrow--up::before {
  content: "\e609";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-outcome .x-table-cell-item.x-icon-arrow--down::before {
  content: "\e605";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-outcome .x-table-cell-item:first-of-type {
  max-width: calc(100% - 65px);
}
.x-outcome .x-table-cell-item:last-of-type {
  max-width: 65px;
  float: right;
  /* font-weight: bold; */
  text-align: right;
  padding-left: 5px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-outcome .x-table-cell-item:only-of-type {
  text-align: center;
  min-width: 100%;
}
.x-outcome .x-icon-lock::before {
  content: "\e647";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.x-outcome .x-icon-lock:before {
  color: #9ca0ab;
  line-height: 1;
  display: inline-block;
  vertical-align: top;
  margin-top: 1px;
}
.x-outcome .x-table-cell--checked {
  background: var(--brand-active-prematch-odds-bg);
  color: var(--brand-active-prematch-odds-text);
}
.x-outcome .x-table-cell--responsive:hover {
  /* background: #32ce62; */
  cursor: pointer;
}
.x-outcome .x-table-cell--transparent {
  background: transparent !important;
}
.x-outcome .x-table-cell--disable,
.x-outcome .x-table-cell--disable:hover,
.x-outcome .x-table-cell--disable:active {
  background: rgba(255, 255, 255, 0.15);
  color: #9ca0ab;
}
.x-table__wrapper {
  position: relative;
}
.x-table__wrapper:last-of-type .x-outcome {
  border-bottom: none;
}
</style>
