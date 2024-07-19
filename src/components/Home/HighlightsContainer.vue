<template>
  <div class="important-match">
    <div class="banner">
      <!-- <span class="circle"></span> -->
      <span class="text">Highlights</span>
    </div>
    <div class="print-container-wrapper">
      <div class="sport-name">
        <div
          v-for="(sport, index) in sportList.slice(0, 6)"
          @click="setActiveSport(sport.sportID)"
          :key="index"
          :class="activeSportID == sport.sportID ? 'active' : ''"
          class="sport-name-item"
          style="max-width: 17%"
        >
          <div class="text">{{ sport.sportName }}</div>
        </div>

        <div
          class="simple-select-wrap sport-simple-select"
          :class="
            isMoreSportsDropdownShown
              ? 'simple-select-wrap-expand'
              : sportSimpleSelectActive
                ? 'sport-simple-select-active'
                : ''
          "
        >
          <div @click="toggleMoreSportsDropdown" class="select-title">
            <p class="select-title__label">{{ MoreSportsLabel }}</p>
            <span class="arrow-icon arrow-icon-down"></span>
          </div>
          <div class="select-list" v-show="isMoreSportsDropdownShown">
            <div
              v-for="(sport, index) in sportList.slice(7)"
              @click="setActiveSport(sport.sportID, sport.sportName)"
              :key="index"
              :class="activeSportID == sport.sportID ? 'select-item-active' : ''"
              class="select-item"
            >
              {{ sport.sportName }}
            </div>
          </div>
        </div>
      </div>

      <div id="print-container" style="position: relative">
        <div v-if="!isLoading" class="match">
          <div class="tour-name-wrap">
            <div
              v-for="(group, g) in highlightsData.slice(0, 5)"
              @click="setActiveHighlight(group)"
              :key="g"
              class="tour-item"
              :class="group.id === activeTournament.id ? 'active' : ''"
            >
              <div class="category-name">{{ group.category }}</div>
              <div class="tour-name">{{ group.tournamentName }}</div>
            </div>
          </div>
          <div class="x-table important-table match-table">
            <template v-for="(matches, m) in activeTournamentEvents" :key="m">
              <div class="x-table-row date-row">
                <div class="x-table-cell date">{{ formatDate(m, 'DD/MM dddd') }}</div>
                <div class="x-table-cell each-module-wrap">
                  <div
                    v-for="group in activeSportMarkets"
                    :key="group"
                    class="each-module-table"
                    :class="activeSportMarkets.length > 1 ? 'two-markets' : ''"
                  >
                    <div
                      v-if="group.specifier !== ''"
                      class="each-module"
                      style="text-transform: capitalize"
                    >
                      {{ group.specifier }}
                    </div>
                    <div
                      v-for="market in _.sortBy(group.outcomes, 'outcomeID')"
                      :key="market"
                      class="each-module"
                    >
                      {{ market.outcomeName }}
                    </div>
                  </div>
                  <!-- <div class="each-module-table two-markets">
                    <div class="each-module">1X</div>
                    <div class="each-module">12</div>
                    <div class="each-module">X2</div>
                  </div> -->
                </div>
                <div class="x-table-cell"></div>
              </div>
              <div
                v-for="(game, g) in matches"
                :key="g"
                class="x-table-row m-content-row match-row"
              >
                <div class="x-table-cell left-team-cell">
                  <div class="left-team-table">
                    <div class="time">
                      <div class="clock-time">{{ game.eventTime }}&nbsp;&nbsp;</div>
                      <div class="game-id">
                        <span class="game-id-label">ID: </span>{{ game.gameID }}
                      </div>
                    </div>
                    <div
                      title=""
                      class="teams"
                      @click="
                        $router.push({
                          name: 'fixtures-detail',
                          params: {
                            sport: slugify(game.sportName),
                            category: slugify(game.categoryName),
                            tournament_name: slugify(game.tournament),
                            event_name: slugify(game.name),
                            event_id: game.matchID
                          }
                        })
                      "
                    >
                      <div class="home-team">{{ game.homeTeam }}</div>
                      <div class="away-team">{{ game.awayTeam }}</div>
                    </div>
                    <div class="lmt-icon" @click="showFixtureAnalysis(game.matchID)">
                      <em class="icon"></em>
                    </div>
                  </div>
                </div>
                <div
                  class="x-table-cell market-cell"
                  :class="getFilteredOutcomes(game.outcomes).length > 1 ? 'two-markets' : ''"
                >
                  <div
                    class="x-market market"
                    v-for="(market, m) in getFilteredOutcomes(game.outcomes)"
                    :key="m"
                  >
                    <!-- <div
                      v-if="market.specifier !== '' && market.outcomes.length"
                      class="x-outcome specifiers-select"
                    >
                      <div tabindex="0" class="af-select">
                        <div class="af-select-title">
                          <span class="af-select-input">{{ market.specifier.split('=')[1] }}</span>
                          <span class="af-select-icon-item"><em class="icon">^</em></span>
                        </div>
                      </div>
                    </div> -->
                    <template
                      v-for="(k, l) in sortArr(market.outcomes, 'outcomeID')"
                      :key="l"
                      v-if="market.outcomes.length"
                    >
                      <!-- {{ k }} -->
                      <div
                        @click="addToBetslip(game, k, market)"
                        class="x-outcome"
                        :class="
                          isSelected(
                            createID(game.gameID, game.matchID, k.outcomeName, k.oddID, game.name),
                            couponStore.coupon
                          )
                            ? 'x-outcome--checked'
                            : ''
                        "
                      >
                        <span class="x-outcome-odds">{{ k.odds.toFixed(2) }}</span>
                      </div>
                    </template>
                    <EmptyOdds v-else></EmptyOdds>
                  </div>
                </div>
                <div class="x-table-cell market-size">+{{ game.activeMarkets }}</div>
              </div>
            </template>
          </div>

          <!-- <div class="print-footer">Footer</div> -->
        </div>
        <LoadingSpinner v-else></LoadingSpinner>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUtilstStore, useCouponStore } from '@/stores'
