<template>
  <SportsLayout>
    <!-- <template #left-content>
      
    </template> -->
    <template #fixtures-list>
      <LiveInplay></LiveInplay>
      <div id="importMatch" class="import-match" style="position: relative">
        <div
          v-for="(tournament, index) in fixturesList"
          :key="index"
          class="match-league-wrap"
          style="position: relative"
        >
          <div class="match-league">
            <div class="league-title">
              <span class="dis-icon"><em></em></span>
              <span class="text">{{ tournament[0].categoryName }} {{ index }}</span>
            </div>

            <div class="market-group clearfix">
              <div
                v-for="(market, m) in marketsGroup.slice(0, 5)"
                :key="m"
                :class="market.marketID === activeMarket.marketID ? 'active' : ''"
                class="market-item"
                @click="selectMarket(market)"
              >
                {{ market.marketName }}
              </div>
              <!-- <div class="market-item">Double Chance</div>
              <div class="market-item">GG/NG</div>
              <div class="market-item">Draw No Bet</div> -->
              <div tabindex="0" class="market-item x-select-market">
                <div class="select-value">Other Markets<i class="x-icon-fold"></i></div>
                <ul class="select-list">
                  <li class="">Odd/Even</li>
                  <li class="">O/U 2.5 &amp; GG/NG</li>
                  <li class="">Handicap</li>
                </ul>
              </div>
            </div>
            <div class="x-table match-table">
              <template
                v-for="(fixture, f) in _.groupBy(
                  tournament,
                  (fixture) => fixture.date.split(' ')[0]
                )"
                :key="f"
              >
                <div class="x-table-row date-row">
                  <div class="x-table-cell date">{{ formatDate(f, 'DD/MM dddd') }}</div>
                  <div class="x-table-cell each-module-wrap">
                    <div class="each-module-table two-markets">
                      <div class="each-module is-multiline">1</div>
                      <div class="each-module is-multiline">X</div>
                      <div class="each-module is-multiline">2</div>
                    </div>
                    <div class="each-module-table two-markets">
                      <div class="each-module is-multiline">Goals</div>
                      <div class="each-module is-multiline">Over</div>
                      <div class="each-module is-multiline">Under</div>
                    </div>
                  </div>
                  <div class="print-element p-table-th">
                    <div class="id" data-cms-key="id">ID</div>
                    <div class="time" data-cms-key="time">Time</div>
                    <div class="event" data-cms-key="event">Event</div>
                  </div>
                  <div class="x-table-cell empty-cell"></div>
                </div>
                <div
                  v-for="(match, m) in fixture"
                  :key="m"
                  class="x-table-row x-content-row match-row"
                >
                  <div class="x-table-cell left-team-cell">
                    <div class="left-team-table">
                      <div class="time">
                        <div class="clock-time">{{ match.eventTime }}&nbsp;&nbsp;</div>
                        <div class="game-id">
                          <span class="game-id-label">ID: </span>{{ match.gameID }}
                        </div>
                      </div>
                      <div :title="match.event" class="teams">
                        <div class="home-team">{{ match.homeTeam }}</div>
                        <div class="away-team">{{ match.awayTeam }}</div>
                      </div>
                      <div class="lmt-icon"><em class="icon"></em></div>
                    </div>
                  </div>
                  <div class="x-table-cell market-cell two-markets">
                    <div class="x-market market">
                      <div class="x-outcome">
                        <span class="x-outcome-odds">1.13</span>
                      </div>
                      <div class="x-outcome">
                        <span class="x-outcome-odds">7.75</span>
                      </div>
                      <div class="x-outcome">
                        <span class="x-outcome-odds">11.50</span>
                      </div>
                    </div>
                    <div class="x-market market">
                      <div class="x-outcome specifiers-select">
                        <div tabindex="0" class="af-select">
                          <div data-op="label-odds-option" class="af-select-title">
                            <span class="af-select-input">4.5</span>
                            <span class="af-select-icon-item"><em class="icon">^</em></span>
                          </div>
                        </div>
                      </div>
                      <div class="x-outcome">
                        <span class="x-outcome-odds">1.96</span>
                      </div>
                      <div class="x-outcome">
                        <span class="x-outcome-odds">1.73</span>
                      </div>
                    </div>
                  </div>
                  <div class="x-table-cell market-size">+55</div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="pagination pagination">
          <span class="pageNum icon-prev"></span> <span class="pageNum">2</span
          ><span class="pageNum">3</span><span class="pageNum">4</span><span class="pageNum">5</span
          ><span class="pageNum">6</span><span class="pageNum">7</span
          ><span class="pageNum selected">8</span><span class="pageNum">9</span
          ><span class="pageNum">10</span><span class="pageNum">11</span>
          <span class="pageNum icon-next"></span>
        </div>
      </div>
    </template>
  </SportsLayout>
