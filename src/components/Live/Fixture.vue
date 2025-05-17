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
          <div class="clock-time">{{ displayTime }}</div>
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
import { computed, onMounted, onUnmounted, ref, watch, onBeforeUnmount } from 'vue';
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
const updatePending = ref(false);
const updatedOutcomes = ref({});

// Score state
const score = ref({
  home: props.match.homeScore || '0',
  away: props.match.awayScore || '0',
  status: props.match.matchStatus || 0,
});

const eventTime = ref(props.match.eventTime);

// MQTT Service
const { subscribe, isConnected } = useMqttService();

// MQTT Topics
const oddsChangeTopic = `feeds/live/odds_change/${props.match.matchID}`;
const betStopTopic = `feeds/live/bet_stop/${props.match.matchID}`;

// MQTT Handlers
const handleOddsChange = (data) => {
  console.log('[MQTT] Odds change received:', data);

  if (!data || !data.markets) {
    return;
  }

  if (String(data.event_id) !== String(props.match.matchID)) {
    return;
  }

  if (!updatePending.value) {
    updatePending.value = true;

    requestAnimationFrame(() => {
      // Update scores
      if (data.sport_event_status) {
        score.value = {
          home: data.sport_event_status.home_score,
          away: data.sport_event_status.away_score
        };
      }

      // Update markets and outcomes
      if (data.markets && data.markets.length > 0) {
        data.markets.forEach(market => {
          if (!market.outcomes) {
            return;
          }

          const activeMarket = props.activeMarkets.find(m => m.marketID == market.id);
          if (!activeMarket) {
            return;
          }

          // Update outcomes
          market.outcomes.forEach(newOutcome => {
            const existingOutcomeIndex = props.match.outcomes.findIndex(
              o => o.marketID == newOutcome.id
            );
            
            if (existingOutcomeIndex !== -1) {
              const oldOdds = props.match.outcomes[existingOutcomeIndex].odds;
              props.match.outcomes[existingOutcomeIndex] = {
                ...props.match.outcomes[existingOutcomeIndex],
                odds: newOutcome.odds,
                active: newOutcome.active
              };

              // Update the outcomes map for tracking changes
              const key = `${market.id}-${newOutcome.id}-${newOutcome.specifier || ""}`;
              updatedOutcomes.value[key] = {
                odds: newOutcome.odds,
                active: newOutcome.active
              };
            }
          });
        });
      }

      updatePending.value = false;
    });
  }
};

const handleBetStop = (data) => {
  console.log(`[MQTT] Bet stop received for match ${props.match.matchID}`);

  if (String(data.event_id) !== String(props.match.matchID)) {
    return;
  }

  // Set all outcomes to inactive with 0 odds
  requestAnimationFrame(() => {
    // Update the outcomes array
    const newOutcomes = props.match.outcomes.map(outcome => ({
      ...outcome,
      odds: 0,
      active: 0
    }));

    // Update the outcomes map
    const updatedOutcomesCopy = { ...updatedOutcomes.value };
    newOutcomes.forEach(outcome => {
      const key = `${outcome.marketID}-${outcome.outcomeID}-${outcome.specifier || ""}`;
      updatedOutcomesCopy[key] = {
        odds: 0,
        active: 0,
      };
    });

    // Update both states
    updatedOutcomes.value = updatedOutcomesCopy;
    props.match.outcomes = newOutcomes;
  });
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

// Timer state
const timer = ref(null);
const displayTime = ref(props.match.eventTime || '00:00');
const isFootball = computed(() => String(props.match.sportID) === '1');

// Function to parse time string (MM:SS) to seconds
const parseTimeToSeconds = (timeStr) => {
  if (!timeStr || timeStr === '--:--') return null;
  try {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    if (isNaN(minutes) || isNaN(seconds)) return null;
    return minutes * 60 + seconds;
  } catch (error) {
    return null;
  }
};

// Function to format seconds to MM:SS
const formatSecondsToTime = (seconds) => {
  try {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } catch (error) {
    return '00:00';
  }
};

// Function to start the timer
const startTimer = () => {
  // Only start timer for football (sport ID 1)
  if (!isFootball.value) {
    displayTime.value = props.match.eventTime;
    return;
  }

  // Clear any existing timer
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
  
  // Handle halftime/fulltime
  if (('--:--','45:00','90:00').includes(eventTime.value)) {
    return;
  }

  const initialTime = parseTimeToSeconds(eventTime.value);
  
  
  let currentSeconds = initialTime;
  
  // Update display immediately
  displayTime.value = formatSecondsToTime(currentSeconds);
  
  // Start the interval
  timer.value = setInterval(() => {
    try {
      currentSeconds++;
      
      // Stop at key match times
      if (currentSeconds === 45 * 60) {
        clearInterval(timer.value);
        timer.value = null;
        // displayTime.value = 'HT';
        return;
      }
      
      if (currentSeconds === 90 * 60) {
        clearInterval(timer.value);
        timer.value = null;
        // displayTime.value = 'FT';
        return;
      }
      
      displayTime.value = formatSecondsToTime(currentSeconds);
    } catch (error) {
      clearInterval(timer.value);
      timer.value = null;
    }
  }, 1000);
};

// Watch for match status changes
watch(() => props.match.matchStatus, (newStatus) => {
  if (isFootball.value) {
    if (newStatus === '7') { // Halftime
      displayTime.value = 'HT';
      if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
      }
    } else if (newStatus === '3') { // Match end
      displayTime.value = 'FT';
      if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
      }
    } else if (newStatus === '1') { // Live
      startTimer();
    }
  }
}, { immediate: true });

// Clean up timer on component unmount
onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
});

// Start timer when component mounts if match is live
onMounted(() => {
  if (isFootball.value) {
    startTimer();
  }
});
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
