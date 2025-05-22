<template>
  <CasinoLayout>
    <!-- Hero Carousel Section -->
    <div id="casinoHeroCarousel" class="carousel slide d-none" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="/download.avif" class="d-block w-100" alt="Casino Hero">
        </div>
        <!-- Add more carousel items as needed -->
      </div>
    </div>

    <!-- Categories Horizontal Scroll -->
    <CasinoCategoryList 
      :categories="topGameCategories" 
      :activeCategory="activeCategory"
      :onCategoryClick="onCategoryClick" 
    />
    <div class="section-divider"></div>

    <!-- Top Categories with Games -->
    <div class="container">
      <template v-for="(category, index) in topGameCategories" :key="index">
        <div v-if="category.id !== 'discover'" class="category-section mb-4"
          :data-category-id="category.id" v-intersection="handleIntersection">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="text-white">{{ category.name }}</h3>
            <button class="btn btn-outline-light btn-sm" @click="onCategoryClick(category)">
              Show More
            </button>
          </div>
          <div class="games-scroll">
            <div class="row g-4">
              <template v-if="gamesList[category.id]">
                <div v-for="(game, gameIndex) in gamesList[category.id].slice(0,12)" :key="gameIndex"
                  class="col-xl-3 col-lg-4 col-md-6 col-sm-6" @click="redirectToGamePlay(game)">
                  <CasinoGameCard :image="getImagePath(game)" :title="game.title"
                    :provider="game.provider || game.vendor || ''" :tags="game.tags || game.types || []" />
                </div>
              </template>
              <template v-else>
                <div v-for="i in 4" :key="i" class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                  <CasinoGameCard loading />
                </div>
              </template>
            </div>
          </div>
          <div class="section-divider"></div>
        </div>
      </template>
    </div>
  </CasinoLayout>
</template>

