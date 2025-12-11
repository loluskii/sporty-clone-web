<template>
  <SportsLayout>
    <!-- <template #left-content>
    </template> -->
    <template #fixtures-list>
      <div id="importMatch" class="import-match">
        <LoadingSpinner v-if="isLoading && !fixturesList.length || isLoading" />
        <template v-else>
          <LoadingError v-if="loadingError" @reload="handlePageChange"></LoadingError>

          <template v-else-if="fixturesList.length">
            <TournamentCard
              v-for="tournament in fixturesList"
              :key="tournament.tournamentID"
              :categoryName="tournament.categoryName"
              :tournamentName="tournament.tournamentName"
              :tournamentID="tournament.tournamentID"
              :events="tournament.events"
              :markets="tournament.markets"
              :is-loading-tournament="loadingTournamentId === tournament.tournamentID"
              @fetch-fixtures="getTournamentFixtures"
            />

            <Pagination
              v-if="lastPage"
              v-model:currentPage="activePage"
              :total-pages="lastPage"
              :is-loading="isLoading"
              @update:currentPage="handlePageChange"
            />
          </template>
          <NoDataMessage v-else />
        </template>
      </div>
    </template>
  </SportsLayout>
</template>
<script setup>
import SportsLayout from '@/components/Shared/SportsLayout.vue'
import TournamentCard from '@/components/TournamentCard.vue'
import { FEED_TOGGLE, getSportHighlights, getToday2 } from '@/helpers'
import { useRoute } from 'vue-router'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { ref, watch, onMounted, computed } from 'vue'
import _ from 'lodash'
import { getFixturesByTournamentId, getTournamentsByCategories, extractIdsFromURL } from '@/helpers'
import { useUtilsStore } from '@/stores'
import Pagination from '@/components/FixturesPagination.vue'
import NoDataMessage from '@/components/NoDataMessage.vue'
import LoadingError from '@/components/Loaders/LoadingError.vue'

const utilsStore = useUtilsStore()
const route = useRoute()
const fixturesList = ref([])
const marketsGroup = ref({})

const isLoading = ref(false)
const loadingError = ref(false)
const loadingTournamentId = ref(null)

const lastPage = ref(null)
const activePage = ref(1)

// const filterQuery = ref()

const activeSport = computed(() => {
  return utilsStore.activeSport
})

watch(
  () => [route.name, route.query, route.params],
  async ([routeName, query, params]) => {
    const tournament = params.tournaments
      ? extractIdsFromURL(params.tournaments, 'tournament')
      : null
    
    // Check the route name
    switch (routeName) {
      case 'fixtures-by-tournament':
      case 'top-tournament-fixtures':
        break
      case 'fixtures-by-categories':
        lastPage.value = null
        await getCategoryFixtures()
        break
      case 'fixtures-by-tournaments':
        lastPage.value = null
        await getTournamentFixtures(tournament[0])
        break
      case 'upcoming-fixtures-by-sport':
      case 'fixtures-by-sport':
        if (query.period) {
          await fetchActiveSportByPeriod(query.period)
        } else {
          await fixturesByActiveSport()
        }
        break
      default:
        break
    }
  },
  { immediate: true, deep: true }
)

// Function to handle page change based on the current route and parameters
const handlePageChange = async () => {
  const routeName = route?.name
  const period = route?.query?.period
  const tournament = route.params.tournaments
    ? extractIdsFromURL(route.params.tournaments, 'tournament')
    : null
  // Check the route name
  switch (routeName) {
    case 'fixtures-by-tournament':
    case 'top-tournament-fixtures':
      // await getTournamentFixtures(tournament_id)
      break
    case 'fixtures-by-categories':
      await getCategoryFixtures()
      break
    case 'fixtures-by-tournaments':
      lastPage.value = null
      await getTournamentFixtures(tournament[0])
      break

    case 'upcoming-fixtures-by-sport':
    case 'fixtures-by-sport':
      if (period) {
        await fetchActiveSportByPeriod(period)
      } else {
        await fixturesByActiveSport()
      }
      break

    default:
      // Handle other routes or provide a default behavior
      break
  }
}

async function getCategoryFixtures() {
  const routeExtractedTIds = extractIdsFromURL(route.params.categories, 'category')
  const sid = activeSport.value.sportID

  if(!FEED_TOGGLE){
    fixturesList.value = []
    return;
  }

  try {
    isLoading.value = true

    // If there are no categories to fetch, skip the API call
    if (routeExtractedTIds.length === 0) {
      fixturesList.value = []
      isLoading.value = false
      return
    }

    // Fetch data for all categories from the URL
    const results = await Promise.allSettled(
      routeExtractedTIds.map((cat) =>
        getTournamentsByCategories(cat.categoryID, sid, route.query?.period)
      )
    )

    const newFixtures = []
    results.forEach((res) => {
      if (res.status === 'fulfilled') {
        res.value.sports.forEach((tournament) => {
          newFixtures.push({
            tournamentName: tournament.tournamentName,
            tournamentID: tournament.tournamentID,
            categoryName: '', // This would need to be set as per your data
            categoryID: '', // This would need to be set as per your data
            events: [],
            markets: []
          })
        })
      }
    })

    // Replace fixturesList with new fixtures and sort by tournamentID
    fixturesList.value = newFixtures.sort((a, b) => a.tournamentID - b.tournamentID)

    // Reset other states
    marketsGroup.value = []
    lastPage.value = null

    isLoading.value = false

    // Automatically load fixtures for the first tournament
    if (fixturesList.value.length > 0) {
      await getTournamentFixtures(fixturesList.value[0])
    }
  } catch (error) {
    console.error('Error fetching fixtures:', error)
    isLoading.value = false
  }
}

