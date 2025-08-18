<template>
  <div class="x-table-row x-content-row match-row">
    <div class="x-table-cell left-team-cell">
      <div class="left-team-table">
        <div class="time">
          <div class="clock-time">{{ localMatch.eventTime }}&nbsp;&nbsp;</div>
          <div class="game-id"><span class="game-id-label">ID: </span>{{ localMatch.gameID }}</div>
        </div>
        <div
          title=""
          class="teams"
          @click="
            $router.push({
              name: 'fixtures-detail',
              params: {
                sport: slugify(localMatch.sportName),
                tournament_name: slugify(localMatch.tournament),
                event_name: slugify(localMatch.name),
                event_id: localMatch.matchID
              }
            })
          "
        >
          <div class="home-team">{{ localMatch.homeTeam }}</div>
          <div class="away-team">{{ localMatch.awayTeam }}</div>
        </div>
        <div class="lmt-icon" @click="showFixtureAnalysis(localMatch.matchID)">
          <em class="icon"></em>
        </div>
      </div>
    </div>
    <div class="x-table-cell market-cell">
      <div class="x-market market">
        <template v-if="localMatch.outcomes && localMatch.activeMarkets">
          <template v-if="outcomes.length">
            <div
              v-if="activeMarket && activeMarket.specifier !== ''"
              class="x-outcome specifiers-select"
            >
              <div tabindex="0" class="af-select" @click="toggleList">
                <div class="af-select-title">
                  <span class="af-select-input">{{ activeSpecifier }}</span>
                  <span class="af-select-icon-item"><em class="icon">^</em></span>
                  <div
                    class="af-select-list animate-core"
                    v-if="specifierOpen"
                    :class="'af-select-list-' + localMatch.matchID"
                    style="opacity: 1; width: 100%"
                  >
                    <span
                      class="af-select-item"
                      @click="setActiveSpecifier(item)"
                      v-for="(item, i) in getSpecifiers"
                      :key="i"
                      >{{ item.value }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div
              class="x-outcome"
              v-for="(odds, odd) in outcomes"
              @click="addToBetslip(match, odds)"
              :key="odd"
              :class="
                odds.odds <= 1
                  ? 'x-outcome--disabled'
                  : isSelected(
                        createID(
                          localMatch.gameID,
                          localMatch.matchID,
                          odds.outcomeName,
                          odds.oddID,
                          localMatch.name
                        ),
                        couponStore.coupon
                      )
                    ? 'x-outcome--checked'
                    : ''
              "
            >
              <span v-if="odds.odds > 1" class="x-outcome-odds">{{ odds.odds.toFixed(2) }}</span>
              <span v-else class="x-icon-lock"></span>
            </div>
          </template>
          <template v-else>
            <div
              v-if="activeMarket && activeMarket.specifier !== ''"
              class="x-outcome x-outcome--disabled specifiers-select"
            >
              <span class="x-icon-lock"></span>
            </div>
            <EmptyOdds v-for="(odd, index) in activeMarket?.outcomes" :key="index"></EmptyOdds>
          </template>
        </template>
        <template v-else>
          <EmptyOdds></EmptyOdds>
        </template>
      </div>
    </div>
    <div
      class="x-table-cell market-size"
      @click="
        $router.push({
          name: 'fixtures-detail',
          params: {
            sport: slugify(localMatch.sportName),
            tournament_name: slugify(localMatch.tournament),
            event_name: slugify(localMatch.name),
            event_id: localMatch.matchID
          }
        })
      "
    >
      +{{ localMatch.activeMarkets }}
    </div>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, watch, onUnmounted } from 'vue'
import { slugify, sortArr, createID, isSelected, uniqueOdds } from '@/helpers'
import EmptyOdds from '../EmptyOdds.vue'
import { useCouponStore } from '@/stores'
import { useMqttService } from '@/composables/useMqtt'

const couponStore = useCouponStore()
const props = defineProps({
  activeMarket: Object,
  match: Object
})

// Create a local reactive copy of the match data
const localMatch = ref({ ...props.match })

