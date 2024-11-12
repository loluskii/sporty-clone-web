<template>
  <LiveLayout>
    <template v-slot:top>
      <div><span data-cms-key="multi_view" data-cms-page="live">Multi View</span></div>
    </template>
    <!-- Main Content -->
    <div class="x-table-row">
      <div class="x-table-cell x-main-mid" style="width: 765px; min-width: 765px">
        <div>
          <div>
            <div class="x-overview">
              <div class="sport-name">
                <div
                  v-for="(sport, index) in sportList.slice(0, 5)"
                  :key="index"
                  :class="sport.sportID === activeSportID ? 'active' : ''"
                  class="sport-name-item"
                  @click="setActiveSport(sport.sportID)"
                >
                  <div class="text">{{ sport.sportName }}</div>
                </div>
                <div
                  class="simple-select-wrap sport-simple-select"
                  :class="{
                    'simple-select-wrap-expand': showMoreSportsMenu,
                    'sport-simple-select-active': MoreSportsLabel !== 'More Sports',
                  }"
                >
                  <div class="select-title" @click="toggleMoreSports">
                    <p class="select-title__label">{{ MoreSportsLabel }}</p>
                    <span class="arrow-icon arrow-icon-down"></span>
                  </div>
                  <div class="select-list" v-if="showMoreSportsMenu">
                    <div
                      :data-index="s"
                      v-for="(sport, s) in sportList.slice(5)"
                      :key="s"
                      @click="setActiveSport(sport)"
                      class="select-item"
                    >
                      {{ sport.sportName }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="isLoading">
                <LoadingSpinner />
              </div>
              <div v-else class="match">
                <div
                  class="x-table match-table live-table"
                  v-if="Object.keys(filteredLiveData).length > 0"
                >
                  <template v-for="(liveGroup, g) in filteredLiveData" :key="g">
                    <div class="x-table-row league-row">
                      <div class="x-table-cell league">
                        {{ liveGroup[0].categoryName }} {{ g }}
                      </div>
                      <div class="x-table-cell each-module-wrap each-module-two-line">
                        <div class="market-desc-wrap">
                          <div
                            v-for="(market, m) in activeSportMarkets"
                            :key="m"
                            class="market-desc"
                            :style="
                              activeSportMarkets.length > 1 ? 'width: 50%' : 'width: 100%'
                            "
                          >
                            {{ market.marketName }}
                          </div>
                        </div>
                        <div>
                          <div
                            v-for="(market, m) in activeSportMarkets"
                            :key="m"
                            class="each-module-table"
                            :class="activeSportMarkets.length > 1 ? 'two-markets' : ''"
                          >
                            <div v-if="market.specifier !== ''" class="each-module">
                              {{ market.specifier }}
                            </div>
                            <template
                              :key="o"
                              v-for="(outcome, o) in _.sortBy(
                                market.outcomes,
                                'outcomeID'
                              )"
                            >
                              <div class="each-module">{{ outcome.outcomeName }}</div>
                            </template>
                          </div>
                        </div>
                      </div>
                      <div class="x-table-cell"></div>
                    </div>
                    <Fixture
                      v-for="(match, m) in liveGroup"
                      :key="m"
                      :match="match"
                      :activeMarkets="activeSportMarkets"
                    ></Fixture>
                  </template>
                </div>
                <div v-else class="x-sport-bet-no-data">
                  <div style="white-space: pre-line">
                    Sorry, there are no games currently<br />available in this category.
                    Please try later.<br />Thank you.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="x-table-cell x-main-right" style="width: 235px; min-width: 235px">
        <div>
          <aside class="c-right">
            <div v-if="!userStore.currentUser" class="x-item">
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
import { defineComponent, ref, computed, onMounted } from "vue";
import { useQuery } from "vue-query";
import _ from "lodash";
import LiveLayout from "@/components/Shared/LiveLayout.vue";
import BetContainer from "@/components/Shared/BetContainer.vue";
import Fixture from "@/components/Live/Fixture.vue";
import LoadingSpinner from "@/components/Loaders/LoadingSpinner.vue";
import { useUsersStore, useUtilsStore } from "@/stores";
import { getLiveHighlights } from "@/helpers";
import emitter from "@/plugins/emitter";

const activeSportID = ref(1);
const completeData = ref([]);
const marketGroup = ref([]);
const isEmptyResponse = ref(false);
const showMoreSportsMenu = ref(false);
const MoreSportsLabel = ref("More Sports");
const utilsStore = useUtilsStore();
const userStore = useUsersStore();

