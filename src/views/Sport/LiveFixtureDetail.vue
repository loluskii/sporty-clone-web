<template>
  <LiveLayout>
    <template v-slot:top>
      <div><span data-cms-key="multi_view" data-cms-page="live">Single View</span></div>
    </template>
    <!-- Main Content -->
    <div class="x-table-row">
      <div class="x-table-cell x-main-mid" style="width: 765px; min-width: 765px">
        <div>
          <div class="x-eventview">
            <div>
              <aside class="x-side-bar">
                <div class="x-side-mask"></div>
                <ul id="j_sport_wrapper" class="x-item-wrap">
                  <li
                    v-for="(sport, index) in sportList"
                    :class="sport.sportID === activeSportID ? 'x-item--active' : ''"
                    :key="index"
                    class="x-item"
                  >
                    <div class="x-sport">
                      <img
                        :src="getImageSrc(sport.sportID)"
                        style="height: 20px; margin-right: 0.4rem"
                        :style="
                          sport.sportID === activeSportID ? '' : 'filter: invert(1)'
                        "
                        alt=""
                        srcset=""
                      />
                      <span
                        ><span>{{ sport.sportName }}</span> <span></span
                      ></span>
                    </div>
                  </li>
                </ul>
              </aside>
              <section v-if="!isLoading || isRefreshing" class="x-eventDetail">
                <div class="x-tracker">
                  <h4 class="x-tracker-title">
                    <span>{{ eventDetail.name }}</span>
                  </h4>
                  <div class="x-live-wrapper">
                    <div class="x-result-wrapper">
                      <div class="x-result-title">
                        <span>{{
                          eventDetail.statusCode === 1 ? eventDetail.eventTime : "Ended"
                        }}</span>
                      </div>
                      <ul class="x-result-score">
                        <li>
                          <div class="x-label">
                            <span>{{ eventDetail.competitor1 }}</span>
                          </div>
                          <div class="x-value">
                            <span class="x-value-1">{{ eventDetail.homeScore }}</span>
                          </div>
                        </li>
                        <li>
                          <div class="x-label">
                            <span>{{ eventDetail.competitor2 }}</span>
                          </div>
                          <div class="x-value">
                            <span class="x-value-1">{{ eventDetail.awayScore }}</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="x-detail-wrapper">
                  <template v-if="eventDetail.markets && eventDetail.statusCode === 1">
                    <div
                      v-for="(market, index) in eventMarkets"
                      :key="index"
                      class="x-table__wrapper"
                    >
                      <div class="x-table x-table-header">
                        <div class="x-table-row">
                          <div
                            class="x-table-cell x-table-cell--responsive x-table-cell--transparent"
                          >
                            <i class="x-icon--bg x-icon--fold"></i>
                            <span class="x-table-header-title">{{
                              market.marketName
                            }}</span>
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
                            :style="
                              group.length === 2 ? 'width: 33.3333%' : 'width: 33.3333%'
                            "
                            @click="addToBetslip(outcome, market)"
                            :class="{
                              'x-table-cell--checked': isSelected(
                                createID(
                                  eventDetail.gameID,
                                  eventDetail.matchID,
                                  outcome.outcomeName,
                                  outcome.oddID,
                                  eventDetail.name
                                ),
                                couponStore.coupon
                              ),
                              'x-table-cell--disable': outcome.odds <= 1,
                            }"
                          >
                            <span
                              class="x-table-cell-item"
                              style="text-transform: capitalize"
                            >
                              {{
                                market.specifier !== ""
                                  ? outcome.outcomeName
                                  : outcome.displayName ?? outcome.outcomeName
                              }}
                            </span>
                            <span v-if="outcome.odds > 1" class="x-table-cell-item">{{
                              outcome.odds.toFixed(2)
                            }}</span>
                            <span v-else class="x-table-cell-item x-icon-lock"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <div v-else class="x-detail-error">
                    <div>
                      <span class="x-error-msg"
                        >Sorry, there are no markets currently available in this<br />category.
                        Please try later. Thank you.</span
                      >
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <div class="x-table-cell x-main-right" style="width: 235px; min-width: 235px">
        <div>
          <aside class="c-right">
            <div class="x-item">
              <div class="x-instant-reg x-instant-dark">
                <div class="x-title">
                  <span>Instant Registration</span>
                </div>
                <p class="x-pro-tips">Make a Deposit and Start Betting!</p>
                <div
                  tabindex="6"
                  class="x-input-wrapper x-input-group x-input-group--prepend"
                >
                  <div class="x-input-prepend"><span>+234</span></div>
                  <span class="x-input-com">
                    <input
                      type="input"
                      name=""
                      placeholder="Mobile Number"
                      onpaste="return true"
                      class="x-input fs-exclude"
                  /></span>
                </div>
                <div class="x-btn-wrapper">
                  <button
                    class="af-button af-button--primary"
                    @click.prevent="showRegisterModal"
                  >
                    <span><span>Register</span></span>
                  </button>
                </div>
              </div>
            </div>
            <BetContainer></BetContainer>
          </aside>
        </div>
      </div>
    </div>
  </LiveLayout>
</template>

<script setup>
import { defineComponent, watch, ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getFixtureMarkets,
  chunks,
  createID,
  isSelected,
  getLiveHighlights,
} from "@/helpers";
import LiveLayout from "@/components/Shared/LiveLayout.vue";
import BetContainer from "@/components/Shared/BetContainer.vue";
import _ from "lodash";
import LoadingSpinner from "@/components/Loaders/LoadingSpinner.vue";
import emitter from "@/plugins/emitter";
import { useCouponStore, useUtilsStore } from "@/stores";

