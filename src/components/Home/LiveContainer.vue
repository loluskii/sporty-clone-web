<template>
  <div class="live-match">
    <div class="banner">
      <span class="circle"></span>
      <span class="text" data-cms-key="live_betting">Live Betting</span>
      <div class="config" style="">
        <!-- <span class="refresh" @click="handleRefresh">Refresh</span> -->
      </div>
    </div>
    <div id="print-container-live">
      <div class="sport-name">
        <div
          v-for="sport in visibleSports"
          :key="sport.sportID"
          :class="{ 'active': sport.sportID === activeSportID }"
          class="sport-name-item"
          @click="setActiveSport(sport.sportID)"
        >
          <div class="text">{{ sport.sportName }}</div>
        </div>
        
        <div
          class="simple-select-wrap sport-simple-select"
          :class="{ 'sport-simple-select-active': MoreSportsLabel !== 'More Sports' }"
        >
          <div class="select-title" @click="toggleMoreSports">
            <p class="select-title__label">{{ MoreSportsLabel }}</p>
            <span class="arrow-icon arrow-icon-down"></span>
          </div>
          <div v-show="showMoreSportsMenu" class="select-list">
            <div
              v-for="sport in moreSports"
              :key="sport.sportID"
              @click="setActiveSport(sport)"
              class="select-item"
            >
              {{ sport.sportName }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="isLoading" class="loading-spinner-container">
        <LoadingSpinner />
      </div>
      <div v-else-if="isManualRefetching" class="loading-spinner-container">
        <LoadingSpinner />
      </div>
      <template v-else>
        <div style="position: relative">
          <div class="match">
            <div
              class="x-table match-table live-table"
              v-if="Object.keys(filteredLiveData).length > 0"
            >
              <template v-for="(liveGroup, g) in filteredLiveData" :key="g">
                <div class="x-table-row league-row">
                  <div class="x-table-cell league">
                    {{ liveGroup[0].categoryName }} {{ g }}
                  </div>
                  <div class="x-table-cell each-module-wrap each-module-two-line">
                    <div class="market-desc-wrap">
                      <div
                        v-for="(market, m) in activeSportMarkets"
                        :key="m"
                        class="market-desc"
                        :style="
                          activeSportMarkets.length > 1 ? 'width: 50%' : 'width: 100%'
                        "
                      >
                        {{ market.marketName }}
                      </div>
                    </div>
                    <div>
                      <div
                        v-for="(market, m) in activeSportMarkets"
                        :key="m"
                        class="each-module-table"
                        :class="activeSportMarkets.length > 1 ? 'two-markets' : ''"
                      >
                        <div v-if="market.specifier !== ''" class="each-module">
                          {{ market.specifier }}
                        </div>
                        <template
                          v-for="(outcome, o) in _.sortBy(market.outcomes, 'outcomeID')"
                          :key="o"
                        >
                          <div class="each-module">{{ outcome.outcomeName }}</div>
                        </template>
                      </div>
                    </div>
                  </div>
                  <div class="x-table-cell"></div>
                </div>
                <Fixture
                  v-for="(match, m) in liveGroup"
                  :key="m"
                  :match="match"
                  :activeMarkets="activeSportMarkets"
                ></Fixture>
              </template>
              <div class="view-all" @click="$router.push({ name: 'live-view' })">
                View All
              </div>
            </div>
            <div v-else class="x-sport-bet-no-data">
              <div style="white-space: pre-line">
                Sorry, there are no games currently<br />available in this category.
                Please try later.<br />Thank you.
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useUtilsStore } from "@/stores";
import { computed, ref } from "vue";
import LoadingSpinner from "../Loaders/LoadingSpinner.vue";
import { useQuery } from "vue-query";
import { getLiveHighlights } from "@/helpers";
import Fixture from "@/components/Live/Fixture.vue";
import _ from "lodash";

const utilsStore = useUtilsStore();

// Memoize sportList
const sportList = computed(() => utilsStore.sportsMenu);

// Memoize visible sports
const visibleSports = computed(() => sportList.value.slice(0, 6));
const moreSports = computed(() => sportList.value.slice(5, 10));

// State
const showMoreSportsMenu = ref(false);
const activeSportID = ref(1);
const marketGroup = ref([]);
const isEmptyResponse = ref(false);
const completeData = ref([]);
const MoreSportsLabel = ref("More Sports");
const isManualRefetching = ref(false);

// Optimize the query with better caching and error handling
const { data, error, isLoading, refetch, isFetching } = useQuery(
  "liveData",
  getLiveHighlights,
  {
    // Prevent automatic refetching which can cause recursive updates
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    // Use a longer stale time to prevent unnecessary refetches
    staleTime: 60000, // 1 minute
    // Add cacheTime to control how long data stays in cache
    cacheTime: 300000, // 5 minutes
    // Update refetch interval to 10 minutes
    refetchInterval: 60000 * 10, // 10 minutes
    // Add retry logic with exponential backoff
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500
      ) {
        return false;
      }
      return failureCount < 3; // retry up to 3 times
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (err) => {
      console.error(err);
      isEmptyResponse.value = true;
    },
    onSuccess: (response) => {
      if (response.fixtures) {
        if (completeData.value.length === 0) {
          completeData.value = response.fixtures.slice(0, 15);
          marketGroup.value = response.markets.filter((m) => m.specifier === "");
        } else {
          // Use Map for faster lookups
          const fixtureMap = new Map(
            completeData.value.map(fixture => [fixture.matchID, fixture])
          );
          
          response.fixtures.slice(0, 30).forEach((newFixture) => {
            fixtureMap.set(newFixture.matchID, newFixture);
          });
          
          completeData.value = Array.from(fixtureMap.values());
        }
      } else if (!completeData.value.length) {
        isEmptyResponse.value = true;
      }
    },
  }
);

// Optimize refresh handler with debounce
const handleRefresh = _.debounce(() => {
  if (isManualRefetching.value) return;
  
  isManualRefetching.value = true;
  refetch().finally(() => {
    setTimeout(() => {
      isManualRefetching.value = false;
    }, 5000);
  });
}, 300);

// Memoize filtered data
const filteredLiveData = computed(() => {
  if (!completeData.value.length || isEmptyResponse.value) return {};
  
  const filtered = completeData.value
    .filter(s => s.sportID == activeSportID.value)
    .slice(0, 5);
    
  return _.groupBy(filtered, "tournament");
});

// Memoize active sport markets
const activeSportMarkets = computed(() => {
  const data = marketGroup.value
    .filter(s => s.sportID == activeSportID.value)
    .sort((a, b) => a.marketID - b.marketID);
    
  return data.slice(0, 2);
});

// Optimize toggle function
const toggleMoreSports = () => {
  showMoreSportsMenu.value = !showMoreSportsMenu.value;
};

// Optimize set active sport
const setActiveSport = (sport) => {
  if (typeof sport === "object") {
    MoreSportsLabel.value = sport.sportName;
    activeSportID.value = sport.sportID;
    showMoreSportsMenu.value = false;
  } else {
    activeSportID.value = sport;
    MoreSportsLabel.value = "More Sports";
  }
};
</script>
