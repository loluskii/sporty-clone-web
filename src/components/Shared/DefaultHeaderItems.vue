<template lang="">
  <div class="x-nav-bar">
    <div class="x-nav">
      <div class="x-header-item">
        <nav id="header" class="x-flex" style="flex-shrink: 0">
          <Router-Link
            to="/"
            :class="route.name === 'home' ? 'x-flex-item--active' : ''"
            class="x-flex-item"
            ><span data-cms-key="home">Home</span>
          </Router-Link>
          <Router-Link
            v-for="(sport, s) in sportsList.slice(0, 10)"
            :to="{ name: 'fixtures-by-sport', params: { sport: slugify(sport.sportName) } }"
            :key="s"
            class="x-flex-item"
            :class="
              activeSport === sport.sportID && route.name !== 'home' ? 'x-flex-item--active' : ''
            "
          >
            <span>{{ sport.sportName }}</span>
          </Router-Link>
          <div
            id="more-sports"
            class="x-flex-item dropdown"
            :class="{ 'x-flex-item--active': isMoreSportsActive }"
          >
            <span @click="showMoreSports = !showMoreSports">{{
              isMoreSportsActive ? utilsStore.activeSport.sportName : 'More Sports'
            }}</span>
            <span class="arrow-icon">
              <div class="dropdown-menu" v-show="showMoreSports">
                <Router-Link
                  v-for="(sport, t) in sportsList.slice(10)"
                  :key="t"
                  class="x-flex-item dropdown"
                  :to="{ name: 'fixtures-by-sport', params: { sport: slugify(sport.sportName) } }"
                >
                  <span>{{ sport.sportName }}</span>
                </Router-Link>
              </div>
            </span>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useUtilstStore } from '@/stores'
import { getSportsMenu, slugify } from '@/helpers'
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const utilsStore = useUtilstStore()
const showMoreSports = ref(false)
const route = useRoute()

const sportsList = computed(() => {
  return utilsStore.sportsMenu
})

const activeSport = computed(() => {
  return utilsStore.activeSport.sportID
})

async function getSports() {
  const res = await getSportsMenu()
  utilsStore.sportsMenu = res.sports
}

const isMoreSportsActive = computed(() => {
  let result = utilsStore.sportsMenu.slice(10).map((a) => a.sportID)
  return result.indexOf(utilsStore.activeSport.sportID) !== -1
})

onMounted(async () => {
  getSports()
})
</script>
<style scoped></style>
