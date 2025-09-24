<template>
  <div class="x-table-row m-content-row match-row">
    <div class="x-table-cell left-team-cell">
      <div class="left-team-table">
        <div class="time">
          <div class="clock-time">{{ localGame.eventTime }}&nbsp;&nbsp;</div>
          <div class="game-id"><span class="game-id-label">ID: </span>{{ localGame.gameID }}</div>
        </div>
        <div
          title=""
          class="teams"
          @click="
            $router.push({
              name: 'fixtures-detail',
              params: {
                sport: slugify(localGame.sportName),
                tournament_name: slugify(localGame.tournament),
                event_name: slugify(localGame.name),
                event_id: localGame.matchID
              }
            })
          "
        >
          <div class="home-team">{{ localGame.homeTeam }}</div>
          <div class="away-team">{{ localGame.awayTeam }}</div>
        </div>
        <div class="lmt-icon" @click="showFixtureAnalysis(localGame.matchID)">
          <em class="icon"></em>
        </div>
      </div>
    </div>
    <div
      class="x-table-cell market-cell"
      :class="getFilteredOutcomes(localGame.outcomes).length > 1 ? 'two-markets' : ''"
    >
      <div
        class="x-market market"
        v-for="(market, m) in getFilteredOutcomes(localGame.outcomes)"
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
                :class="'af-select-list-' + localGame.gameID"
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
                createID(
                  localGame.gameID,
                  localGame.matchID,
                  k.outcomeName,
                  k.oddID,
                  localGame.name
                ),
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
    <div
      class="x-table-cell market-size"
      @click="
        $router.push({
          name: 'fixtures-detail',
          params: {
            sport: slugify(localGame.sportName),
            tournament_name: slugify(localGame.tournament),
            event_name: slugify(localGame.name),
            event_id: localGame.matchID
          }
        })
      "
    >
      +{{ localGame.activeMarkets }}
    </div>
  </div>
</template>

<script setup>
import { createID, isSelected, sortArr, slugify } from '@/helpers'
import { useCouponStore } from '@/stores'
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useMqttService } from '@/composables/useMqtt'

import EmptyOdds from '../EmptyOdds.vue'
const couponStore = useCouponStore()

const props = defineProps({
  selectedMarkets: Object,
  activeSportMarkets: Object,
  game: Object
})

// Create a local reactive copy of the game data
const localGame = ref({ ...props.game })

// Watch for changes in the original game prop and update local copy
watch(
  () => props.game,
  (newGame) => {
    localGame.value = { ...newGame }
  },
  { deep: true }
)

const activeSpecifier = ref()
const specifierOpen = ref(false)

const updatePending = ref(false)
const updatedOutcomes = ref({})

// MQTT Service
const { subscribe } = useMqttService()

// MQTT Topics - use localGame instead of props.game
const oddsChangeTopic = computed(() => `feeds/prematch/odds_change/${localGame.value.matchID}`)
const betStopTopic = computed(() => `feeds/prematch/bet_stop/${localGame.value.matchID}`)

// MQTT Handlers
const handleOddsChange = (data) => {
  // console.log('[MQTT] Odds change received:', data);

  if (!data || !data.markets) {
    return
  }

  if (String(data.event_id) !== String(localGame.value.matchID)) {
    return
  }

  if (!updatePending.value) {
    updatePending.value = true

    requestAnimationFrame(() => {
      // Update markets and outcomes on local copy
      if (data.markets && data.markets.length > 0) {
        data.markets.forEach((market) => {
          if (!market.outcomes) {
            return
          }

          // Find matching market in selectedMarkets
          const selectedMarket = props.selectedMarkets.find((m) => m.marketID == market.id)
          if (!selectedMarket) {
            return
          }

          // Update outcomes in local copy
          market.outcomes.forEach((newOutcome) => {
            const existingOutcomeIndex = localGame.value.outcomes.findIndex(
              (o) => o.marketID === market.id && o.outcomeID === newOutcome.id
            )

            if (existingOutcomeIndex !== -1) {
              localGame.value.outcomes[existingOutcomeIndex] = {
                ...localGame.value.outcomes[existingOutcomeIndex],
                odds: newOutcome.odds,
                active: newOutcome.active
              }

              // Update the outcomes map for tracking changes
              const key = `${market.id}-${newOutcome.id}-${newOutcome.specifier || ''}`
              updatedOutcomes.value[key] = {
                odds: newOutcome.odds,
                active: newOutcome.active
              }
            }
          })
        })
      }

      updatePending.value = false
    })
  }
}

const handleBetStop = (data) => {
  // console.log(`[MQTT] Bet stop received for match ${localGame.value.matchID}`);

  if (String(data.event_id) !== String(localGame.value.matchID)) {
    return
  }

  // Set all outcomes to inactive with 0 odds in local copy
  requestAnimationFrame(() => {
    // Update the outcomes array
    const newOutcomes = localGame.value.outcomes.map((outcome) => ({
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
    localGame.value.outcomes = newOutcomes
  })
}

// Subscribe to MQTT topics
onMounted(() => {
  // console.log(`[MQTT] Subscribing to topics for match ${localGame.value.matchID}:`,
  // {
  //   oddsChangeTopic: oddsChangeTopic.value,
  //   betStopTopic: betStopTopic.value,
  //   isConnected: isConnected.value
  // });

  const unsubscribeOdds = subscribe(oddsChangeTopic.value, handleOddsChange)
  const unsubscribeBetStop = subscribe(betStopTopic.value, handleBetStop)

  // Cleanup subscriptions on unmount
  onUnmounted(() => {
    // console.log(`[MQTT] Unsubscribing from topics for match ${localGame.value.matchID}`);
    unsubscribeOdds()
    unsubscribeBetStop()
  })
})

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
    
    // Add deduplication
    foundOutcomes = foundOutcomes.filter((outcome, index, self) => 
      index === self.findIndex(o => o.outcomeID === outcome.outcomeID)
    )
    
    const defaultSpecifier = getDefaultSpecifier(foundOutcomes)
    if (defaultSpecifier) {
      foundOutcomes = foundOutcomes.filter((outcome) => outcome.specifier === defaultSpecifier)
    }
    return {
      ...marketIDObj,
      specifier: defaultSpecifier,
      outcomes: foundOutcomes.map(({ marketID, ...rest }) => rest)
    }
  })
}

const getSpecifiers = computed(() => {
  const result = []
  const outcomes = localGame.value.outcomes // Changed from props.game.outcomes
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

// Export localGame for use in template
defineExpose({ localGame })
</script>
