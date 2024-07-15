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
        <div title="Australia vs Uzbekistan" class="teams">
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
        <div
          class="x-outcome"
          v-for="(odds, o) in market"
          :key="o"
          :class="
            odds.odds <= 1
              ? 'x-outcome--disabled'
              : isSelected(
                    createID(match.gameID, match.matchID, odds.outcomeName, odds.oddID, match.name),
                    couponStore.coupon
                  )
                ? 'x-outcome--checked'
                : ''
          "
          @click="addToBetslip(match, odds, market)"
        >
          <span class="x-outcome-odds" :class="odds.odds <= 1 ? 'x-icon-lock' : ''">{{
            odds.odds <= 1 ? '' : odds.odds.toFixed(2)
          }}</span>
        </div>
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

const props = defineProps({
  match: Object,
  activeMarkets: Array
})

function filterOutcomesByMarketIDs(outcomes) {
  const groupedOutcomes = {}
  outcomes = outcomes.sort((a, b) => a.outcomeID - b.outcomeID)
  let marketIDs = props.activeMarkets.map((item) => parseInt(item.marketID))
  const filteredOutcomes = outcomes.filter((outcome) => marketIDs.includes(outcome.marketID))
  return _.groupBy(filteredOutcomes, 'marketID')
}

const getOdds = () => {
  // Find and return the odds based on marketID and outcomeID
  if (props.activeMarkets && props.match.activeMarkets > 0) {
    if (props.match.outcomes) {
      const odds = props.match.outcomes
      let filtered = odds.filter((item) => item.marketID === parseInt(props.activeMarket.marketID))
      if (props.activeMarkets.specifier && props.activeMarkets.specifier !== '') {
        let defaultSpecifier = filtered[0]?.specifier
        if (defaultSpecifier) {
          filtered = filtered.filter((item) => item.specifier === defaultSpecifier)
          activeSpecifier.value = defaultSpecifier.split('=')[1]
        }
      }
      if (filtered.length) {
        // console.log(_.sortBy(filtered, 'outcomeID'))
        outcomes.value = sortArr(filtered, 'outcomeID')
      } else {
        outcomes.value = []
      }
    }
  }
}

function addToBetslip(event, odd, market) {
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

  // return couponStore.addToCoupon(data)

  const existsInBetslip = isSelected(id, couponStore.coupon)
  return existsInBetslip ? couponStore.removeSelection(id) : couponStore.addToCoupon(data)
}
</script>
