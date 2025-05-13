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
          <div class="score-item">{{ score.home }}</div>
          <div class="score-item">{{ score.away }}</div>
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
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import _ from 'lodash';
import { slugify, createID, isSelected } from '@/helpers';
import { useCouponStore, useUtilsStore } from '@/stores';
import { useMqttService } from '@/composables/useMqtt';
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

// Score state
const score = ref({
  home: props.match.homeScore || '0',
  away: props.match.awayScore || '0',
  status: props.match.matchStatus || 0,
});

// MQTT Service
const { subscribe, isConnected } = useMqttService();

// MQTT Topics
const oddsChangeTopic = `feeds/live/odds_change/${props.match.matchID}`;
const betStopTopic = `feeds/live/bet_stop/${props.match.matchID}`;

// MQTT Handlers
const handleOddsChange = (data) => {
  console.log(`[MQTT] Odds change received for match ${props.match.matchID}:`, data);

  if (data.match_id === props.match.matchID) {
    // Update match status if available
    if (data.sport_event_status) {
      const status = data.sport_event_status;
      
      // Update score object
      score.value = {
        home: status.home_score ,
        away: status.away_score,
      };
    }

    // Update markets and outcomes
    if (data.markets) {
      data.markets.forEach(market => {
        // Skip markets with no outcomes or inactive status
        if (!market.outcomes || market.status !== 0) return;

        // Find matching market in activeMarkets
        const activeMarket = props.activeMarkets.find(m => m.marketID == market.id);
        if (!activeMarket) return;

        // Update outcomes
        market.outcomes.forEach(newOutcome => {
          const existingOutcomeIndex = props.match.outcomes.findIndex(
            o => o.outcomeID == newOutcome.id
          );
          
          if (existingOutcomeIndex !== -1) {
            props.match.outcomes[existingOutcomeIndex] = {
              ...props.match.outcomes[existingOutcomeIndex],
              odds: newOutcome.odds,
              active: newOutcome.active,
              probability: newOutcome.probability
            };
          }
        });
      });
    }
  }
};

const handleBetStop = (data) => {
  console.log(`[MQTT] Bet stop received for match ${props.match.matchID}:`, {
    matchID: data.matchID,
    status: data.status,
    outcomesCount: data.outcomes?.length,
    timestamp: new Date().toISOString()
  });

  if (data.matchID === props.match.matchID) {
    const oldStatus = props.match.matchStatus;
    // Update match status
    props.match.matchStatus = data.status;
    console.log(`[MQTT] Updated match status:`, {
      oldStatus,
      newStatus: data.status
    });
    
    // Update outcomes status if provided
    if (data.outcomes) {
      data.outcomes.forEach(outcome => {
        const existingOutcomeIndex = props.match.outcomes.findIndex(
          o => o.outcomeID === outcome.outcomeID
        );
        
        if (existingOutcomeIndex !== -1) {
          const oldStatus = props.match.outcomes[existingOutcomeIndex].status;
          props.match.outcomes[existingOutcomeIndex].status = outcome.status;
          console.log(`[MQTT] Updated outcome status:`, {
            outcomeID: outcome.outcomeID,
            oldStatus,
            newStatus: outcome.status
          });
        } else {
          console.log(`[MQTT] Outcome ${outcome.outcomeID} not found in match ${props.match.matchID}`);
        }
      });
    }
  } else {
    console.log(`[MQTT] Received bet stop for different match:`, {
      receivedMatchID: data.matchID,
      currentMatchID: props.match.matchID
    });
  }
};

// Subscribe to MQTT topics
onMounted(() => {
  console.log(`[MQTT] Subscribing to topics for match ${props.match.matchID}:`, {
    oddsChangeTopic,
    betStopTopic,
    isConnected: isConnected.value
  });

  const unsubscribeOdds = subscribe(oddsChangeTopic, handleOddsChange);
  const unsubscribeBetStop = subscribe(betStopTopic, handleBetStop);

  // Cleanup subscriptions on unmount
  onUnmounted(() => {
    console.log(`[MQTT] Unsubscribing from topics for match ${props.match.matchID}`);
    unsubscribeOdds();
    unsubscribeBetStop();
  });
});

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