const { data, error, isLoading, refetch } = useQuery("liveData", getLiveHighlights, {
  refetchInterval: 25000, // 25 seconds in milliseconds
  onError: (err) => console.error(err),
  onSuccess: (response) => {
    if (response.fixtures) {
      if (completeData.value.length === 0) {
        completeData.value = response.fixtures;
        marketGroup.value = response.markets.filter((m) => m.specifier == "");
        utilsStore.liveListSingleMatch = response.fixtures[0].matchID
      } else {
        response.fixtures.forEach((newFixture) => {
          const index = completeData.value.findIndex(
            (oldFixture) => oldFixture.matchID === newFixture.matchID
          );
          if (index !== -1) {
            completeData.value[index] = newFixture;
          } else {
            completeData.value.push(newFixture);
          }
        });
      }
    } else {
      isEmptyResponse.value = !completeData.value.length;
    }
  },
});

const sportList = computed(() => utilsStore.sportsMenu);
const filteredLiveData = computed(() => {
  const filtered = completeData.value.filter((s) => s.sportID == activeSportID.value);
  return _.groupBy(filtered, "tournament");
});
const activeSportMarkets = computed(() => {
  const data = marketGroup.value
    .filter((s) => s.sportID == activeSportID.value)
    .sort((a, b) => a.marketID - b.marketID);
  return data.slice(0, 2);
});

function setActiveSport(sport) {
  if (typeof sport === "object") {
    MoreSportsLabel.value = sport.sportName;
    activeSportID.value = sport.sportID;
    showMoreSportsMenu.value = false;
  } else {
    activeSportID.value = sport;
    MoreSportsLabel.value = "More Sports";
  }
}

const toggleMoreSports = () => {
  showMoreSportsMenu.value = !showMoreSportsMenu.value;
};

function showRegisterModal() {
  emitter.emit("showDialog", { dialogType: "auth", dialogData: "register" });
}

onMounted(async () => {
  // No need to call getLiveFixtures here, vue-query handles data fetching and refreshing
});

defineComponent({
  components: { LoadingSpinner },
  methods: {
    handleManualRefetch() {
      refetch();
    },
  },
});
</script>