</template>
<script setup>
import SportsLayout from '@/components/Shared/SportsLayout.vue'
import LiveInplay from '@/components/LiveInplay.vue'
import { getSportHighlights, getToday2 } from '../helpers'
import { useRoute } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import _ from 'lodash'
import { getFixturesByTournamentId, formatDate } from '@/helpers'
import { useUtilsStore } from '@/stores'
// import $ from 'jquery'

const utilsStore = useUtilsStore()
const route = useRoute()
const fixturesList = ref([])

// const filterIsOpen = ref(false)
// const filterTime = ref(false)

// const filterTournament = ref(false)

const marketsGroup = ref({})
const activeMarket = ref({})

const isLoading = ref(false)
const loadingError = ref(false)

// const filterQuery = ref()

const getSportbyName = (name) => {
  return utilsStore.sportsMenu.find((x) => x.sportName == name)
}

watch(
  () => [route.params.tournament_id, route.params.sport, route.query.period],
  async ([tournament_id, sport, period]) => {
    // fixtures by tournament
    if (sport !== undefined && tournament_id !== undefined) {
      const { sportID } = getSportbyName(sport)
      await getTournamentFixtures(sportID, tournament_id)
    } else if (sport !== undefined) {
      // fixtures by sport
      // const { sportID } = getSportbyName(sport)
      await fetchActiveSport(1, period)
    }
  },
  { immediate: true } // Trigger the watch callback immediately on component mount
)

async function getTournamentFixtures(sid, tid) {
  isLoading.value = true
  try {
    const res = await getFixturesByTournamentId(tid, sid)
    fixturesList.value = _.groupBy(res.fixtures, 'tournament')
    marketsGroup.value = res.markets.filter((market) => market.specifier == '')
    activeMarket.value = marketsGroup.value[0]
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    loadingError.value = true
    console.error(error)
  }
}

async function fetchActiveSport(id, period = null) {
  isLoading.value = true
  try {
    if (period == 'today') {
      return await fetchTodayActiveSport(id)
    } else {
      const res = await getSportHighlights(id, period)
      fixturesList.value = _.groupBy(res.fixtures, 'tournament')
      marketsGroup.value = res.markets
      activeMarket.value = marketsGroup.value[0]
      isLoading.value = false
    }
  } catch (error) {
    isLoading.value = false
    loadingError.value = true
    console.error(error)
  }
}

async function fetchTodayActiveSport(id) {
  try {
    const res = await getToday2(id, 1)
    fixturesList.value = _.groupBy(res.fixtures, 'tournament')
    marketsGroup.value = res.markets.filter((market) => market.specifier == '')
    activeMarket.value = marketsGroup.value[0]
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    loadingError.value = true
    console.error(error)
  }
}

async function selectMarket(market) {
  activeMarket.value = market
}

const isScrolled = ref(false)
const isTop = ref(false)
const divPosition = ref(null)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
  const specificDiv = document.getElementById('m-sanp-nav-container')
  divPosition.value = specificDiv ? specificDiv.getBoundingClientRect().top : 0

  if (divPosition.value <= 59) {
    isTop.value = true
  } else {
    isTop.value = false
  }
}

// function choosePeriod() {
//   if (filterIsOpen.value) {
//     filterTime.value = false
//     $('.m-choose-bar').removeClass('m-choose-bar-show')
//     filterIsOpen.value = false
//   } else {
//     $('.m-choose-bar').addClass('m-choose-bar-show')
//     filterIsOpen.value = true
//     filterTime.value = true
//   }
// }

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
})
</script>

