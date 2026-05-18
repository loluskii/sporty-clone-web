<template>
  <div>
    <div class="home-top">
      <div class="first-part-wrap">
        <div class="first-part">
          <div class="img img1"></div>
          <div class="top-main">
            <div class="popular">
              <div class="popular-text" data-cms-key="popular">Popular</div>
              <div class="popular-list">
                <a href="/Sports/Prematch/Soccer?period=today" class="top-link"
                  ><span class="top-link-item">Today's Football</span><span class="arrow"></span></a
                ><a href="/Sports/Prematch/Soccer/Upcoming" class="top-link"
                  ><span class="top-link-item">Upcoming Games</span><span class="arrow"></span></a
                ><a
                  class="top-link"
                  @click.prevent="
                    $router.push({
                      name: 'fixtures-by-tournaments',
                      params: {
                        sport: top.sportName,
                        categories: `sr:category:${top.categoryID}`,
                        tournaments: `sr:tournament:${top.tournamentID}`
                      }
                    })
                  "
                  href=""
                  v-for="(top, index) in featuredTournaments"
                  :key="index"
                  ><span class="top-link-item">{{ top.tournamentName }}</span
                  ><span class="arrow"></span
                ></a>
              </div>
            </div>
            <Carousel></Carousel>
            <div v-if="!currentUser" class="x-instant-reg x-instant-black">
              <div class="x-title">
                <span data-cms-key="instant_registration" data-cms-page="pc_layout_right"
                  >Instant Registration</span
                >
              </div>
              <p class="x-pro-tips">Make a Deposit and Start Betting!</p>
              <div tabindex="6" class="x-input-wrapper x-input-group x-input-group--prepend">
                <div class="x-input-prepend">
                  <span>{{ utilsStore.SportsbookGlobalVariable.DialCode }}</span>
                </div>
                <span class="x-input-com">
                  <input
                    type="input"
                    input-mode=""
                    name=""
                    placeholder="Mobile Number"
                    onpaste="return true"
                    data-op=""
                    class="x-input fs-exclude"
                /></span>
              </div>
              <div class="x-btn-wrapper">
                <button class="af-button af-button--primary" @click="showRegisterModal">
                  <span><span data-cms-key="register">Register</span></span>
                </button>
              </div>
            </div>
          </div>
          <div class="img img2"></div>
        </div>
      </div>

      <div class="second-banner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted,computed } from 'vue'
import { FEED_TOGGLE, getTopBets } from '@/helpers'
import Carousel from '../CarouselSlider.vue'
import emitter from '@/plugins/emitter'
import { useUsersStore, useUtilsStore } from '@/stores'

const utilsStore = useUtilsStore()
const usersStore = useUsersStore()

const featuredTournaments = ref([])

const currentUser = computed(() => {
  return usersStore.currentUser
})

async function getFeaturedGames() {
  if(!FEED_TOGGLE){
    featuredTournaments.value = []
    return;
  }
  const res = await getTopBets()
  featuredTournaments.value = res.data?.splice(0, 4)
}

function showRegisterModal() {
  emitter.emit('showDialog', { dialogType: 'auth', dialogData: 'register' })
}

onMounted(async () => {
  Promise.all([getFeaturedGames()])
    .then(() => {})
    .catch((error) => {
      console.error('An error occurred:', error)
    })
})
</script>

<style scoped></style>
