<template>
  <div class="important-match">
    <div class="banner">
      <span class="circle"></span>
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
        <div v-if="!isLoading && highlightsData.length > 0" class="match">
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
                </div>
                <div class="x-table-cell"></div>
              </div>
              <HighlightFixtures
                v-for="(game, g) in matches"
                :key="g"
                :game="game"
                :selected-markets="selectedMarketIDs"
                :active-sport-markets="activeSportMarkets"
              />
            </template>
          </div>
        </div>
        <div v-else-if="!isLoading && !highlightsData.length" class="x-sport-bet-no-data">
          Sorry, there are no games currently available in this sport for now.<br />Please try
          later. Thank you.
        </div>
        <LoadingSpinner v-else></LoadingSpinner>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUtilsStore } from '@/stores'
import HighlightFixtures from './HighlightFixtures.vue'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { getHighlights2, formatDate } from '@/helpers'
import { onMounted, ref, computed } from 'vue'
import _ from 'lodash'

const utilsStore = useUtilsStore()
const sportList = computed(() => {
  return utilsStore.sportsMenu
})

const activeSportID = ref(1)
const prevSportID = ref(1)
const activeSportMarkets = ref([])
const highlightsData = ref([])
const activeTournament = ref({})
const activeTournamentEvents = ref([])
const selectedMarketIDs = ref([])
const MoreSportsLabel = ref('More Sports')
const isMoreSportsDropdownShown = ref(false)
const sportSimpleSelectActive = ref(false)
const isLoading = ref(false)

async function getHighlightGames() {
  if (prevSportID.value === activeSportID.value && highlightsData.value.length) return
  isLoading.value = true
  const response = await getHighlights2(activeSportID.value, 10)
  if (response.fixtures && response.markets) {
    const transformedHighlights = transformHighlights(response.fixtures)
    const [firstTournament] = transformedHighlights
    highlightsData.value = transformedHighlights
    activeTournament.value = firstTournament
    activeTournamentEvents.value = _.groupBy(
      firstTournament.events,
      (fixture) => fixture.date.split(' ')[0]
    )
    const markets = response.markets.filter((market) => market.specifier === '')
    activeSportMarkets.value = markets.slice(0, 2)
    selectedMarketIDs.value = markets.slice(0, 2).map((market) => ({
      marketID: parseInt(market.marketID),
      marketName: market.marketName,
      specifier: market.specifier
    }))
    prevSportID.value = activeSportID.value
  } else {
    highlightsData.value = []
    activeTournament.value = {}
    activeTournamentEvents.value = {}
    isLoading.value = false
    return
  }
  isLoading.value = false
}

function toggleMoreSportsDropdown() {
  isMoreSportsDropdownShown.value = !isMoreSportsDropdownShown.value
}

function transformHighlights(arr) {
  const tournamentMap = new Map()
  for (const item of arr) {
    const { tournament, categoryName, tournamentID } = item
    const key = `${tournament}-${categoryName}`
    if (!tournamentMap.has(key)) {
      tournamentMap.set(key, {
        id: tournamentID,
        tournamentName: tournament,
        category: categoryName,
        events: []
      })
    }
    tournamentMap.get(key).events.push(item)
  }
  return Array.from(tournamentMap.values())
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
  background-color: var(--brand-secondary);
}
.simple-select-wrap .select-item.select-item-active {
  background-color: var(--brand-secondary);
}
</style>