// Watch for changes in the original match prop and update local copy
watch(
  () => props.match,
  (newMatch) => {
    localMatch.value = { ...newMatch }
  },
  { deep: true }
)

const activeSpecifier = ref()
const specifierOpen = ref(false)
const outcomes = ref([])
const updatePending = ref(false)
const updatedOutcomes = ref({})

// MQTT Service
const { subscribe } = useMqttService()

// MQTT Topics - use computed properties with localMatch
const oddsChangeTopic = computed(() => `feeds/prematch/odds_change/${localMatch.value.matchID}`)
const betStopTopic = computed(() => `feeds/prematch/bet_stop/${localMatch.value.matchID}`)

// MQTT Handlers
const handleOddsChange = (data) => {
  // console.log('[MQTT] Odds change received:', data);

  if (!data || !data.markets) {
    return
  }

  if (String(data.event_id) !== String(localMatch.value.matchID)) {
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

          // Note: props.activeMarkets doesn't exist in this component, using props.activeMarket
          if (props.activeMarket && props.activeMarket.marketID != market.id) {
            return
          }

          // Update outcomes in local copy
          market.outcomes.forEach((newOutcome) => {
            const existingOutcomeIndex = localMatch.value.outcomes.findIndex(
              (o) => o.marketID === market.id && o.outcomeID === newOutcome.id
            )

            if (existingOutcomeIndex !== -1) {
              localMatch.value.outcomes[existingOutcomeIndex] = {
                ...localMatch.value.outcomes[existingOutcomeIndex],
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
  // console.log(`[MQTT] Bet stop received for match ${localMatch.value.matchID}`);

  if (String(data.event_id) !== String(localMatch.value.matchID)) {
    return
  }

  // Set all outcomes to inactive with 0 odds on local copy
  requestAnimationFrame(() => {
    // Update the outcomes array
    const newOutcomes = localMatch.value.outcomes.map((outcome) => ({
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
    localMatch.value.outcomes = newOutcomes
  })
}

// Subscribe to MQTT topics
onMounted(() => {
  // console.log(`[MQTT] Subscribing to topics for match ${localMatch.value.matchID}:`, {
  //   oddsChangeTopic: oddsChangeTopic.value,
  //   betStopTopic: betStopTopic.value,
  //   isConnected: isConnected.value
  // });

  const unsubscribeOdds = subscribe(oddsChangeTopic.value, handleOddsChange)
  const unsubscribeBetStop = subscribe(betStopTopic.value, handleBetStop)

  // Cleanup subscriptions on unmount
  onUnmounted(() => {
    // console.log(`[MQTT] Unsubscribing from topics for match ${localMatch.value.matchID}`);
    unsubscribeOdds()
    unsubscribeBetStop()
  })
})

const getSpecifiers = computed(() => {
  if (props.activeMarket && props.activeMarket.specifier && props.activeMarket.specifier !== '') {
    const result = []

    const outcomes = localMatch.value.outcomes // Use localMatch instead of props.match
    if (outcomes.length > 0) {
      const filtered = outcomes.filter(
        (item) => item.marketID === parseInt(props.activeMarket.marketID)
      )

      filtered.forEach((outcome) => {
        let specifier = outcome.specifier
        let found = result.find((item) => item.specifier === specifier)
        if (!found)
          // check if specifier has been listed
          result.push({ specifier, value: specifier.split('=')[1] }) //push value to array
      })
    }
    return result.sort((a, b) => a.value - b.value)
  } else {
    return []
  }
})

const getOdds = () => {
  // Find and return the odds based on marketID and outcomeID
  if (props.activeMarket && localMatch.value.activeMarkets > 0) {
    if (localMatch.value.outcomes) {
      const odds = localMatch.value.outcomes // Use localMatch
      let filtered = odds.filter((item) => item.marketID === parseInt(props.activeMarket.marketID))
      if (props.activeMarket.specifier && props.activeMarket.specifier !== '') {
        let defaultSpecifier = filtered[0]?.specifier
        if (defaultSpecifier) {
          filtered = filtered.filter((item) => item.specifier === defaultSpecifier)
          activeSpecifier.value = defaultSpecifier.split('=')[1]
        }
      } else {
        filtered = uniqueOdds(filtered)
      }
      if (filtered.length) {
        // Update the outcomes map for tracking changes
        filtered.forEach((outcome) => {
          const key = `${outcome.marketID}-${outcome.outcomeID}-${outcome.specifier || ''}`
          updatedOutcomes.value[key] = {
            odds: outcome.odds,
            active: outcome.active
          }
        })
        outcomes.value = sortArr(uniqueOdds(filtered), 'outcomeID')
      } else {
        outcomes.value = []
      }
    }
  }
}

// Add a method to handle odds updates
const handleOddsUpdate = () => {
  if (!updatePending.value) {
    updatePending.value = true

    requestAnimationFrame(() => {
      if (localMatch.value.outcomes) {
        // Use localMatch
        const odds = localMatch.value.outcomes
        let filtered = odds.filter(
          (item) => item.marketID === parseInt(props.activeMarket.marketID)
        )

        if (props.activeMarket.specifier && props.activeMarket.specifier !== '') {
          filtered = filtered.filter((item) => item.specifier === activeSpecifier.value)
        }

        filtered = uniqueOdds(filtered)

        // Update the outcomes map for tracking changes
        filtered.forEach((outcome) => {
          const key = `${outcome.marketID}-${outcome.outcomeID}-${outcome.specifier || ''}`
          updatedOutcomes.value[key] = {
            odds: outcome.odds,
            active: outcome.active
          }
        })

        outcomes.value = sortArr(filtered, 'outcomeID')
      }

      updatePending.value = false
    })
  }
}

// Watch for odds changes on local copy
watch(
  () => localMatch.value.outcomes,
  (newOutcomes) => {
    if (newOutcomes) {
      handleOddsUpdate(newOutcomes)
    }
  },
  { deep: true }
)

function showFixtureAnalysis(id) {
  return window.open(
    `https://s5.sir.sportradar.com/betradar/en/match/${id}`,
    'stats',
    'width=1078,height=768'
  )
}

const setActiveSpecifier = (spec) => {
  if (localMatch.value.outcomes) {
    // Use localMatch
    const odds = localMatch.value.outcomes
    let filtered = odds.filter((item) => item.marketID === parseInt(props.activeMarket.marketID))
    filtered = filtered.filter((item) => item.specifier === spec.specifier)
    outcomes.value = sortArr(uniqueOdds(filtered), 'outcomeID')
    activeSpecifier.value = spec.value
  }
}

const toggleList = () => {
  specifierOpen.value = !specifierOpen.value
}

watch(
  () => props.activeMarket,
  () => {
    getOdds()
  },
  { immediate: true }
)

function addToBetslip(event, odd) {
  if (odd.odds <= 1) return
  const id = createID(event.gameID, event.matchID, odd.outcomeName, odd.oddID, event.name)
  const data = {
    fixture: event,
    market_name: props.activeMarket.marketName,
    market_id: odd.marketID,
    ele_id: id,
    outcome: odd,
    odds: odd.odds,
    odd_id: odd.oddID,
    odd_name: odd.outcomeName,
    type: 'prematch',
    event_id: event.gameID,
    specifier: odd.specifier
  }

  // return couponStore.addToCoupon(data)

  const existsInBetslip = isSelected(id, couponStore.coupon)
  return existsInBetslip ? couponStore.removeSelection(id) : couponStore.addToCoupon(data)
}

onMounted(() => {
  getOdds()
})

// Export localMatch for use in template
defineExpose({ localMatch, outcomes, activeSpecifier })
</script>
<style>
.af-select-item {
  display: inline-block;
  text-align: center;
  width: 100%;
}
.af-select-item.active {
  background-color: #fafafa;
  background-color: var(--background-general-primary);
  color: var(--brand-secondary);
  color: var(--brand-quaternary);
}
.af-select-item.hover {
  background-color: #f2f3f5;
  background-color: var(--background-type1-primary);
}
</style>
