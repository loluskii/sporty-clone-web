<template>
  <CasinoLayout>
    <div class="container lobby-container" style="">
      <div class="categories-list col m-2">
        <div class="row scroll-list no-gutters">
          <div
            class="category-parent col mb-2"
            :class="activeTopCategory === 'all' ? 'isSelected' : ''"
            @click="getGameByTopCategory('all')"
          >
            <div class="category-item px-3">
              <span data-cms-key="popular">All</span>
            </div>
          </div>
          <div
            class="category-parent col mb-2"
            v-for="(category, index) in topGameCategories"
            :key="index"
            :class="activeTopCategory.id == category.id ? 'isSelected' : ''"
            @click="getGameByTopCategory(category)"
          >
            <div class="category-item px-3">
              <span data-cms-key="popular">{{ category.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="main-section">
        <div class="lobby-home">
          <div class="">
            <div class="lobby-an-test">
              <div class="row no-gutters" style="">
                <div class="col">
                  <div id="" class="align-items-center list-container no-gutters row">
                    <template v-for="(game, index) in gamesList" :key="index">
                      <div
                        id="game_item19"
                        data-id="34"
                        class="list-item text-center col-3 row-last-item"
                        style="padding: 0.5rem"
                        v-if="game.status && game.game_id !== null && game.provider_id != 'C27'"
                        @click="redirectToGamePlay(game)"
                      >
                        <div class="row game-item no-gutters user-logged-in">
                          <div class="main-game-box col" style="--listContainerWidth: 824px">
                            <div class="game-holder">
                              <div class="main-image" style="--listContainerWidth: 824px">
                                <div class="banner_fail"></div>
                                <div class="image-holder">
                                  <img
                                    :src="getImagePath(game)"
                                    alt=""
                                    width="100%"
                                    loading="lazy"
                                    class="banner_image"
                                  />
                                </div>
                              </div>
                              <div
                                class="row desktop-option-container option-container no-gutters align-items-center is-heart-showing"
                              >
                                <div class="main-option-container col">
                                  <div class="name-container col">
                                    <div class="scroll-div">
                                      <span class="name" data-cms-key="aviator">{{
                                        game.provider_id == 'tada-games'
                                          ? game.title
                                          : game.provider_id == 'evo-play'
                                            ? game.description
                                            : ''
                                      }}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="row bottom-layer w-100 no-gutters"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                  <div class="fix-scroll-height"></div>
                  <div
                    v-if="!isLoading && hasNextPage"
                    style="display: flex; justify-content: center"
                  >
                    <button @click.prevent="loadMoreGames" class="btn btn-primary">
                      Load More
                    </button>
                  </div>
                  <LoadingSpinner v-if="isLoading"></LoadingSpinner>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="back-to-top" style="display: none; right: 129px; top: 713px">
        
      </div>
    </div>
  </CasinoLayout>
</template>

<script setup>
// import CasinoL
import CasinoLayout from '@/components/Shared/CasinoLayout.vue'
import { ref, onBeforeMount } from 'vue'
import { getGames, getTopGameCategories, gamesByTopCategory } from '@/helpers'
import { useAuthStore } from '@/stores'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { useRouter } from 'vue-router'
import emitter from '@/plugins/emitter'

const topGameCategories = ref([])
const gamesList = ref([])
const activeTopCategory = ref('all')
const currentPage = ref(1)
const scrollComponent = ref(null)
const authStore = useAuthStore()
const isLoading = ref(false)
const hasNextPage = ref(false)
const router = useRouter()

async function getCasinoGames() {
  isLoading.value = true
  currentPage.value++
  const response = await getGames(1)
  gamesList.value = response.games.data
  hasNextPage.value = response.games.next_page_url !== null
  isLoading.value = false
}

// const handleScroll = () => {
//   let element = scrollComponent.value
//   if (element.getBoundingClientRect().bottom < window.innerHeight) {
//     loadMoreGames()
//   }
// }

async function loadMoreGames() {
  isLoading.value = true
  const nextPage = currentPage.value++ // Assuming you have a page parameter
  const response = await getGames(nextPage)
  isLoading.value = false
  gamesList.value = [...gamesList.value, ...response.games.data]
  hasNextPage.value = response.games.next_page_url !== null
}

async function getCategories() {
  const response = await getTopGameCategories()
  topGameCategories.value = response.data
}

async function getGameByTopCategory(category) {
  currentPage.value = 1
  if (category == 'all') {
    activeTopCategory.value = category
    getCasinoGames()
  } else {
    isLoading.value = true
    activeTopCategory.value = category
    const res = await gamesByTopCategory(category.id)
    isLoading.value = false
    gamesList.value = res.data
    hasNextPage.value = false
  }
}

const getImagePath = (game) => {
  const game_id = game.game_id
  const provider = game.provider_id
  let id = parseInt(game_id.match(/\d+$/)[0])
  switch (provider) {
    case 'tada-games':
      return `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/Tada%2F500x500_EN_GAMEID_${id}.png?alt=media`
    default:
      return `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/casino%2F${game.title}.png?alt=media`
      break
  }
}

async function redirectToGamePlay(game) {
  if (authStore.token) {
    return router.push({
      name: 'game-play',
      params: { provider: game.provider_id.toLowerCase(), game_id: game.game_id }
    })
  }else{
    emitter.emit('showDialog', { dialogType: 'auth', dialogData: 'login' })
  }
  // } else {
  //   authStore.returnUrl = '/Games'
  //   return router.push({ name: 'sign-in' })
  // }
}

onBeforeMount(async () => {
  await Promise.all([getCasinoGames(), getCategories()])
})
</script>

<style scoped>
@import url('@/assets/css/casino/index.css');
body {
  font-size: 9rem !important;
}
</style>

<!-- #051C74 -->

<!-- #051C9E -->
