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
        <div class="p-3">
          <div class="grid-container">
            <div class="grid-item" v-for="(game, index) in gamesList" :key="index">
              <div class="card" @click="redirectToGamePlay(game)" style="cursor: pointer;">
                <div
                  class="card-image"
                  :style="{ backgroundImage: `url(${getImagePath(game)})` }"
                ></div>
                <div class="card-body">
                  <h5 class="card-title">{{ game.title }}</h5>
                </div>
              </div>
            </div>
          </div>
          <LoadingSpinner v-if="isLoading"></LoadingSpinner>
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
import emitter from '@/plugins/emitter'

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
  emitter.emit('toggleCasinoDialog')
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

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Four items per row */
  /* grid-template-rows: repeat(auto-fill, 200px); */
  gap: 16px;
}

.grid-item {
  display: flex;
  flex-direction: column;
}

.card {
  background-color: #000; /* Card background color */
  color: white;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
}

.card-image {
  background-size: cover;
  background-position: center;
  background-color: #ccc; /* Temporary background color */
  padding-top: 56.25%; /* 16:9 aspect ratio */
}

.card-body {
  padding: 16px;
  text-align: center;
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
}
</style>

<!-- #051C74 -->

<!-- #051C9E -->
