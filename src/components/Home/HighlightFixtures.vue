<template>
  <div class="x-table-row m-content-row match-row">
    <div class="x-table-cell left-team-cell">
      <div class="left-team-table">
        <div class="time">
          <div class="clock-time">{{ game.eventTime }}&nbsp;&nbsp;</div>
          <div class="game-id"><span class="game-id-label">ID: </span>{{ game.gameID }}</div>
        </div>
        <div
          title=""
          class="teams"
          @click="
            $router.push({
              name: 'fixtures-detail',
              params: {
                sport: slugify(game.sportName),
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
        <div
          v-if="market.specifier !== '' && market.outcomes.length"
          class="x-outcome specifiers-select"
        >
          <div tabindex="0" class="af-select" @click="toggleList">
            <div class="af-select-title">
              <span class="af-select-input">{{ market.specifier.split('=')[1] }}</span>
              <span class="af-select-icon-item"><em class="icon">^</em></span>
              <div
                class="af-select-list animate-core"
                v-if="specifierOpen"
                :class="'af-select-list-' + game.gameID"
                style="opacity: 1; width: 100%"
              >
                <span
                  class="af-select-item"
                  v-for="(item, i) in getSpecifiers"
                  :key="i"
                  @click="setActiveSpec(item)"
                  >{{ item.value }}</span
                >
                <!-- <span class="af-select-item">1.3</span> -->
              </div>
            </div>
          </div>
        </div>
        <template v-if="market.outcomes.length">
          <div
            v-for="(k, l) in sortArr(market.outcomes, 'outcomeID')"
            :key="l"
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
        <template v-else>
          <EmptyOdds v-for="outcome in getEmptyOutcomesLength(market)" :key="outcome"></EmptyOdds>
        </template>
      </div>
    </div>
    <div class="x-table-cell market-size">+{{ game.activeMarkets }}</div>
  </div>
</template>

<script setup>
import { createID, isSelected, sortArr, slugify } from '@/helpers'
import { useCouponStore } from '@/stores'
import { computed, ref } from 'vue'

import EmptyOdds from '../EmptyOdds.vue'
const couponStore = useCouponStore()

const props = defineProps({
  selectedMarkets: Object,
  activeSportMarkets: Object,
  game: Object
})

const activeSpecifier = ref()
const specifierOpen = ref(false)

const getEmptyOutcomesLength = (m) => {
  const market = props.activeSportMarkets.find((mkt) => mkt.marketID == m.marketID)

  return market && market.specifier !== ''
    ? market.outcomes.length + 1
    : market.specifier === ''
      ? market.outcomes.length
      : 0
}

function getFilteredOutcomes(outcomes) {
  return props.selectedMarkets.map((marketIDObj) => {
    const { marketID } = marketIDObj
    let foundOutcomes = outcomes.filter((outcome) => outcome.marketID === marketID)
    const defaultSpecifier = getDefaultSpecifier(foundOutcomes)
    if (defaultSpecifier) {
      foundOutcomes = foundOutcomes.filter((outcome) => outcome.specifier === defaultSpecifier)
    }
    // Return the structured object without the 'marketID' in each outcome
    return {
      ...marketIDObj,
      specifier: defaultSpecifier,
      outcomes: foundOutcomes.map(({ marketID, ...rest }) => rest)
    }
  })
}

const getSpecifiers = computed(() => {
  const result = []
  const outcomes = props.game.outcomes
  const specifier = props.selectedMarkets.filter((market) => market.specifier !== '')
  if (outcomes.length > 0) {
    let filtered = outcomes.filter((item) => item.marketID === specifier[0].marketID)
    filtered.forEach((outcome) => {
      let specifier = outcome.specifier
      let found = result.find((item) => item.specifier === specifier)
      if (!found) {
        // check if specifier has been listed
        result.push({ specifier, value: specifier.split('=')[1] }) //push value to array
      }
    })
    return result.sort((a, b) => a.value - b.value)
  } else {
    return []
  }
})

const toggleList = () => {
  specifierOpen.value = !specifierOpen.value
}

function getDefaultSpecifier(outcomes) {
  const outcomeWithSpecifier = outcomes.find((outcome) => outcome.specifier !== '')
  activeSpecifier.value = outcomeWithSpecifier?.specifier.split('=')[1]
  return outcomeWithSpecifier ? outcomeWithSpecifier.specifier : ''
}

function setActiveSpec(spec) {
  activeSpecifier.value = spec.value
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

  const existsInBetslip = isSelected(id, couponStore.coupon)
  return existsInBetslip ? couponStore.removeSelection(id) : couponStore.addToCoupon(data)
}

function showFixtureAnalysis(id) {
  return window.open(
    `https://s5.sir.sportradar.com/betradar/en/match/${id}`,
    'stats',
    'width=1078,height=768'
  )
}
</script>
