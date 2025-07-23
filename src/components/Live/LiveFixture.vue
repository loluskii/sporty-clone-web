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
    <div class="x-table-cell market-cell" :class="{ 'two-markets': activeMarkets.length > 1 }">
      <div class="x-market market" v-for="(market, i) in groupedOutcomes" :key="i">
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
          <EmptyOdds v-for="outcome in getOutcomeCountForMarket(i)" :key="outcome.outcomeID" />
        </template>
      </div>
    </div>
    <div class="x-table-cell market-size" @click="goToMatchDetail">+{{ match.activeMarkets }}</div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import _ from 'lodash'
import { slugify, createID, isSelected } from '@/helpers'
import { useCouponStore, useUtilsStore } from '@/stores'
import { useMqttService } from '@/composables/useMqtt'
import EmptyOdds from '../EmptyOdds.vue'
import Odds from './Odds.vue'
import emitter from '@/plugins/emitter'

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
})

// Store and Router
const couponStore = useCouponStore()
const router = useRouter()
const utilsStore = useUtilsStore()
const updatePending = ref(false)
const updatedOutcomes = ref({})
const timer = ref(null)
const displayTime = ref(props.match.eventTime || '00:00')

// Score state
const score = ref({
  home: props.match.homeScore || '0',
  away: props.match.awayScore || '0',
  status: props.match.matchStatus || 0
})

// MQTT Service
const { subscribe } = useMqttService()

// MQTT Topics
const oddsChangeTopic = `feeds/live/odds_change/${props.match.matchID}`
const betStopTopic = `feeds/live/bet_stop/${props.match.matchID}`
const fixtureStatus = `feeds/live/fixture_status/${props.match.matchID}`

// MQTT Handlers
const handleOddsChange = (data) => {
  if (!data || !data.markets) {
    // console.log(`📊 MQTT: Invalid odds change data received for match ${props.match.matchID}`);
    return
  }

  const matchId = props.match.matchID
  const dataMatchId = data.event_id || data.match_id

  if (dataMatchId && String(dataMatchId) !== String(matchId)) {
    // console.log(`📊 MQTT: Ignoring odds change for match ID ${dataMatchId}, our match ID is ${matchId}`);
    return
  }

  // console.log(`📊 MQTT: Processing odds change for match ID ${matchId}`);

  if (!updatePending.value) {
    updatePending.value = true

    requestAnimationFrame(() => {
      try {
        // Update scores
        if (data.sport_event_status) {
          score.value = {
            home: data.sport_event_status.home_score,
            away: data.sport_event_status.away_score
          }
        }

        // Update markets and outcomes
        if (data.markets?.length > 0) {
          const updatedOutcomesCopy = { ...updatedOutcomes.value }

          data.markets.forEach((market) => {
            if (!market.outcomes) return

            const activeMarket = props.activeMarkets.find((m) => m.marketID == market.id)
            if (!activeMarket) return

            market.outcomes?.forEach((outcome) => {
              const existingOutcomeIndex = props.match.outcomes.findIndex(
                (o) => o.outcomeID == outcome.id
              )

              if (existingOutcomeIndex !== -1) {
                // Update existing outcome while preserving original fields
                props.match.outcomes[existingOutcomeIndex] = {
                  ...props.match.outcomes[existingOutcomeIndex],
                  odds: outcome.odds,
                  active: outcome.active ? 1 : 0
                }
              } else {
                // console.log('New outcome found:', outcome.id);
              }
            })
          })

          updatedOutcomes.value = updatedOutcomesCopy
        }
      } catch (error) {
        console.error(`❌ MQTT: Error processing odds change for match ${matchId}:`, error)
      } finally {
        updatePending.value = false
      }
    })
  }
}

const handleBetStop = (data) => {
  const matchId = props.match.matchID
  const dataMatchId = data.event_id || data.match_id

  if (dataMatchId && String(dataMatchId) !== String(matchId)) {
    // console.log(`📊 MQTT: Ignoring bet stop for match ID ${dataMatchId}, our match ID is ${matchId}`);
    return
  }

  // console.log(`📊 MQTT: Processing bet stop for match ID ${matchId}`);

  requestAnimationFrame(() => {
    try {
      // Update the outcomes array
      const newOutcomes = props.match.outcomes.map((outcome) => ({
        ...outcome,
        odds: 0,
        active: 0
      }))

      // Update the outcomes map
      const updatedOutcomesCopy = { ...updatedOutcomes.value }
      newOutcomes.forEach((outcome) => {
        const key = `${outcome.marketID}-${outcome.outcomeID}-${outcome.specifier || ''}`
        updatedOutcomesCopy[key] = {
          odds: 0,
          active: 0
        }
      })

      // Update both states
      updatedOutcomes.value = updatedOutcomesCopy
      props.match.outcomes = newOutcomes
    } catch (error) {
      console.error(`❌ MQTT: Error processing bet stop for match ${matchId}:`, error)
    }
  })
}

