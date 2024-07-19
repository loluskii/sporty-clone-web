<template>
  <div class="x-table-row m-content-row match-row football-row">
    <div class="x-table-cell left-team-cell">
      <div class="left-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="12px">
          <polygon
            id="Rectangle-2"
            transform="translate(6.325503, 27.500000) scale(1, -1) translate(-6.325503, -27.500000) "
            points="0 -7.10542736e-15 6.01905469 -3.15544362e-30 12.6510067 55 0 55"
          ></polygon>
        </svg>
      </div>
      <div class="left-team-table">
        <div class="time">
          <div class="clock-time">{{ match.eventTime }}</div>
          <div class="game-id">{{ match.matchStatus }}</div>
        </div>
        <div
          class="teams"
          @click="
            $router.push({
              name: 'live-fixtures-specific-detail',
              params: {
                sport: slugify(match.sportName),
                category: slugify(match.categoryName),
                tournament: slugify(match.tournament),
                match: slugify(match.name),
                match_id: match.matchID
              }
            })
          "
        >
          <div class="home-team">{{ match.homeTeam }}</div>
          <div class="away-team">{{ match.awayTeam }}</div>
        </div>
        <div class="score">
          <div class="score-item">{{ match.homeScore }}</div>
          <div class="score-item">{{ match.awayScore }}</div>
        </div>
      </div>
    </div>
    <div class="x-table-cell market-cell" :class="activeMarkets.length > 1 ? 'two-markets' : ''">
      <div
        class="x-market market"
        v-for="(market, i) in filterOutcomesByMarketIDs(match.outcomes)"
        :key="i"
      >
        <template v-if="market.length">
          <Odds
            v-for="(odds, o) in market"
            :key="o"
            :odds="odds"
            :match="match"
            @click="addToBetslip(match, odds, market)"
          >
          </Odds>
        </template>
        <template v-else>
          <EmptyOdds
            v-for="outcome in getOutcomeCountForMarket(i)"
            :key="outcome.outcomeID"
          ></EmptyOdds>
        </template>
      </div>
    </div>
    <div class="x-table-cell market-size">+{{ match.activeMarkets }}</div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { slugify, sortArr, createID, isSelected } from '@/helpers'
import { useCouponStore } from '@/stores'
const couponStore = useCouponStore()
import EmptyOdds from '../EmptyOdds.vue'
import Odds from './Odds.vue'

const props = defineProps({
  match: Object,
  activeMarkets: Array
})

function filterOutcomesByMarketIDs(outcomes) {
  outcomes = outcomes.sort((a, b) => a.outcomeID - b.outcomeID)
  let marketIDs = props.activeMarkets.map((item) => parseInt(item.marketID))
  const filteredOutcomes = outcomes.filter((outcome) => marketIDs.includes(outcome.marketID))
  const groupedOutcomes = _.groupBy(filteredOutcomes, 'marketID')
  // Ensure all marketIDs are present in the grouped result
  marketIDs.forEach((marketID) => {
    if (!groupedOutcomes[marketID]) {
      groupedOutcomes[marketID] = []
    }
  })

  return groupedOutcomes
}

function getOutcomeCountForMarket(marketID) {
  const activeMarket = props.activeMarkets.find((market) => market.marketID === marketID)
  console.log(activeMarket.outcomes)
  if (activeMarket) {
    return activeMarket.outcomes.length
  }
  return 0
}

function addToBetslip(event, odd, market) {
  if (odd.odds <= 1) return
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
    type: 'live',
    event_id: event.gameID,
    specifier: odd.specifier
  }

  const existsInBetslip = isSelected(id, couponStore.coupon)
  return existsInBetslip ? couponStore.removeSelection(id) : couponStore.addToCoupon(data)
}
</script>
