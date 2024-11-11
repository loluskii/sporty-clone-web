<template>
  <div class="x-table-row x-content-row match-row">
    <div class="x-table-cell left-team-cell">
      <div class="left-team-table">
        <div class="time">
          <div class="clock-time">{{ match.eventTime }}&nbsp;&nbsp;</div>
          <div class="game-id">
            <span class="game-id-label">ID: </span>{{ match.gameID }}
          </div>
        </div>
        <div
          title=""
          class="teams"
          @click="
            $router.push({
              name: 'fixtures-detail',
              params: {
                sport: slugify(match.sportName),
                tournament_name: slugify(match.tournament),
                event_name: slugify(match.name),
                event_id: match.matchID,
              },
            })
          "
        >
          <div class="home-team">{{ match.homeTeam }}</div>
          <div class="away-team">{{ match.awayTeam }}</div>
        </div>
        <div class="lmt-icon" @click="showFixtureAnalysis(match.matchID)">
          <em class="icon"></em>
        </div>
      </div>
    </div>
    <div class="x-table-cell market-cell">
      <div class="x-market market">
        <template v-if="match.outcomes && match.activeMarkets">
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
                    :class="'af-select-list-' + match.matchID"
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
                        match.gameID,
                        match.matchID,
                        odds.outcomeName,
                        odds.oddID,
                        match.name
                      ),
                      couponStore.coupon
                    )
                  ? 'x-outcome--checked'
                  : ''
              "
            >
              <span class="x-outcome-odds">{{ odds.odds.toFixed(2) }}</span>
            </div>
          </template>
          <template v-else>
            <div
              v-if="activeMarket && activeMarket.specifier !== ''"
              class="x-outcome x-outcome--disabled specifiers-select"
            >
              <span class="x-icon-lock"></span>
            </div>
            <EmptyOdds
              v-for="(odd, index) in activeMarket?.outcomes"
              :key="index"
            ></EmptyOdds>
          </template>
        </template>
        <template v-else>
          <EmptyOdds></EmptyOdds>
        </template>
      </div>
    </div>
    <div class="x-table-cell market-size">+{{ match.activeMarkets }}</div>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { slugify, sortArr, createID, isSelected, uniqueOdds } from "@/helpers";
import _ from "lodash";
import EmptyOdds from "../EmptyOdds.vue";
import { useCouponStore } from "@/stores";

const couponStore = useCouponStore();
import emitter from "@/plugins/emitter";
const props = defineProps({
  activeMarket: Object,
  match: Object,
});

const activeSpecifier = ref();
const specifierOpen = ref(false);

const outcomes = ref([]);

const getSpecifiers = computed(() => {
  if (
    props.activeMarket &&
    props.activeMarket.specifier &&
    props.activeMarket.specifier !== ""
  ) {
    const result = [];

    const outcomes = props.match.outcomes;
    if (outcomes.length > 0) {
      const filtered = outcomes.filter(
        (item) => item.marketID === parseInt(props.activeMarket.marketID)
      );

      filtered.forEach((outcome) => {
        let specifier = outcome.specifier;
        let found = result.find((item) => item.specifier === specifier);
        if (!found)
          // check if specifier has been listed
          result.push({ specifier, value: specifier.split("=")[1] }); //push value to array
      });
    }
    return result.sort((a, b) => a.value - b.value);
  } else {
    return [];
  }
});
const getOdds = () => {
  // Find and return the odds based on marketID and outcomeID
  if (props.activeMarket && props.match.activeMarkets > 0) {
    if (props.match.outcomes) {
      const odds = props.match.outcomes;
      let filtered = odds.filter(
        (item) => item.marketID === parseInt(props.activeMarket.marketID)
      );
      if (props.activeMarket.specifier && props.activeMarket.specifier !== "") {
        let defaultSpecifier = filtered[0]?.specifier;
        if (defaultSpecifier) {
          filtered = filtered.filter((item) => item.specifier === defaultSpecifier);
          activeSpecifier.value = defaultSpecifier.split("=")[1];
        }
      } else {
        filtered = uniqueOdds(filtered);
      }
      if (filtered.length) {
        // console.log(_.sortBy(filtered, 'outcomeID'))
        outcomes.value = sortArr(filtered, "outcomeID");
      } else {
        outcomes.value = [];
      }
    }
  }
};

function showFixtureAnalysis(id) {
  return window.open(
    `https://s5.sir.sportradar.com/betradar/en/match/${id}`,
    "stats",
    "width=1078,height=768"
  );
}

const setActiveSpecifier = (spec) => {
  console.log(spec);
  if (props.match.outcomes) {
    const odds = props.match.outcomes;
    let filtered = odds.filter(
      (item) => item.marketID === parseInt(props.activeMarket.marketID)
    );
    filtered = filtered.filter((item) => item.specifier === spec.specifier);
    outcomes.value = filtered;
    activeSpecifier.value = spec.value;
  }
};
const toggleList = () => {
  specifierOpen.value = !specifierOpen.value;
};

watch(
  () => props.activeMarket,
  () => {
    getOdds();
  },
  { immediate: true }
);

function addToBetslip(event, odd) {
  if (odd.odds < 1) return;
  const id = createID(
    event.gameID,
    event.matchID,
    odd.outcomeName,
    odd.oddID,
    event.name
  );
  const data = {
    fixture: event,
    market_name: props.activeMarket.marketName,
    market_id: odd.marketID,
    ele_id: id,
    outcome: odd,
    odds: odd.odds,
    odd_id: odd.oddID,
    odd_name: odd.outcomeName,
    type: "prematch",
    event_id: event.gameID,
    specifier: odd.specifier,
  };

  // return couponStore.addToCoupon(data)

  const existsInBetslip = isSelected(id, couponStore.coupon);
  return existsInBetslip
    ? couponStore.removeSelection(id)
    : couponStore.addToCoupon(data);
}

onMounted(() => {
  getOdds();
});
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
