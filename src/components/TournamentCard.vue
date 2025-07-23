<template>
  <div class="match-league-wrap" :class="{ 'is-loading': isLoading }">
    <div class="match-league" :class="{ 'hide': !cardIsShown }">
      <div class="league-title">
        <div 
          class="dis-icon" 
          @click="fetchFixtures"
          :disabled="isLoading"
          :title="isShown ? 'Refresh fixtures' : 'Load fixtures'"
        >
          <em :class="{ 'is-loading': isLoading }"></em>
      </div>
        <span class="text">{{ tournamentName }}</span>
      </div>

      <template v-if="isShown">
        <!-- Markets Navigation -->
        <div class="market-group">
          <div
            v-for="market in shownMarkets"
            :key="market.marketID"
            class="market-item"
            :class="{ 'active': market.marketID === activeMarket.marketID }"
            @click="setActiveMarket(market)"
            :disabled="isLoading"
          >
            {{ market.marketName }}
        </div>
        </div>

        <!-- Fixtures Table -->
        <div class="x-table match-table">
          <template v-for="(fixtures, date) in groupedFixtures" :key="date">
            <!-- Date Header -->
            <div class="x-table-row date-row">
              <div class="x-table-cell date">
                {{ formatDate(date, 'DD/MM dddd') }}
              </div>
              <div class="x-table-cell each-module-wrap">
                <div class="each-module-table">
                  <div
                    v-if="activeMarket.specifier"
                    class="each-module is-multiline"
                  >
                    {{ activeMarket.specifier }}
                  </div>
                  <div
                    v-for="outcome in sortedOutcomes"
                    :key="outcome.outcomeID"
                    class="each-module is-multiline"
                  >
                    {{ outcome.outcomeName }}
                  </div>
                </div>
              </div>
              <div class="x-table-cell empty-cell"></div>
            </div>

            <!-- Fixtures -->
            <Prematch
              v-for="match in fixtures"
              :key="match.id"
              :match="match"
              :activeMarket="activeMarket"
            />
          </template>
        </div>
      </template>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import _ from 'lodash'
import { formatDate, sortArr } from '@/helpers'
import Prematch from './Prematch/PrematchFixture.vue'
import emitter from '@/plugins/emitter'

const props = defineProps({
  tournamentName: {
    type: String,
    required: true
  },
  events: {
    type: Array,
    default: () => []
  },
  markets: {
    type: Array,
    default: () => []
  },
  tournamentID: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['fetch-fixtures'])

// State
const isShown = ref(true)
const isLoading = ref(false)
const activeMarket = ref({})
const error = ref(null)

// Computed Properties
const cardIsShown = computed(() => isShown.value && props.events.length > 0)

const shownMarkets = computed(() => {
  if (!props.markets?.length) return []
  
  return props.markets.length > 5
    ? props.markets.filter(market => 
        market.marketID !== '36' && market.marketID !== '547'
      )
    : props.markets
})

const groupedFixtures = computed(() => {
  return _.groupBy(props.events, fixture => fixture.date.split(' ')[0])
})

const sortedOutcomes = computed(() => {
  return activeMarket.value.outcomes 
    ? sortArr(activeMarket.value.outcomes, 'outcomeID')
    : []
})

// Watchers
watch(
  () => props.markets,
  (newMarkets) => {
    if (newMarkets?.length) {
      activeMarket.value = newMarkets[0]
    }
  },
  { immediate: true }
)

watch(
  () => props.events,
  (newEvents) => {
    isShown.value = newEvents?.length > 0
  },
  { immediate: true }
)

// Methods
const setActiveMarket = (market) => {
  if (isLoading.value) return
  
  try {
    const sortedMarket = {
      ...market,
      outcomes: sortArr(market.outcomes, 'outcomeID')
    }
    activeMarket.value = sortedMarket
    emitter.emit('activeMarketChange')
  } catch (err) {
    console.error('Error setting active market:', err)
    error.value = 'Failed to update market selection'
  }
}

const fetchFixtures = async () => {
  if (isLoading.value) return
  
  try {
    isLoading.value = true
    error.value = null
    
    // Toggle isShown if we have events
    if (props.events.length) {
      isShown.value = !isShown.value
      return
    }
    
    // If no events, fetch them
    emit('fetch-fixtures', props.tournamentID)
    isShown.value = true
  } catch (err) {
    console.error('Error fetching fixtures:', err)
    error.value = 'Failed to load fixtures'
  } finally {
    isLoading.value = false
  }
}

// Cleanup
onUnmounted(() => {
  // Cleanup any subscriptions or event listeners if needed
})
</script>
<style lang=""></style>