<style>
@media screen {
  .import-match {
    min-height: 358px;
    text-align: center;
  }
  .import-match .match-league-wrap {
    border: 1px solid #b4b4b4;
    -webkit-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.11);
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.11);
    margin-bottom: 10px;
  }
  .import-match .match-league {
    background-color: #fff;
    padding: 0px 10px 16px;
  }
  .import-match .match-league .league-title {
    font-size: 20px;
    height: 55px;
    line-height: 55px;
    padding: 0 10px;
    text-align: left;
  }
  .import-match .match-league .league-title .dis-icon {
    background-color: #eaecef;
    border-radius: 2px;
    cursor: pointer;
    display: inline-block;
    height: 19px;
    line-height: 1;
    text-align: center;
    width: 19px;
  }
  .import-match .match-league .league-title .dis-icon > em {
    color: var(--brand-secondary);
    display: inline-block;
    font-family: 'iconfont';
    font-size: 12px;
    -webkit-transform: scale(0.83) translate3d(0, -3px, 0);
    transform: scale(0.83) translate3d(0, -3px, 0);
  }
  .import-match .match-league .league-title .del-icon {
    background-color: #f2f3f5;
    border-radius: 20px;
    float: right;
    height: 20px;
    margin-top: 17px;
    position: relative;
    width: 20px;
  }
  .import-match .match-league .league-title .del-icon::before,
  .import-match .match-league .league-title .del-icon::after {
    background-color: #353a45;
    content: ' ';
    display: block;
    height: 1px;
    left: 50%;
    margin-left: -5px;
    margin-top: -1px;
    position: absolute;
    top: 50%;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    width: 10px;
  }
  .import-match .match-league .league-title .del-icon::after {
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .import-match .match-league .league-title .text {
    display: inline-block;
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    white-space: nowrap; margin-left: 10px;
  }
  .import-match .match-league.hide .league-title .dis-icon {
    -webkit-transform: rotate(-90deg);
    -ms-transform: rotate(-90deg);
    transform: rotate(-90deg);
  }
  .import-match .match-league .match-opt {
    border-bottom: 1px #eaecef solid;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
  }
  .import-match .match-league .match-opt > div {
    color: #353a45;
    cursor: pointer;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    font-size: 16px;
    font-weight: bold;
    padding: 5px 0;
    text-align: center;
  }
  .import-match .match-league .match-opt > div:hover {
    border-bottom: solid rgba(13, 151, 55, 0.5) 2px;
  }
  .import-match .match-league .match-opt > div.active {
    border-bottom: solid var(--brand-secondary) 2px;
  }
  .import-match .match-league .market-group {
    border-bottom: 1px solid #eaecef;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 0;
    padding-left: 3px;
    text-align: left;
    white-space: nowrap;
  }
  .import-match .match-league .market-group .market-item {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #353a45;
    cursor: pointer;
    display: inline-block;
    font-size: 13px;
    height: 48px;
    line-height: 48px;
    margin-bottom: -1px;
    padding: 0 13px;
    text-align: center;
    // width: calc(100%/6);
  }
  .import-match .match-league .market-group .market-item.active {
    border-bottom: 4px solid var(--brand-secondary);
    font-weight: 700;
  }
  .import-match .match-league .market-group .market-item:hover {
    /* border-bottom: 4px solid rgba(13, 151, 55, 0.7); */
  }
  .import-match .match-league .market-group .market-item.x-select-market {
    min-width: 113px;
    outline: none;
    position: relative;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .import-match .match-league .market-group .market-item.x-select-market .select-list {
    background: #fff;
    display: none;
    left: -1px;
    margin-top: -1px;
    position: absolute;
    top: 100%;
    width: 100%;
    z-index: 222;
  }
  .import-match .match-league .market-group .market-item.x-select-market .select-list li {
    color: #353a45;
    height: 32px;
    line-height: 32px;
    text-align: center;
  }
  .import-match .match-league .market-group .market-item.x-select-market .select-list li:hover {
    background-color: #eaecef;
  }
  .import-match .match-league .market-group .market-item.x-select-market .select-list li.active {
    color: var(--brand-secondary);
  }
  .import-match .match-league .market-group .market-item.x-select-market .x-icon-fold {
    color: #9ca0ab;
    display: inline-block;
    -webkit-transform: translate3d(5px, 0, 0);
    transform: translate3d(5px, 0, 0);
    vertical-align: middle;
  }
  .import-match .match-league .market-group .market-item.x-select-market .x-icon-fold::before {
    content: '\e603';
    font-family: 'iconfont' !important;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-style: normal;
  }
  .import-match .match-league .market-group .market-item.x-select-market .x-icon-fold:before {
    font-size: 12px;
  }
  .import-match .match-league .market-group .market-item.x-select-market.show-item {
    border: 1px solid #b4b4b4;
  }
  .import-match .match-league .market-group .market-item.x-select-market.show-item .select-list {
    border: 1px solid #b4b4b4;
    border-top: 0px;
    display: block;
    font-weight: normal;
  }
  .import-match .match-league .market-group .market-item.x-select-market.show-item .x-icon-fold {
    -webkit-transform: rotate(180deg) translate3d(-6px, 2px, 0);
    transform: rotate(180deg) translate3d(-6px, 2px, 0);
  }
  .import-match .match-league .match-table {
    border-bottom: 1px solid #eaecef;
    text-align: left;
  }
  .import-match .match-league .match-table .date-row,
  .import-match .match-league .match-table .league-row {
    -webkit-align-content: center;
    -ms-flex-line-pack: center;
    align-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    height: 36px;
    line-height: 36px;
    table-layout: fixed;
    vertical-align: middle;
  }
  .import-match .match-league .match-table .date-row .date,
  .import-match .match-league .match-table .league-row .date {
    -webkit-box-flex: 0;
    -webkit-flex: 0 1 auto;
    -ms-flex: 0 1 auto;
    flex: 0 1 auto;
    font-size: 16px;
    /* font-weight: 500; */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 263px;
  }
  .import-match .match-league .match-table .date-row .empty-cell,
  .import-match .match-league .match-table .league-row .empty-cell {
    width: 55px;
  }
  .import-match .match-league .match-table .date-row .each-module-wrap,
  .import-match .match-league .match-table .league-row .each-module-wrap {
    color: #9ca0ab;
    -webkit-box-flex: 0;
    -webkit-flex: 0 1 auto;
    -ms-flex: 0 1 auto;
    flex: 0 1 auto;
    width: 280px;
  }
  .import-match .match-league .match-table .date-row .each-module-wrap .each-module-table,
  .import-match .match-league .match-table .league-row .each-module-wrap .each-module-table {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: inline-table;
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    table-layout: fixed;
    white-space: nowrap;
    width: 100%;
  }
  .import-match
    .match-league
    .match-table
    .date-row
    .each-module-wrap
    .each-module-table.two-markets,
  .import-match
    .match-league
    .match-table
    .league-row
    .each-module-wrap
    .each-module-table.two-markets {
    width: 50%;
  }
  .import-match
    .match-league
    .match-table
    .date-row
    .each-module-wrap
    .each-module-table.two-markets:first-child,
  .import-match
    .match-league
    .match-table
    .league-row
    .each-module-wrap
    .each-module-table.two-markets:first-child {
    padding-right: 2px;
  }
  .import-match
    .match-league
    .match-table
    .date-row
    .each-module-wrap
    .each-module-table.two-markets:last-child,
  .import-match
    .match-league
    .match-table
    .league-row
    .each-module-wrap
    .each-module-table.two-markets:last-child {
    padding-left: 2px;
  }
  .import-match
    .match-league
    .match-table
    .date-row
    .each-module-wrap
    .each-module-table
    .each-module,
  .import-match
    .match-league
    .match-table
    .league-row
    .each-module-wrap
    .each-module-table
    .each-module {
    display: table-cell;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    font-size: 12px;
    min-width: 1%;
    text-align: center;
  }
  .import-match
    .match-league
    .match-table
    .date-row
    .each-module-wrap
    .each-module-table
    .each-module.is-multiline,
  .import-match
    .match-league
    .match-table
    .league-row
    .each-module-wrap
    .each-module-table
    .each-module.is-multiline {
    font-size: 11px;
    white-space: initial;
    -webkit-align-self: center;
    -ms-flex-item-align: center;
    align-self: center;
    line-height: 12px;
  }
  .import-match
    .match-league
    .match-table
    .date-row
    .each-module-wrap
    .each-module-table
    .each-module:last-child,
  .import-match
    .match-league
    .match-table
    .league-row
    .each-module-wrap
    .each-module-table
    .each-module:last-child {
    margin-right: 0px;
  }
  .import-match .match-league .match-table .match-row {
    -webkit-align-content: center;
    -ms-flex-line-pack: center;
    align-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    border-top: 1px solid #eaecef;
    cursor: pointer;
    font-size: 12px;
    height: 50px;
    position: relative;
    table-layout: fixed;
  }
  .import-match .match-league .match-table .match-row .x-table-cell {
    font-size: 12px;
  }
  .import-match .match-league .match-table .match-row:before,
  .import-match .match-league .match-table .match-row:after {
    background-color: #fff;
    content: ' ';
    display: block;
    height: 1px;
    left: 0;
    position: absolute;
    top: -1px;
    width: 65px;
  }
  .import-match .match-league .match-table .match-row:after {
    bottom: -1px;
    top: auto;
  }
  .import-match .match-league .match-table .match-row .left-team-cell {
    width: 258px;
  }
  .import-match .match-league .match-table .match-row .left-team-table {
    display: inline-table;
    height: 50px;
    table-layout: fixed;
    width: 100%;
  }
  .import-match .match-league .match-table .match-row .left-team-table > div {
    display: table-cell;
    vertical-align: middle;
  }
  .import-match .match-league .match-table .match-row .left-team-table .time {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-box-flex: 0;
    -webkit-flex: 0 1 auto;
    -ms-flex: 0 1 auto;
    flex: 0 1 auto;
    line-height: 1.1;
    text-align: left;
    width: 68px;
  }
  .import-match .match-league .match-table .match-row .left-team-table .time .clock-time {
    padding-bottom: 4px;
  }
  .import-match .match-league .match-table .match-row .left-team-table .time .game-id {
    color: #d8d8d8;
    font-weight: 500;
  }
  .import-match .match-league .match-table .match-row .left-team-table .teams {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .import-match .match-league .match-table .match-row .left-team-table .teams > div {
    display: block;
    /* font-weight: 500; */
    line-height: 1.1;
    overflow: hidden;
    padding-right: 4px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .import-match .match-league .match-table .match-row .left-team-table .teams > div:first-child {
    padding-bottom: 4px;
  }
  .import-match .match-league .match-table .match-row .left-team-table .lmt-icon {
    color: #353a45;
    -webkit-box-flex: 0;
    -webkit-flex: 0 1 auto;
    -ms-flex: 0 1 auto;
    flex: 0 1 auto;
    font-size: 12px;
    position: relative;
    text-align: left;
    width: 37px;
  }
  .import-match .match-league .match-table .match-row .left-team-table .lmt-icon::before {
    content: '\e61d';
    font-family: 'iconfont' !important;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-style: normal;
  }
  .import-match .match-league .match-table .match-row .x-table-cell {
    vertical-align: middle;
  }
  .import-match .match-league .match-table .match-row .market-cell {
    -webkit-box-flex: 0;
    -webkit-flex: 0 1 auto;
    -ms-flex: 0 1 auto;
    flex: 0 1 auto;
    width: 280px;
  }
  .import-match .match-league .match-table .match-row .market-cell .market .x-outcome--disabled {
    background: #dcdee5;
    color: #9ca0ab;
  }
  .import-match .match-league .match-table .match-row .market-cell.two-markets .market {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 50%;
  }
  .import-match .match-league .match-table .match-row .market-cell.two-markets .market:first-child {
    padding-right: 2px;
  }
  .import-match .match-league .match-table .match-row .market-cell.two-markets .market:last-child {
    padding-left: 2px;
  }
  .import-match
    .match-league
    .match-table
    .match-row
    .market-cell.two-markets
    .market
    .specifiers-select {
    min-width: 50px;
  }
  .import-match .match-league .match-table .match-row .market-size {
    -webkit-box-flex: 0;
    -webkit-flex: 0 1 auto;
    -ms-flex: 0 1 auto;
    flex: 0 1 auto;
    font-weight: 500;
    line-height: 50px;
    text-align: center;
    text-align: right;
    width: 55px;
  }
  .import-match .match-league .match-table .match-row .market-size:after {
    color: var(--brand-secondary);
    content: '\e608';
    display: inline-block;
    font-family: 'iconfont';
    font-weight: 700;
  }
  .import-match .match-league .match-table .match-row.active-h2h .lmt-icon {
    color: var(--brand-secondary);
  }
  .import-match .match-league .match-table .match-row.active-h2h .lmt-icon .icon {
    color: var(--brand-secondary);
    display: inline-block;
    font-weight: 700;
    vertical-align: text-bottom;
  }
  .import-match .match-league .match-table .match-row.active-h2h .lmt-icon .icon::before {
    content: '\e62d';
    font-family: 'iconfont' !important;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-style: normal;
  }
  .import-match .match-league .match-table .match-row.active-h2h .lmt-icon .icon::before {
    font-size: 10px;
    position: absolute;
    top: 19px;
  }
  .import-match .match-league .view-all {
    background-color: #f2f3f5;
    border-radius: 2px;
    color: #2d333c;
    cursor: pointer;
    font-size: 14px;
    height: 46px;
    line-height: 46px;
    margin: 16px 0 0;
    text-align: center;
  }
  .import-match .match-league .view-all:after {
    color: var(--brand-secondary);
    content: '\e608';
    display: inline-block;
    font-family: 'iconfont';
    font-weight: 700;
  }
  .import-match .pagination {
    font-size: 12px;
    font-weight: 500;
  }
  .import-match .pagination .pageNum {
    height: 24px;
    line-height: 24px;
    margin: 0 1px;
    width: 24px;
  }
  .import-match .pagination .icon-prev:before,
  .import-match .pagination .icon-next:before {
    color: var(--brand-secondary);
  }
  .import-match .pagination .icon-disabled::before {
    color: #9ca0ab;
  }
  .import-match .pagination .selected {
    background-color: var(--brand-secondary);
    color: #fff;
  }
  .pagination {
    margin: 10px auto;
    text-align: center;
  }
  .pagination .pageNum {
    display: inline-block;
    width: 18px;
    height: 18px;
    color: #353a45;
    margin: 0 5px;
    cursor: pointer;
  }
  .pagination .icon-next,
  .pagination .icon-prev {
    margin: 0 !important;
    font-size: 0;
  }
  .pagination .icon-next::before,
  .pagination .icon-prev::before {
    content: '\e608';
    font-family: 'iconfont' !important;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-style: normal;
  }
  .pagination .icon-next:before,
  .pagination .icon-prev:before {
    font-size: 12px;
    color: #353a45;
    font-weight: bold;
  }
  .pagination .icon-prev {
    -webkit-transform-origin: 50% 50%;
    -ms-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    -webkit-transform: rotate(-180deg);
    -ms-transform: rotate(-180deg);
    transform: rotate(-180deg);
  }
  .pagination .icon-disabled {
    cursor: default;
  }
  .pagination .icon-disabled::before {
    color: #eaecef;
  }
  .pagination .selected {
    background: #eaecef;
    border-radius: 2px;
    cursor: default;
  }

  .import-match .x-sport-bet-no-data,
  .import-match .x-sport-bet-err {
    background-color: #fff;
    min-height: 280px;
  }
  .import-match .x-sport-bet-no-data > div,
  .import-match .x-sport-bet-err > div {
    color: #353a45;
    display: inline-block;
    font-size: 14px;
    margin: 0 auto;
    padding: 75px 0;
    text-align: left;
  }
  .import-match .x-sport-bet-no-data > div p,
  .import-match .x-sport-bet-err > div p {
    white-space: nowrap;
    word-break: keep-all;
  }
  .af-select-list {
    border: 1px solid #eaecef;
  }
  .af-select-list .af-select-item {
    color: #353a45;
    cursor: pointer;
  }
  .af-select-list .af-select-item.active {
    background: #33ea6a;
    color: #fff;
  }
  .af-select-list .af-select-item:hover {
    background: #32ce62;
    color: #fff;
  }
}
@media print {
  .wrapper {
    margin: 0 25px;
    border: 2px solid rgba(255, 105, 180, 0.23);
    border-radius: 5px;
    /* Hide screen specific elements*/
  }
  .wrapper .x-table {
    font-size: 18px;
  }
  .wrapper .banner {
    display: none;
  }
  .wrapper .premier-container {
    line-height: 40px;
    font-size: 20px;
    margin: 8px 0;
    background: rgba(211, 211, 211, 0.76);
  }
  .wrapper .events-time {
    background: rgba(128, 128, 128, 0.35);
    line-height: 30px;
    font-size: 15px;
    margin: 10px 0;
  }
}
.print-element {
  display: none;
}
</style>