<style>
.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.x-overview {
  width: 745px;
  margin-right: 15px;
  background-color: #353a45;
  color: #fff;
}
.x-overview .sport-name {
  cursor: pointer;
  margin: 0 10px;
  padding-left: 3px;
  border-bottom: 1px solid rgba(234, 236, 239, 0.15);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
.x-overview .sport-name:after {
  clear: both;
  content: ".";
  display: block;
  height: 0;
  visibility: hidden;
}
.x-overview .sport-name .sport-name-item {
  height: 48px;
  line-height: 48px;
  padding: 0 15px;
  margin-bottom: -1px;
}
.x-overview .sport-name .sport-name-item .text {
  font-size: 14px;
  white-space: nowrap;
  color: #fff;
}

.x-overview .sport-name .sport-name-item.active {
  font-weight: 700;
  border-bottom: 4px solid var(--brand-secondary);
}
.x-overview .sport-name .sport-simple-select {
  height: 48px;
  line-height: 48px;
  color: #fff;
  width: 130px;
  font-size: 14px;
  margin-bottom: -1px;
  background-color: #353a45;
}

.x-overview .sport-name .sport-simple-select .select-item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.x-overview .sport-name .sport-simple-select-active {
  border-bottom: 4px solid var(--brand-secondary);
}
.x-overview .match {
  position: relative;
  text-align: center;
  padding: 0 10px 10px 10px;
}

.x-overview .match .af-select-title {
  -webkit-box-shadow: -1px 0px 0px 0px #1b1e25 inset !important;
  box-shadow: -1px 0px 0px 0px #1b1e25 inset !important;
}
.x-overview .match .af-select-item {
  color: #353a45;
}
.x-overview .match .af-select-item.active {
  color: #fff;
  background: #33ea6a;
}
.x-overview .match .af-select-item:hover {
  color: #fff;
  background: #051c9e;
}
.x-overview .match .match-table {
  border-bottom: 1px solid rgba(234, 236, 239, 0.15);
}
.x-overview .match .match-table .x-table-cell {
  font-size: 12px;
}
.x-overview .match .match-table .league-row {
  text-align: left;
  border-top: 1px solid rgba(234, 236, 239, 0.15);
  height: 36px;
  line-height: 36px;
  table-layout: fixed;
  -webkit-align-content: center;
  -ms-flex-line-pack: center;
  align-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  vertical-align: middle;
}
.x-overview .match .match-table .league-row:first-child {
  border-top: 0px;
}
.x-overview .match .match-table .league-row .league {
  text-align: left;
  width: 295px;
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  font-size: 16px;
  /* font-weight: bold; */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.x-overview .match .match-table .league-row .each-module-wrap {
  text-align: left;
  width: 370px;
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  white-space: nowrap;
  color: #9ca0ab;
}
.x-overview .match .match-table .league-row .each-module-wrap .each-module-table {
  display: inline-table;
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  table-layout: fixed;
  width: 100%;
}
.x-overview
  .match
  .match-table
  .league-row
  .each-module-wrap
  .each-module-table.two-markets {
  width: 50%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-overview
  .match
  .match-table
  .league-row
  .each-module-wrap
  .each-module-table.two-markets:first-child {
  padding-right: 2px;
}
.x-overview
  .match
  .match-table
  .league-row
  .each-module-wrap
  .each-module-table.two-markets:last-child {
  padding-left: 2px;
}
.x-overview
  .match
  .match-table
  .league-row
  .each-module-wrap
  .each-module-table
  .each-module {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-width: 1%;
  display: table-cell;
  text-align: center;
  font-size: 12px;
}
.x-overview
  .match
  .match-table
  .league-row
  .each-module-wrap
  .each-module-table
  .each-module:last-child {
  margin-right: 0px;
}
.x-overview .match .match-table .league-row .each-module-wrap.each-module-two-line {
  line-height: 1;
}
.x-overview
  .match
  .match-table
  .league-row
  .each-module-wrap.each-module-two-line
  .market-desc-wrap:after {
  clear: both;
  content: ".";
  display: block;
  height: 0;
  visibility: hidden;
}
.x-overview
  .match
  .match-table
  .league-row
  .each-module-wrap.each-module-two-line
  .market-desc-wrap
  .market-desc {
  display: block;
  float: left;
  width: 50%;
  text-align: center;
  line-height: 1px;
  padding: 3px 0;
  font-size: 12px;
  line-height: 1;
  line-height: 12px;
  font-weight: 700;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-overview
  .match
  .match-table
  .league-row
  .each-module-wrap.each-module-two-line
  .market-desc-wrap
  .market-desc:first-child {
  padding-right: 2px;
}
.x-overview
  .match
  .match-table
  .league-row
  .each-module-wrap.each-module-two-line
  .market-desc-wrap
  .market-desc:last-child {
  padding-left: 2px;
}
.x-overview
  .match
  .match-table
  .league-row
  .each-module-wrap.each-module-two-line
  .each-module-table {
  height: 14px;
  line-height: 14px;
}
.x-overview
  .match
  .match-table
  .league-row
  .each-module-wrap.each-module-two-line
  .each-module-table
  .each-module {
  background-color: rgba(234, 236, 239, 0.15);
}
.x-overview .match .match-table .match-row {
  cursor: pointer;
  text-align: left;
  position: relative;
  border-top: 1px solid rgba(234, 236, 239, 0.15);
  height: 50px;
  font-size: 12px;
  -webkit-align-content: center;
  -ms-flex-line-pack: center;
  align-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  table-layout: fixed;
}
.x-overview .match .match-table .match-row:before,
.x-overview .match .match-table .match-row:after {
  width: 78px;
  height: 1px;
  display: block;
  content: " ";
  background-color: #353a45;
  left: 0;
  top: -1px;
  position: absolute;
}
.x-overview .match .match-table .match-row:after {
  top: auto;
  bottom: -1px;
}
.x-overview .match .match-table .match-row .left-team-cell {
  width: 295px;
  position: relative;
}
.x-overview .match .match-table .match-row .left-team-cell .left-arrow {
  position: absolute;
  left: -10px;
  top: 0px;
  height: 50px;
  overflow: hidden;
  fill: var(--brand-secondary);
}
.x-overview .match .match-table .match-row .left-team-cell .left-team-table {
  display: inline-table;
  width: 100%;
  table-layout: fixed;
  height: 50px;
}
.x-overview .match .match-table .match-row .left-team-cell .left-team-table > div {
  display: table-cell;
  vertical-align: middle;
}
.x-overview .match .match-table .match-row .left-team-cell .left-team-table .time {
  width: 78px;
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  line-height: 1;
  padding-left: 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-align: left;
}
.x-overview
  .match
  .match-table
  .match-row
  .left-team-cell
  .left-team-table
  .time
  .clock-time {
  padding-bottom: 4px;
}
.x-overview
  .match
  .match-table
  .match-row
  .left-team-cell
  .left-team-table
  .time
  .game-id {
  font-weight: 500;
  color: #d8d8d8;
}
.x-overview .match .match-table .match-row .left-team-cell .left-team-table .teams {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  /* color: #fca311; */
}
.x-overview .match .match-table .match-row .left-team-cell .left-team-table .teams > div {
  overflow: hidden;
  text-overflow: ellipsis;
  /* font-weight: 500; */
  line-height: 1;
  white-space: nowrap;
  display: block;
}
.x-overview
  .match
  .match-table
  .match-row
  .left-team-cell
  .left-team-table
  .teams
  > div:first-child {
  padding-bottom: 4px;
}
.x-overview .match .match-table .match-row .left-team-cell .left-team-table .score {
  width: 30px;
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  padding-left: 10px;
}
.x-overview .match .match-table .match-row .left-team-cell .left-team-table .game-score,
.x-overview .match .match-table .match-row .left-team-cell .left-team-table .point {
  color: #dcdee5;
  opacity: 0.5;
  width: 30px;
}
.x-overview .match .match-table .match-row .x-table-cell {
  vertical-align: middle;
}
.x-overview .match .match-table .match-row .market-cell {
  width: 370px;
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
}
.x-overview .match .match-table .match-row .market-cell.two-markets .market {
  width: 50%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.x-overview .match .match-table .match-row .market-cell.two-markets .market:first-child {
  padding-right: 2px;
}
.x-overview .match .match-table .match-row .market-cell.two-markets .market:last-child {
  padding-left: 2px;
}
.x-overview .match .match-table .match-row .market-size {
  font-weight: 500;
  text-align: center;
  line-height: 50px;
  width: 60px;
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  text-align: right;
}
.x-overview .match .match-table .match-row .market-size:after {
  content: "\e608";
  font-family: "iconfont";
  font-weight: 700;
  display: inline-block;
  text-indent: 10px;
  color: var(--brand-secondary);
}
.x-overview .match .match-table .tennis-row .score,
.x-overview .match .match-table .tennis-row .game-score,
.x-overview .match .match-table .tennis-row .point {
  width: 30px;
}
.x-overview .match .match-table .tennis-row .score {
  padding-left: 10px;
}
.x-overview .match .match-table .tennis-row .game-score {
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
}
.x-overview .match .match-table .tennis-row .point {
  text-align: left;
  -webkit-box-flex: 0;
  -webkit-flex: 0 1 auto;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
}
.x-overview .match .match-table .cricket-row .teams {
  padding-left: 15px;
}
.x-overview .x-sport-bet-no-data,
.x-overview .x-sport-bet-err {
  text-align: left;
  color: #dcdee5;
  font-size: 14px;
  margin: 0 auto;
  display: inline-block;
  padding: 75px 0;
}
.x-overview .x-sport-bet-no-data p,
.x-overview .x-sport-bet-err p {
  word-break: keep-all;
  white-space: nowrap;
}
.af-select-list {
  border: 1px solid #eaecef;
}
.af-select-list .af-select-item {
  color: #353a45;
  cursor: pointer;
}
.af-select-list .af-select-item.active {
  color: #fff;
  background: #33ea6a;
}
.af-select-list .af-select-item:hover {
  color: #fff;
  background: #051c9e;
}

/*  */
.simple-select-wrap {
  position: relative;
  height: 48px;
  line-height: 48px;
  color: #fff;
  font-size: 14px;
  background-color: #353a45;
  cursor: pointer;
}
.simple-select-wrap .select-title,
.simple-select-wrap .select-list {
  border: solid 1px transparent;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.simple-select-wrap.simple-select-wrap-expand {
  -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.12);
}
.simple-select-wrap.simple-select-wrap-expand .select-title,
.simple-select-wrap.simple-select-wrap-expand .select-list {
  border: solid 1px rgba(234, 236, 239, 0.15);
  border-radius: 2px;
  background-color: #353a45;
}
.simple-select-wrap.simple-select-wrap-expand .select-title {
  border-bottom-color: transparent;
}
.simple-select-wrap.simple-select-wrap-expand .select-list {
  border-top-color: transparent;
}
.simple-select-wrap .select-title {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  position: relative;
  padding-left: 10px;
  height: 48px;
  line-height: 46px;
}
.simple-select-wrap .select-title .arrow-icon {
  width: 28px;
  height: 46px;
  z-index: 10;
  text-align: center;
  background-color: #353a45;
  color: #9ca0ab;
}
.simple-select-wrap .select-title .arrow-icon-up::before {
  content: "\e6a5";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.simple-select-wrap .select-title .arrow-icon-down::before {
  content: "\e603";
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.simple-select-wrap .select-title__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.simple-select-wrap .select-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 47px;
  z-index: 100;
}
.simple-select-wrap .select-item {
  line-height: 48px;
  height: 48px;
  padding: 0 10px;
  cursor: pointer;
}
/* .simple-select-wrap .select-item:hover {
  background-color: #096b27;
}
.simple-select-wrap .select-item.select-item-active {
  background-color: #096b27;
} */
</style>
