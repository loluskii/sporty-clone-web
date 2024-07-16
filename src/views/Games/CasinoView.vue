<template>
  <CasinoLayout>
    <div class="container lobby-container" style="">
      <div class="categories-list col m-2">
        <div class="row scroll-list no-gutters">
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
                                      <span class="name">{{ game.title }}</span>
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
                
                  <LoadingSpinner v-if="isLoading"></LoadingSpinner>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="back-to-top" style="display: none; right: 129px; top: 713px"></div>
    </div>
  </CasinoLayout>
</template>

<script setup>
// import CasinoL
import CasinoLayout from '@/components/Shared/CasinoLayout.vue'
import { ref, onBeforeMount } from 'vue'
import { getTopGameCategories, gamesByTopCategory, slugify } from '@/helpers'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { useRouter } from 'vue-router'

const topGameCategories = ref([])
const gamesList = ref([])
const activeTopCategory = ref('all')
const isLoading = ref(false)
const hasNextPage = ref(false)
const router = useRouter()

async function getCasinoGames() {
  isLoading.value = true
  const response = await gamesByTopCategory(1)
  gamesList.value = response.games
  isLoading.value = false
}

async function getCategories() {
  const response = await getTopGameCategories()
  topGameCategories.value = response.data
  activeTopCategory.value = response.data[0]
}

async function getGameByTopCategory(category) {
  isLoading.value = true
  activeTopCategory.value = category
  const res = await gamesByTopCategory(category.id)
  isLoading.value = false
  gamesList.value = res.games
}

const getImagePath = (game) => {
  return `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/casino%2F${game.title}.png?alt=media`
}

async function redirectToGamePlay(game) {
  console.log(game)
  return router.push({
    name: 'game-play',
    params: { game_name: slugify(game.title), game_id: game.id }
  })
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
