<template>
  <CasinoLayout>
    <div class="container py-4">
      <!-- Provider Header -->
      <div class="provider-header mb-4 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <button class="btn p-0 text-white me-3" @click="router.back()">
            <i class="x-icon-back"></i>
          </button>
          <div class="provider-info">
            <h2 class="text-white mb-0">{{ provider?.name }}</h2>
            <small class="text-white">{{ allGames.length }} games</small>
          </div>
        </div>
        <div class="d-flex gap-3">
          <!-- Search Input -->
          <div class="search-container">
            <input 
              type="text" 
              v-model="searchQuery" 
              class="form-control form-control-sm bg-dark text-white border-secondary" 
              placeholder="Search games..."
            >
          </div>
          <select v-model="sortBy" class="form-select form-select-sm w-auto">
            <option value="name">Sort: A-Z</option>
            <option value="popular">Sort: Popular</option>
            <option value="newest">Sort: Newest</option>
          </select>
        </div>
      </div>

      <!-- Games Grid -->
      <div class="row g-4">
        <template v-if="!isLoading">
          <div v-for="game in displayedGames" :key="game.id" 
            class="col-xl-3 col-lg-4 col-md-6 col-sm-6" @click="redirectToGamePlay(game)">
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

      <!-- Load More Button -->
      <div v-if="hasMoreGames && !isLoading" class="text-center mt-4">
        <button class="btn btn-outline-light" @click="loadMoreGames">
          Load More Games
        </button>
      </div>
    </div>
  </CasinoLayout>
</template>

<script setup>
import { ref, computed, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CasinoLayout from '@/components/Shared/CasinoLayout.vue'
import CasinoGameCard from '@/components/Games/CasinoGameCard.vue'
import { getGamesByProviders, slugify, unslugify } from '@/helpers'
import { useUsersStore } from '@/stores'
import emitter from '@/plugins/emitter'

const route = useRoute()
const router = useRouter()
const userStore = useUsersStore()

const provider = ref({
  id: route.params.provider_id,
  name: route.params.provider_name ? unslugify(route.params.provider_name) : '',
  description: '',
  imagePath: ''
})
const allGames = ref([])
const displayedGames = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const sortBy = ref('popular')
const GAMES_PER_LOAD = 100
const DISPLAY_INCREMENT = 100

const hasMoreGames = computed(() => {
  return displayedGames.value.length < allGames.value.length
})

const getImagePath = (game) => {
  if (!game) return '/default-game.jpg'
  if (game.imagePath) return game.imagePath
    
  // Return default if neither exists
  return '/default-game.jpg'
}

function sortGames(games) {
  const sorted = [...games]
  switch (sortBy.value) {
    case 'name':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'popular':
    default:
      return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
  }
}

function filterGames(games) {
  if (!searchQuery.value) return games
  
  const query = searchQuery.value.toLowerCase()
  return games.filter(game => 
    game.title.toLowerCase().includes(query) ||
    (game.tags && game.tags.some(tag => tag.toLowerCase().includes(query)))
  )
}

function updateDisplayedGames() {
  const filtered = filterGames(allGames.value)
  const sorted = sortGames(filtered)
  displayedGames.value = sorted.slice(0, displayedGames.value.length || DISPLAY_INCREMENT)
}

async function loadGames() {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const response = await getGamesByProviders(route.params.provider_id, {
      limit: GAMES_PER_LOAD
    })
    
    const { data } = response
    allGames.value = data
    displayedGames.value = data.slice(0, DISPLAY_INCREMENT)

    if (data.length > 0 && data[0].provider) {
      provider.value = {
        id: route.params.provider_id,
        name: data[0].provider.name,
        description: `Games provided by ${data[0].provider.description}`,
        imagePath: data[0].providerImagePath || ''
      }
    }
  } catch (error) {
    console.error('Error loading games:', error)
  } finally {
    isLoading.value = false
  }
}

function loadMoreGames() {
  const currentLength = displayedGames.value.length
  const filtered = filterGames(allGames.value)
  const sorted = sortGames(filtered)
  displayedGames.value = sorted.slice(0, currentLength + DISPLAY_INCREMENT)
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

watch([searchQuery, sortBy], () => {
  updateDisplayedGames()
})

onBeforeMount(async () => {
  await loadGames()
})
</script>

<style>
@import url('@/assets/css/casino/bootstrap.css');

a{
  text-decoration: none !important;
}

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

.provider-header {
  background-color: var(--casino-bg);
  padding: 1rem;
  border-radius: 8px;
}

.search-container {
  position: relative;
  min-width: 200px;
}

.search-container input {
  padding-right: 2rem;
}

.search-container input:focus {
  border-color: var(--casino-primary);
  box-shadow: none;
}

.form-select {
  min-width: 120px;
}

.form-select:focus {
  border-color: var(--casino-primary);
  box-shadow: none;
}

.game-card {
  position: relative;
}

.game-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  pointer-events: none;
}

.btn-outline-light:hover {
  background-color: var(--casino-primary);
  border-color: var(--casino-primary);
}
</style> 