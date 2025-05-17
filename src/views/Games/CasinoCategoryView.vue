<template>
  <CasinoLayout>
    <!-- Categories Horizontal Scroll -->
    <CasinoCategoryList
      :categories="allCategories"
      :activeCategory="activeCategory"
      :onCategoryClick="onCategoryClick"
    />

    <div class="section-divider"></div>

    <div class="container py-4">
      <!-- Category Header -->
      <div class="category-header mb-4 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <button class="btn p-0 text-white me-3" @click="router.back()">
            <i class="x-icon-back"></i>
          </button>
          <div class="category-info">
            <h2 class="text-white mb-0">{{ category?.name }}</h2>
            <small class="text-white">{{ games.length }} games</small>
          </div>
        </div>
        <div>
          <select v-model="sortOrder" class="form-select form-select-sm w-auto" @change="sortGames">
            <option value="az">Sort: A-Z</option>
            <option value="za">Sort: Z-A</option>
          </select>
        </div>
      </div>

      <!-- Games Grid -->
      <div class="row g-4">
        <template v-if="!isLoading">
          <div v-for="(game, index) in sortedGames" 
               :key="index"
               class="col-xl-3 col-lg-4 col-md-6 col-sm-6"
               @click="redirectToGamePlay(game)">
            <CasinoGameCard
              :image="getImagePath(game)"
              :title="game.title"
              :provider="game.provider || game.vendor || ''"
              :tags="game.tags || game.types || []"
            />
          </div>
        </template>
        <template v-else>
          <div v-for="i in 8" :key="i" class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <CasinoGameCard loading />
          </div>
        </template>
      </div>
    </div>
  </CasinoLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CasinoLayout from '@/components/Shared/CasinoLayout.vue'
import CasinoGameCard from '@/components/Games/CasinoGameCard.vue'
import CasinoCategoryList from '@/components/Games/CasinoCategoryList.vue'
import { getTopGameCategories, gamesByTopCategory, slugify } from '@/helpers'
import { useUsersStore } from '@/stores'
import emitter from '@/plugins/emitter'

const route = useRoute()
const router = useRouter()
const userStore = useUsersStore()

const category = ref(null)
const games = ref([])
const isLoading = ref(true)
const sortOrder = ref('az')
const allCategories = ref([])
const activeCategory = ref(null)

const discoverCategory = {
  id: 'discover',
  name: 'Discover',
  slug: 'discover',
}

function onCategoryClick(cat) {
  if (cat.id === 'discover') {
    router.push({ name: 'game-view' })
  } else if (cat.id !== activeCategory.value) {
    activeCategory.value = cat.id;
    router.push({
      name: 'casino-category',
      params: {
        category_id: cat.id,
        category_name: slugify(cat.name)
      }
    })
  }
}

const getImagePath = (game) => {
  return `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/Casino2%2F${game.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.png?alt=media`
}

const sortedGames = computed(() => {
  const arr = [...games.value]
  if (sortOrder.value === 'az') return arr.sort((a, b) => a.title.localeCompare(b.title))
  if (sortOrder.value === 'za') return arr.sort((a, b) => b.title.localeCompare(a.title))
  return arr
})

function sortGames() {
  sortOrder.value = sortOrder.value
}

async function loadCategoryGames() {
  try {
    isLoading.value = true
    const response = await gamesByTopCategory(route.params.category_id)
    games.value = response.data
    category.value = {
      id: route.params.category_id,
      name: route.params.category_name.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }
    activeCategory.value = route.params.category_id
  } catch (error) {
    console.error('Error loading category games:', error)
  } finally {
    isLoading.value = false
  }
}

async function loadCategories() {
  const response = await getTopGameCategories()
  let filteredCategory = response.data.filter((c) => c.priority !== -1)
  allCategories.value = [discoverCategory, ...filteredCategory.sort((a, b) => b.priority - a.priority)]
}

async function redirectToGamePlay(game) {
  try {
    if (!userStore.currentUser) {
      return router.push({ name: "sign-in" })
    }

    if (userStore.casinoActiveBonus?.gameId?.includes(game.gameId)) {
      emitter.emit("toggleCasinoDialog", { 
        bonus: userStore.casinoActiveBonus, 
        game 
      })
      return
    }

    await router.push({
      name: "game-play",
      params: { 
        game_name: slugify(game.title), 
        game_id: game.id 
      }
    })
  } catch (error) {
    console.error("Error redirecting to game:", error)
  }
}

onMounted(async () => {
  await loadCategories()
  await loadCategoryGames()
})

watch(() => route.params.category_id, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    await loadCategoryGames()
  }
})
</script>

<style scoped>
.x-icon-back {
  color: #9ca0ab;
  left: 0;
  text-decoration: none;
}
.x-icon-back::before {
  content: '\e604';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.category-header {
  background-color: var(--casino-bg);
  padding: 1rem;
  border-radius: 8px;
}

.card {
  background-color: var(--casino-bg);
  border: none;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
}

.card-image {
  height: 200px;
  background-size: cover;
  background-position: center;
}

.card-body {
  padding: 1rem;
}

.card-title {
  font-size: 1rem;
  margin: 0;
  color: #fff;
}

.btn-link {
  text-decoration: none;
  padding: 0.5rem;
}

.btn-link:hover {
  color: #fff !important;
  opacity: 0.8;
}
</style> 