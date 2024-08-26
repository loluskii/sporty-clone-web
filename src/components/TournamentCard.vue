<template>
  <div class="match-league-wrap" style="position: relative">
    <div class="match-league" :class="cardIsShown ? '' : 'hide'">
      <div class="league-title">
        <span class="dis-icon" @click="fetchFixtures"><em></em></span>
        <span class="text"> {{ tournamentName }}</span>
      </div>

      <template v-if="isShown">
        <div class="market-group clearfix">
          <div
            v-for="(market, m) in shownMarkets"
            :key="m"
            class="market-item"
            :class="market.marketID == activeMarket.marketID ? 'active' : ''"
            @click="setActiveMarket(market)"
          >
            {{ market.marketName }}
          </div>
          <div
            tabindex="0"
            v-if="markets && markets.length > 7"
            @click="showOtherMarkets"
            :class="toggleOtherMarkets ? 'show-item' : ''"
            class="market-item x-select-market"
          >
            <div class="select-value">Other Markets<i class="x-icon-fold"></i></div>
            <ul class="select-list">
              <li
                v-for="(market, k) in hiddenMarkets"
                :key="k"
                style="text-transform: capitalize"
                class=""
              >
                {{ market.marketName }}
              </li>
            </ul>
          </div>
        </div>
        <div class="x-table match-table">
          <template
            v-for="(fixture, f) in _.groupBy(events, (fixture) => fixture.date.split(' ')[0])"
            :key="f"
          >
            <div class="x-table-row date-row">
              <div class="x-table-cell date">{{ formatDate(f, 'DD/MM dddd') }}</div>
              <div class="x-table-cell each-module-wrap">
                <div class="each-module-table">
                  <div
                    v-if="activeMarket.specifier !== ''"
                    style="text-transform: capitalize"
                    class="each-module is-multiline"
                  >
                    {{ activeMarket.specifier }}
                  </div>
                  <div
                    v-for="(outcome, o) in activeMarket.outcomes"
                    :key="o"
                    class="each-module is-multiline"
                  >
                    {{ outcome.outcomeName }}
                  </div>
                </div>
              </div>
              <div class="x-table-cell empty-cell"></div>
            </div>
            <!-- {{ fixture }} -->
            <Prematch
              v-for="(match, m) in fixture"
              :match="match"
              :key="m"
              :activeMarket="activeMarket"
            ></Prematch>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import _ from 'lodash'
import { ref, computed, defineEmits, watch } from 'vue'
import { formatDate, sortArr } from '@/helpers'
import Prematch from './Prematch/Prematch.vue'
import emitter from '@/plugins/emitter'
const props = defineProps({
  tournamentName: String,
  events: Array,
  markets: Array,
  tournamentID: Number
})
const emit = defineEmits(['fetch-fixtures'])

const isShown = ref(false)

const activeMarket = ref({})

watch(
  () => props.markets,
  (newMarkets) => {
    activeMarket.value = newMarkets && newMarkets.length ? newMarkets[0] : {}
  },
  { immediate: true }
)

watch(
  () => props.events,
  (newEvents) => {
    isShown.value = newEvents.length
  },
  { immediate: true }
)

const cardIsShown = computed(() => {
  return isShown.value && props.events.length
})
const toggleOtherMarkets = ref(false)

const shownMarkets = computed(() => {
  return props.markets && props.markets.length > 5
    ? props.markets.slice(0, 6)
    : !props.markets
      ? {}
      : props.markets
})

const hiddenMarkets = computed(() => {
  return props.markets.length > 0 ? props.markets.slice(6) : []
})

function showOtherMarkets() {
  toggleOtherMarkets.value = !toggleOtherMarkets.value
}

async function setActiveMarket(market) {
  market = { ...market, outcomes: sortArr(market.outcomes, 'outcomeID') }
  activeMarket.value = market
  emitter.emit('activeMarketChange')
}

const fetchFixtures = () => {
  isShown.value = !isShown.value
  if (props.events.length) return
  emit('fetch-fixtures', props.tournamentID)
}
</script>
<style lang=""></style>