const activeSportID = ref(1);
const eventMarkets = ref();
const eventDetail = ref();
const isLoading = ref(false);
const intervalId = ref(null);
const route = useRoute();
const router = useRouter();
const couponStore = useCouponStore();
const utilsStore = useUtilsStore();
const homeTeam = ref();
const awayTeam = ref();
const isRefreshing = ref(false);

const sportList = computed(() => {
  return utilsStore.sportsMenu;
});

// Helper function to sort arrays by a key
function sortByKey(array, key, ascending = true) {
  return array.slice().sort((a, b) => {
    const valA = parseInt(a[key], 10);
    const valB = parseInt(b[key], 10);

    if (isNaN(valA) || isNaN(valB)) {
      return 0;
    }

    return ascending ? valA - valB : valB - valA;
  });
}

// Function to fetch event details
async function getEventDetail(id) {
  isLoading.value = true;
  try {
    const res = await getFixtureMarkets(id);
    eventDetail.value = res;
    eventMarkets.value = res.markets;
    homeTeam.value = res.competitor1;
    awayTeam.value = res.competitor2;
    activeSportID.value = res.sportID;
    isLoading.value = false;
  } catch (error) {
    eventDetail.value = null;
    isLoading.value = false;
  }
}

async function refreshOutcomes(id) {
  try {
    const res = await getFixtureMarkets(id);
    
    // Update event details
    eventDetail.value = res;
    
    // Handle markets update
    if (res.markets) {
      eventMarkets.value = res.markets;
    } else if (res.statusCode !== 3 && eventMarkets.value) {
      // Only update odds if markets exist and game is not ended (status 3)
      eventMarkets.value = eventMarkets.value.map(market => ({
        ...market,
        outcomes: market.outcomes?.map(outcome => ({
          ...outcome,
          odds: 0
        })) || []
      }));
    }
  } catch (error) {
    console.error('Error refreshing outcomes:', error);
    // Don't null out eventDetail on every error - might be temporary
    isLoading.value = false;
  }
}

// Fetch data at 5-second intervals
function startInterval(eventId) {
  isRefreshing.value = true;
  // Clear any existing interval before starting a new one
  clearInterval(intervalId.value);
  intervalId.value = setInterval(() => {
    refreshOutcomes(eventId);
  }, 5000);
}

// Stop the interval when the component is destroyed
function stopInterval() {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
}

// Function to get live data
async function getLiveData() {
  isLoading.value = true;
  let eventId = utilsStore.liveListSingleMatch;
  if (eventId) {
    await getEventDetail(eventId);
    startInterval(eventId); // Start fetching event details every 5 seconds
  } else {
    stopInterval(); // Stop the interval if there's no eventId
    return router.push({ name: "live-view" });
  }
}

const getImageSrc = (sportId) => {
  const imageUrl = new URL(`../../assets/images/sports/${sportId}.png`, import.meta.url);
  return imageUrl;
};

// Watch for route changes
watch(
  () => [route.name, route.params.match_id],
  async ([routeName, eventId]) => {
    switch (routeName) {
      case "live-fixtures-specific-detail":
        await getEventDetail(eventId);
        startInterval(eventId);
        break;
      default:
        await getLiveData();
        break;
    }
  },
  { immediate: true }
);

// Lifecycle hooks
onMounted(() => {
  getLiveData();
});

onBeforeUnmount(() => {
  stopInterval();
});

// Chunk outcomes into smaller arrays
const getChunks = (outcomes, n) => {
  let x = uniqueOutcomes(outcomes);
  return _.chunk(x, n);
};

// Filter unique outcomes based on outcomeID
const uniqueOutcomes = (outcomes) => {
  return outcomes.filter(
    (outcome, index, self) =>
      index === self.findIndex((o) => o.outcomeID === outcome.outcomeID)
  );
};

// Add outcome to betslip
function addToBetslip(outcome, market) {
  if (outcome.odds < 1) return;
  const id = createID(
    eventDetail.value.gameID,
    eventDetail.value.matchID,
    outcome.outcomeName,
    outcome.oddID,
    eventDetail.value.name
  );
  const data = {
    fixture: eventDetail.value,
    market_name: market.marketName,
    market_id: market.marketID,
    ele_id: id,
    outcome: outcome,
    odds: outcome.odds,
    odd_id: outcome.oddID,
    odd_name: outcome.outcomeName,
    type: "live",
    event_id: eventDetail.value.gameID,
    specifier: market.specifier,
  };

  const existsInBetslip = isSelected(id, couponStore.coupon);
  return existsInBetslip
    ? couponStore.removeSelection(id)
    : couponStore.addToCoupon(data);
}

// Open fixture analysis in a new window
function showFixtureAnalysis(id) {
  return window.open(
    `https://s5.sir.sportradar.com/betradar/en/match/${id}`,
    "stats",
    "width=1078,height=768"
  );
}

// Show register modal
function showRegisterModal() {
  emitter.emit("showDialog", { dialogType: "auth", dialogData: "register" });
}

defineComponent({
  name: "fixture-detail",
});
</script>

<style scoped>
@import url("@/assets/css/live.css");

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
  color: #051c9e;
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
}
.x-outcome .x-table-cell--responsive:hover {
  background: var(--brand-prematch-odd-bg-hover);
  cursor: pointer;
}

.m-outcome .m-table-cell--responsive:hover {
  background: #32ce62;
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