const handleFixtureStatus = (data) => {
  const matchId = props.match.matchID
  const dataMatchId = data.event_id || data.match_id

  if (dataMatchId && String(dataMatchId) !== String(matchId)) {
    // console.log(`📊 MQTT: Ignoring fixture status for match ID ${dataMatchId}, our match ID is ${matchId}`);
    return
  }

  // console.log(`📊 MQTT: Processing fixture status for match ID ${matchId}:`, data);

  requestAnimationFrame(() => {
    try {
      // Check if match has ended
      if (data.status_code === 100) {
        // console.log(`🏁 MQTT: Match ${matchId} has ended, removing from list`);
        emitter.emit('match-ended', matchId)
        return
      }

      // Update scores
      score.value = {
        home: data.home_score,
        away: data.away_score,
        status: data.match_status
      }

      // Update time and status
      displayTime.value = data.event_time
      props.match.matchStatus = data.match_status

      // Restart timer with new time
      startTimer()
    } catch (error) {
      console.error(`❌ MQTT: Error processing fixture status for match ${matchId}:`, error)
    }
  })
}

// Time handling functions
const parseTimeToSeconds = (timeStr) => {
  if (!timeStr || timeStr === '--:--') return null
  try {
    const [minutes, seconds] = timeStr.split(':').map(Number)
    if (isNaN(minutes) || isNaN(seconds)) return null
    return minutes * 60 + seconds
  } catch (error) {
    return null
  }
}

const formatSecondsToTime = (seconds) => {
  try {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } catch (error) {
    return '00:00'
  }
}

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

const startTimer = () => {
  stopTimer()

  // Handle halftime/fulltime
  if (('--:--', '45:00', '90:00').includes(displayTime.value)) {
    return
  }

  const initialTime = parseTimeToSeconds(displayTime.value)
  if (initialTime === null || initialTime === 45 * 60 || initialTime === 90 * 60) return

  let currentSeconds = initialTime
  displayTime.value = formatSecondsToTime(currentSeconds)

  timer.value = setInterval(() => {
    try {
      currentSeconds++

      // Stop at key match times
      if (currentSeconds === 45 * 60 || currentSeconds === 90 * 60) {
        stopTimer()
        return
      }

      displayTime.value = formatSecondsToTime(currentSeconds)
    } catch (error) {
      stopTimer()
    }
  }, 1000)
}

// Subscribe to MQTT topics
onMounted(() => {
  // console.log(`🏗️ Component: Setting up MQTT subscriptions for match ID: ${props.match.matchID}`);

  const matchId = props.match.matchID
  // const componentId = `fixture-${matchId}-${Date.now()}`;

  const topics = {
    oddsChange: oddsChangeTopic,
    betStop: betStopTopic,
    fixtureStatus: fixtureStatus
  }

  const handlers = {
    oddsChange: handleOddsChange,
    betStop: handleBetStop,
    fixtureStatus: handleFixtureStatus
  }

  const unsubscribers = Object.entries(topics).map(([key, topic]) => {
    // console.log(`📊 Subscribing to ${key} on topic: ${topic}`);
    return subscribe(topic, (data) => {
      // console.log(`📊 MQTT: Received message on topic ${topic} for component ${componentId}`, data);
      handlers[key](data)
    })
  })

  onUnmounted(() => {
    // console.log(`🧹 Component: Cleaning up MQTT subscriptions for match ID: ${matchId}`);
    unsubscribers.forEach((unsubscribe) => unsubscribe())
    stopTimer()
  })
})

// Watch for time changes to start/stop timer
watch(
  () => displayTime.value,
  (newTime) => {
    if (newTime) {
      startTimer()
    }
  },
  { immediate: true }
)

// Memoized computed properties
const groupedOutcomes = computed(() => {
  const marketIDs = props.activeMarkets.map((item) => parseInt(item.marketID))
  const filteredOutcomes = props.match.outcomes
    .filter((outcome) => marketIDs.includes(outcome.marketID))
    .sort((a, b) => a.outcomeID - b.outcomeID)

  const grouped = _.groupBy(filteredOutcomes, 'marketID')

  // Ensure all marketIDs are present
  marketIDs.forEach((marketID) => {
    if (!grouped[marketID]) {
      grouped[marketID] = []
    }
  })

  return grouped
})

// Methods
const goToMatchDetail = () => {
  utilsStore.liveListSingleMatch = props.match.matchID
  router.push({
    name: 'live-fixtures-specific-detail',
    params: {
      sport: slugify(props.match.sportName),
      tournament: slugify(props.match.tournament),
      match: slugify(props.match.name),
      match_id: props.match.matchID
    }
  })
}

const getOutcomeCountForMarket = (marketID) => {
  const activeMarket = props.activeMarkets.find((market) => market.marketID === marketID)
  return activeMarket?.outcomes.length || 0
}

const addToBetslip = (event, odd, market) => {
  if (odd.odds <= 1) return

  const id = createID(event.gameID, event.matchID, odd.outcomeName, odd.oddID, event.name)

  const data = {
    fixture: event,
    market_name: props.activeMarkets.find((m) => m.marketID == market[0].marketID)?.marketName,
    market_id: market[0].marketID,
    ele_id: id,
    outcome: odd,
    odds: odd.odds,
    odd_id: odd.oddID,
    odd_name: odd.outcomeName,
    type: 'live',
    event_id: event.gameID,
    specifier: odd.specifier
  }

  isSelected(id, couponStore.coupon)
    ? couponStore.removeSelection(id)
    : couponStore.addToCoupon(data)
}

// Timer state
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
