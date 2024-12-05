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
          v-for="(sport, index) in sportList.slice(0, 6)"
          :key="index"
          :class="sport.sportID === activeSportID ? 'active' : ''"
          class="sport-name-item"
          @click="setActiveSport(sport.sportID)"
        >
          <div class="text">{{ sport.sportName }}</div>
        </div>
        <div
          class="simple-select-wrap sport-simple-select"
          :class="MoreSportsLabel !== 'More Sports' ? 'sport-simple-select-active' : ''"
        >
          <div class="select-title" @click="toggleMoreSports">
            <p class="select-title__label">{{ MoreSportsLabel }}</p>
            <span class="arrow-icon arrow-icon-down"></span>
          </div>
          <div class="select-list" v-if="showMoreSportsMenu">
            <div
              :data-index="s"
              v-for="(sport, s) in sportList.slice(5, 10)"
              :key="s"
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
const sportList = computed(() => {
  return utilsStore.sportsMenu;
});

const showMoreSportsMenu = ref(false);

const activeSportID = ref(1);
const marketGroup = ref([]);
const isEmptyResponse = ref(false);
const completeData = ref([]);

const MoreSportsLabel = ref("More Sports");
const isManualRefetching = ref(false);



const { data, error, isLoading, refetch, isFetching } = useQuery(
  "liveData",
  getLiveHighlights,
  {
    refetchInterval: 60000, // 25 seconds in milliseconds
    refetchOnWindowFocus: true,
    onError: (err) => {
      console.error(err);
    },
    onSuccess: (response) => {
      if (response.fixtures) {
        // if the
        if (completeData.value.length === 0) {
          completeData.value = response.fixtures.slice(0, 15);
          marketGroup.value = response.markets.filter((m) => m.specifier == "");
        } else {
          response.fixtures.slice(0, 15).forEach((newFixture) => {
            const index = completeData.value.findIndex(
              (oldFixture) => oldFixture.matchID === newFixture.matchID
            );
            if (index !== -1) {
              // Replace the old fixture with the new one
              completeData.value[index] = newFixture;
            } else {
              // If the fixture does not exist in completeData.value, add it
              completeData.value.push(newFixture);
            }
          });
        }
      } else {
        if (!completeData.value.length) {
          isEmptyResponse.value = true;
        }
      }
    },
  }
);

const handleRefresh = () => {
  // if(isManualRefetching.value) return
  isManualRefetching.value = true;
  refetch().then(() => {

  })
  setTimeout(() => {
    isManualRefetching.value = false;
  }, 5000)
};

// get active sport data from completelive and group by tournament
const filteredLiveData = computed(() => {
  const res =
    completeData.value && !isEmptyResponse.value
      ? completeData.value.filter((s) => s.sportID == activeSportID.value).splice(0, 5)
      : [];
  return _.groupBy(res, "tournament");
});

const activeSportMarkets = computed(() => {
  let data = marketGroup.value.filter((s) => s.sportID == activeSportID.value);
  data = data.sort((a, b) => a.marketID - b.marketID);
  return data ? data.slice(0, 2) : [];
});

function toggleMoreSports() {
  showMoreSportsMenu.value = !showMoreSportsMenu.value;
}

function setActiveSport(sport) {
  if (typeof sport === "object") {
    MoreSportsLabel.value = sport.sportName;
    activeSportID.value = sport.sportID;
    showMoreSportsMenu.value = false;
  } else {
    activeSportID.value = sport;
    MoreSportsLabel.value = "More Sports";
  }
}
</script>