<script setup>
  import CasinoLayout from '@/components/Shared/CasinoLayout.vue'
  import CasinoGameCard from '@/components/Games/CasinoGameCard.vue'
  import CasinoCategoryList from '@/components/Games/CasinoCategoryList.vue'
  import {
    ref,
    onBeforeMount,
    computed
  } from 'vue'
  import {
    getTopGameCategories,
    gamesByTopCategory,
    slugify
  } from '@/helpers'
  import {
    useRoute,
    useRouter
  } from 'vue-router'
  import emitter from '@/plugins/emitter'
  import {
    useUsersStore
  } from '@/stores'

  const discoverCategory = {
    id: 'discover',
    name: 'Discover',
    slug: 'discover',
  }

  const topGameCategories = ref([])
  const gamesList = ref({})
  const discoverGames = ref([])
  const activeCategory = ref('discover')
  const isLoading = ref(false)
  const router = useRouter()
  const route = useRoute()
  const userStore = useUsersStore()
  const gamesCache = ref(new Map())
  const sortOrders = ref({})

  // Intersection Observer directive
  const vIntersection = {
    mounted: (el, binding) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            binding.value(entry.target)
          }
        })
      })
      observer.observe(el)
    }
  }

  const handleIntersection = async (element) => {
    const categoryId = element.getAttribute('data-category-id')
    if (categoryId && !gamesList.value[categoryId]) {
      await loadGamesForCategory(categoryId)
    }
  }

  const loadGamesForCategory = async (categoryId) => {
    // Check cache first
    if (gamesCache.value.has(categoryId)) {
      gamesList.value[categoryId] = gamesCache.value.get(categoryId)
      return
    }

    try {
      const response = await gamesByTopCategory(categoryId)
      const games = response.data
      gamesList.value[categoryId] = games
      gamesCache.value.set(categoryId, games)
    } catch (error) {
      console.error(`Error loading games for category ${categoryId}:`, error)
      gamesList.value[categoryId] = [] // Set empty array on error
    }
  }

  const getImageSrc = (prov) => {
    if (prov === 'discover') {
      return '/discover.png' // Use a default image or icon for Discover
    }
    try {
      let name = prov.split("-")
      let imageName = name[1] !== "games" ? prov : name[0]
      return new URL(`../../assets/images/casino/${imageName}.png`,
        import.meta.url)
    } catch (error) {
      console.error('Error loading category image:', error)
      return new URL(`../../assets/images/casino/virtuals.png`,
        import.meta.url)
    }
  }

  const activeBonus = computed(() => {
    return userStore.casinoActiveBonus
  })

  async function getCategories() {
    try {
      const response = await getTopGameCategories()
      let filteredCategory = response.data.filter((c) => c.priority !== -1)
      topGameCategories.value = [discoverCategory, ...filteredCategory.sort((a, b) => b.priority - a.priority)]
      activeCategory.value = 'discover'

      // Load games for the first category immediately
      if (topGameCategories.value[1]) {
        await loadGamesForCategory(topGameCategories.value[1].id)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  async function loadDiscoverGames() {
    isLoading.value = true
    // For demo, just fetch games for the first real category
    if (topGameCategories.value.length > 1) {
      const firstCat = topGameCategories.value[1]
      const response = await gamesByTopCategory(firstCat.id)
      discoverGames.value = response.data
    }
    isLoading.value = false
  }

  function onCategoryClick(category) {
    if (category.id === 'discover') {
      activeCategory.value = 'discover'
    } else {
      router.push({
        name: 'casino-category',
        params: {
          category_id: category.id,
          category_name: slugify(category.name)
        }
      })
    }
  }

  const getImagePath = (game) => {
    return `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/Casino2%2F${game.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.png?alt=media`
  }

  async function redirectToGamePlay(game) {
    try {
      if (!userStore.currentUser) {
        return router.push({
          name: "sign-in"
        })
      }

      if (activeBonus.value && activeBonus.value.gameId && activeBonus.value.gameId.includes(game.gameId)) {
        emitter.emit("toggleCasinoDialog", {
          bonus: activeBonus.value,
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

  onBeforeMount(async () => {
    await getCategories()
    await loadDiscoverGames()
  })
</script>

<style>
@import url('@/assets/css/casino/bootstrap.css');

a{
  text-decoration: none !important;
}

  .casino-layout {
    background-color: var(--casino-bg-light);
    min-height: 100vh;
  }

  .section-divider {
    height: 1px;
    background-color: var(--casino-divider);
    margin: 1rem 0;
  }

  .categories-scroll {
    padding: 1rem 0;
    background-color: var(--casino-bg);
  }

  .category-item {
    min-width: 80px;
    max-width: 100px;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0.5rem;
    border-radius: 8px;
  }

  .category-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .category-item.active {
    background-color: rgba(255, 255, 255, 0.15);
  }

  .category-icon {
    width: 50px;
    height: 50px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    padding: 0.5rem;
  }

  .category-icon img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .category-name {
    font-size: 0.8rem;
    color: #fff;
    margin-top: 0.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .games-scroll {
    padding: 1rem 0;
  }

  .game-card {
    min-width: 200px;
    max-width: 200px;
  }

  .card {
    background-color: #1a1d24;
    border: none;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease;
  }

  .card:hover {
    transform: translateY(-5px);
  }

  .card-image {
    height: 150px;
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

  .hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  /* Placeholder styles */
  .placeholder-glow .placeholder {
    background-color: #2a2d35;
    animation: placeholder-glow 2s ease-in-out infinite;
  }

  @keyframes placeholder-glow {
    50% {
      opacity: 0.5;
    }
  }

  .modal-content {
    background-color: var(--casino-bg);
    color: white;
  }

  .modal-header {
    border-bottom-color: var(--casino-divider);
  }

  .modal-body {
    background-color: var(--casino-bg-light);
  }

  .btn-close {
    filter: invert(1) grayscale(100%) brightness(200%);
  }
</style>

<!-- #051C74 -->

<!-- #051C9E -->