import EmptyOdds from '../EmptyOdds.vue'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'

import { getHighlights2, formatDate, slugify, createID, isSelected, sortArr } from '@/helpers'
import { onMounted, ref, computed } from 'vue'
import _ from 'lodash'

const utilsStore = useUtilstStore()
const couponStore = useCouponStore()

const sportList = computed(() => {
  return utilsStore.sportsMenu
})

const activeSportID = ref(1)
const prevSportID = ref(1)
const activeSportMarkets = ref([])
const activeSportMarketOutcomes = ref([])

const highlightsData = ref([])
const activeTournament = ref({})
const activeTournamentEvents = ref([])

const selectedMarketIDs = ref([])

const MoreSportsLabel = ref('More Sports')
const isMoreSportsDropdownShown = ref(false)
const sportSimpleSelectActive = ref(false)

const isLoading = ref(false)
const loadingError = ref(false)

async function getHighlightGames() {
  isLoading.value = true
  if (!Object.keys(highlightsData.value).length || prevSportID.value !== activeSportID.value) {
    const response = await getHighlights2(activeSportID.value, 10)
    if (response.fixtures) {
      let transformedHighlights = transformHighlights(response.fixtures)
      highlightsData.value = transformedHighlights
      activeTournament.value = transformedHighlights[0]
      activeTournamentEvents.value = _.groupBy(
        transformedHighlights[0].events,
        (fixture) => fixture.date.split(' ')[0]
      )
      // get active sports first two markets
      let m = response.markets.filter((market) => market.specifier === '')
      activeSportMarkets.value = m.slice(0, 2)

      // extract market ids from markets
      selectedMarketIDs.value = m.slice(0, 2).map((market) => ({
        marketID: parseInt(market.marketID),
        marketName: market.marketName,
        specifier: market.specifier
      }))
    } else {
      highlightsData.value = []

      // marketsGroup.value = []
    }
  }
  isLoading.value = false
}

