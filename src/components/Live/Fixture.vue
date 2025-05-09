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
        <div class="teams" @click="goToMatchDetail">
          <div class="home-team">{{ match.homeTeam }}</div>
          <div class="away-team">{{ match.awayTeam }}</div>
        </div>
        <div class="score">
          <div class="score-item">{{ match.homeScore }}</div>
          <div class="score-item">{{ match.awayScore }}</div>
        </div>
      </div>
    </div>
    <div
      class="x-table-cell market-cell"
      :class="{ 'two-markets': activeMarkets.length > 1 }"
    >
      <div
        class="x-market market"
        v-for="(market, i) in groupedOutcomes"
        :key="i"
      >
        <template v-if="market.length">
          <Odds
            v-for="odds in market"
            :key="odds.outcomeID"
            :odds="odds"
            :match="match"
            @click="addToBetslip(match, odds, market)"
          />
        </template>
        <template v-else>
          <EmptyOdds
            v-for="outcome in getOutcomeCountForMarket(i)"
            :key="outcome.outcomeID"
          />
        </template>
      </div>
    </div>
    <div
      class="x-table-cell market-size"
      @click="goToMatchDetail"
    >
      +{{ match.activeMarkets }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import _ from 'lodash';
import { slugify, createID, isSelected } from '@/helpers';
import { useCouponStore, useUtilsStore } from '@/stores';
import EmptyOdds from '../EmptyOdds.vue';
import Odds from './Odds.vue';

// Props
const props = defineProps({
  match: {
    type: Object,
    required: true
  },
  activeMarkets: {
    type: Array,
    required: true
  }
});

// Store and Router
const couponStore = useCouponStore();
const router = useRouter();
const utilsStore = useUtilsStore();

// Memoized computed properties
const groupedOutcomes = computed(() => {
  const marketIDs = props.activeMarkets.map(item => parseInt(item.marketID));
  const filteredOutcomes = props.match.outcomes
    .filter(outcome => marketIDs.includes(outcome.marketID))
    .sort((a, b) => a.outcomeID - b.outcomeID);
  
  const grouped = _.groupBy(filteredOutcomes, 'marketID');
  
  // Ensure all marketIDs are present
  marketIDs.forEach(marketID => {
    if (!grouped[marketID]) {
      grouped[marketID] = [];
    }
  });

  return grouped;
});

// Methods
const goToMatchDetail = () => {
  utilsStore.liveListSingleMatch = props.match.matchID;
  router.push({
    name: 'live-fixtures-specific-detail',
    params: {
      sport: slugify(props.match.sportName),
      tournament: slugify(props.match.tournament),
      match: slugify(props.match.name),
      match_id: props.match.matchID,
    },
  });
};

const getOutcomeCountForMarket = (marketID) => {
  const activeMarket = props.activeMarkets.find(market => market.marketID === marketID);
  return activeMarket?.outcomes.length || 0;
};

const addToBetslip = (event, odd, market) => {
  if (odd.odds <= 1) return;
  
  const id = createID(
    event.gameID,
    event.matchID,
    odd.outcomeName,
    odd.oddID,
    event.name
  );

  const data = {
    fixture: event,
    market_name: props.activeMarkets.find(m => m.marketID == market[0].marketID)?.marketName,
    market_id: market[0].marketID,
    ele_id: id,
    outcome: odd,
    odds: odd.odds,
    odd_id: odd.oddID,
    odd_name: odd.outcomeName,
    type: 'live',
    event_id: event.gameID,
    specifier: odd.specifier,
  };

  isSelected(id, couponStore.coupon)
    ? couponStore.removeSelection(id)
    : couponStore.addToCoupon(data);
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