async function getTournamentFixtures(tid) {
  if(!FEED_TOGGLE){
    fixturesList.value = []
    return;
  }
  // isLoading.value = !isTournamentView.value
  const sid = activeSport.value.sportID
  tid = tid.tournamentID || tid
  try {
    loadingTournamentId.value = tid
    const res = await getFixturesByTournamentId(tid, sid, activePage.value)
    const index = fixturesList.value.findIndex((t) => t.tournamentID === tid)
    if (index !== -1) {
      let tournament = fixturesList.value[index]
      // Update the tournament object
      tournament.events = res.fixtures
      tournament.categoryName = res.fixtures[0].categoryName
      tournament.categoryID = res.fixtures[0].categoryID
      tournament.markets = res.markets
      // Put the updated object back into fixturesList
      fixturesList.value[index] = tournament
      // Update markets and pagination
      // marketsGroup.value = res.markets
      lastPage.value = res.lastPage
    } else {
      fixturesList.value.push({
        tournamentName: res.fixtures[0].tournament,
        tournamentID: res.fixtures[0].tournamentID,
        categoryName: res.fixtures[0].categoryName,
        categoryID: res.fixtures[0].categoryID,
        events: res.fixtures,
        markets: res.markets
      })
    }
    // if (res.fixtures && res.markets && res.fixtures.length > 0) {
    // } else {
    //   console.warn('No fixtures returned for this tournament')
    //   // tournament.events = [] // Ensure events is an empty array if no fixtures are returned
    // }

    isLoading.value = false
    loadingTournamentId.value = null
  } catch (error) {
    isLoading.value = false
    loadingTournamentId.value = null
    loadingError.value = true
    console.error('Error fetching tournament fixtures:', error)
  }
}

async function fixturesByActiveSport() {
  if(!FEED_TOGGLE){
    fixturesList.value = []
    return;
  }
  isLoading.value = true
  const sid = activeSport.value.sportID
  try {
    const res = await getSportHighlights(sid, null, activePage.value)
    let result = _.groupBy(res.fixtures, 'tournament')
    const tournamentsArray = Object.keys(result)
      .map((tournamentName) => {
        const details = result[tournamentName] || {}
        return {
          tournamentName: tournamentName,
          tournamentID: details[0].tournamentID || '',
          categoryName: details[0].categoryName || '',
          categoryID: details[0].categoryID || '',
          events: details,
          markets: res.markets
        }
      })
      .sort((a, b) => a.tournamentID - b.tournamentID) // Sort by tournamentID

    fixturesList.value = tournamentsArray
    // marketsGroup.value = res.markets
    lastPage.value = res.lastPage
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    loadingError.value = true
    console.error(error)
  }
}

async function fetchActiveSportByPeriod(period) {
  if(!FEED_TOGGLE){
    fixturesList.value = []
    return;
  }
  isLoading.value = true
  const sid = activeSport.value.sportID
  try {
    if (period == 'today') {
      return await fetchTodayActiveSport(sid)
    } else {
      const res = await getSportHighlights(sid, period, activePage.value)
      let result = _.groupBy(res.fixtures, 'tournament')
      const tournamentsArray = Object.keys(result)
        .map((tournamentName) => {
          const details = result[tournamentName] || {}
          return {
            tournamentName: tournamentName,
            tournamentID: details[0].tournamentID || '',
            categoryName: details[0].categoryName || '',
            categoryID: details[0].categoryID || '',
            events: details,
            markets: res.markets
          }
        })
        .sort((a, b) => a.tournamentID - b.tournamentID) // Sort by tournamentID

      fixturesList.value = tournamentsArray
      lastPage.value = res.lastPage
      isLoading.value = false
    }
  } catch (error) {
    isLoading.value = false
    loadingError.value = true
    console.error(error)
  }
}

async function fetchTodayActiveSport(id) {
  if(!FEED_TOGGLE){
    fixturesList.value = []
    return;
  }
  try {
    const res = await getToday2(id, activePage.value)
    let result = _.groupBy(res.fixtures, 'tournament')
    const tournamentsArray = Object.keys(result)
      .map((tournamentName) => {
        const details = result[tournamentName] || {}
        return {
          tournamentName: tournamentName,
          tournamentID: details[0].tournamentID || '',
          categoryName: details[0].categoryName || '',
          categoryID: details[0].categoryID || '',
          events: details,
          markets: res.markets
        }
      })
      .sort((a, b) => a.tournamentID - b.tournamentID) // Sort by tournamentID

    fixturesList.value = tournamentsArray
    lastPage.value = res.lastPage
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    loadingError.value = true
    console.error(error)
  }
}

onMounted(() => {
  // emitter.on('newActiveCategory', handleNewActiveCategory)
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
    white-space: nowrap;
    margin-left: 10px;
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
    /* // width: calc(100% / 6); */
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