function showFixtureAnalysis(id) {
  return window.open(
    `https://s5.sir.sportradar.com/betradar/en/match/${id}`,
    'stats',
    'width=1078,height=768'
  )
}

function getFilteredOutcomes(outcomes) {
  const groupedOutcomes = _.groupBy(outcomes, 'marketID')
  const filteredOutcomes = selectedMarketIDs.value.map((marketIDObj) => {
    const marketID = marketIDObj.marketID
    let foundOutcomes = outcomes.filter((outcome) => outcome.marketID === marketID)
    const outcomeWithSpecifier = foundOutcomes.find((outcome) => outcome.specifier !== '')
    let defaultSpecifier = ''
    if (outcomeWithSpecifier) {
      defaultSpecifier = outcomeWithSpecifier.specifier
      foundOutcomes = foundOutcomes.filter((outcome) => outcome.specifier === defaultSpecifier)
    }
    return {
      ...marketIDObj,
      specifier: defaultSpecifier,
      outcomes: foundOutcomes.map((outcome) => ({
        ...outcome,
        marketID: undefined // Omit 'marketID' from each outcome
      }))
    }
  })

  return filteredOutcomes
}

function toggleMoreSportsDropdown() {
  isMoreSportsDropdownShown.value = !isMoreSportsDropdownShown.value
}

function transformHighlights(arr) {
  const transformedArray = arr.reduce((accumulator, item) => {
    const { tournament, categoryName, tournamentID } = item

    const existingEntry = accumulator.find(
      (entry) => entry.tournamentName === tournament && entry.category === categoryName
    )

    if (existingEntry) {
      existingEntry.events.push(item)
    } else {
      accumulator.push({
        id: tournamentID,
        tournamentName: tournament,
        category: categoryName,
        events: [item]
      })
    }

    return accumulator
  }, [])

  return transformedArray
}

function setActiveHighlight(group) {
  activeTournament.value = group
  activeTournamentEvents.value = _.groupBy(group.events, (fixture) => fixture.date.split(' ')[0])
}

async function setActiveSport(sid, name = null) {
  // set the active sport id
  isLoading.value = true
  prevSportID.value = activeSportID.value
  activeSportID.value = sid
  if (name) {
    toggleMoreSportsDropdown()
    MoreSportsLabel.value = name
    sportSimpleSelectActive.value = true
  } else {
    sportSimpleSelectActive.value = false
    MoreSportsLabel.value = 'More Sports'
  }
  await getHighlightGames()
}

function addToBetslip(event, odd, market) {
  if (odd.odds < 1) return
  const id = createID(event.gameID, event.matchID, odd.outcomeName, odd.oddID, event.name)
  const data = {
    fixture: event,
    market_name: market.marketName,
    market_id: market.marketID,
    ele_id: id,
    outcome: odd,
    odds: odd.odds,
    odd_id: odd.oddID,
    odd_name: odd.outcomeName,
    type: 'prematch',
    event_id: event.gameID,
    specifier: odd.specifier
  }

  // console.log(data)
  // return couponStore.addToCoupon(data)

  const existsInBetslip = isSelected(id, couponStore.coupon)
  return existsInBetslip ? couponStore.removeSelection(id) : couponStore.addToCoupon(data)
}

onMounted(async () => {
  await getHighlightGames()
})
</script>

<style>
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
  content: '\e6a5';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.simple-select-wrap .select-title .arrow-icon-down::before {
  content: '\e603';
  font-family: 'iconfont' !important;
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
.simple-select-wrap .select-item:hover {
  background-color: var(--brand-primary);
}
.simple-select-wrap .select-item.select-item-active {
  background-color: var(--brand-primary);
}
</style>
