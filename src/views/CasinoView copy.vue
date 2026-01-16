<template>
  <div class="game-play">
    <template v-if="isLoading">
      <div>
        <img src="/logo.png" alt="" style="height: 50px" />
        <LoadingSpinner></LoadingSpinner>
      </div>
    </template>
    <div v-if="errorState" class="error-message">
      Failed to load Casino. Please try again later.
    </div>
    <!-- <iframe
      v-if="!isLoading"
      title="casino"
      style="border-style: none; width: 100%; height: calc(100% - 60px)"
      :src="gameURL"
    /> -->
  </div>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue'
import { getGameLobbyUrl } from '@/helpers'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { useUsersStore } from '@/stores'

const router = useRouter()
const isLoading = ref(false)
const { currentUser } = useUsersStore()
const previousRoute = ref(null)
const errorState = ref(false)

watch(
  () => [],
  async () => {
    await getCasinoURL()
  },
  { immediate: true }
)

async function getCasinoURL() {
  isLoading.value = true

  try {
    const { username, id, authCode } = currentUser || {}

    let payload = {
      gameId: 0,
      clientId: import.meta.env.VITE_CLIENT_ID,
      username: username || 'Demo',
      userId: id || 0,
      demo: id ? false : true,
      isMobile: true,
      homeUrl: import.meta.env.VITE_SITE_URL,
      authCode: authCode || '111111',
      balanceType: 'real',
      type: 'lobby'
    }

    const res = await getGameLobbyUrl(payload)
    window.location.href = res.url
  } catch (error) {
    errorState.value = true
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await getCasinoURL()
  router.beforeEach((to, from, next) => {
    previousRoute.value = from.fullPath // Store the previous route
    next()
  })
})
</script>

<style scoped>
.game-play {
  background-color: black;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.error-message {
  color: #ff4444;
  text-align: center;
  padding: 1rem;
  background-color: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
  margin: 1rem 15px;
  font-size: 0.95rem;
}
</style>
