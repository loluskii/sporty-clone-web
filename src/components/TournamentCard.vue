<template>
  <div class="match-league-wrap" style="position: relative">
    <div class="match-league">
      <div class="league-title">
        <span class="dis-icon"><em></em></span>
        <span class="text">{{ events[0].categoryName }} {{ tournamentName }}</span>
      </div>

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

        <!-- <div
          v-for="(market, g) in markets.group2.slice(0, 3)"
          :key="g"
          class="market-item"
          @click="setActiveMarket('group2', market)"
        >
          {{ market.marketName }}
        </div> -->
        <div
          tabindex="0"
          v-if="markets.length >= 5"
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
                  style="text-transform: capitalize;"
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
    </div>
  </div>
</template>
<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import { formatDate } from '@/helpers'
import Prematch from './Prematch/Prematch.vue'
import emitter from '@/plugins/emitter';
const props = defineProps({
  tournamentName: String,
  events: Array,
  markets: Array
})

const activeMarket = ref(props.markets[0])
const toggleOtherMarkets = ref(false)

const shownMarkets = computed(() => {
  return props.markets.length > 5 ? props.markets.slice(0, 5) : props.markets
})

const hiddenMarkets = computed(() => {
  return props.markets.length > 0 ? props.markets.slice(5) : []
})

function showOtherMarkets() {
  toggleOtherMarkets.value = !toggleOtherMarkets.value
}

async function setActiveMarket(market) {
  activeMarket.value = market
  emitter.emit('activeMarketChange')
}
</script>
<style lang=""></style>
