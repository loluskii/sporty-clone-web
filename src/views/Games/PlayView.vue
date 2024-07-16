<template>
  <CasinoLayout>
    <div class="game-play">
      <LoadingSpinner v-if="isLoading"></LoadingSpinner>
      <iframe
        v-if="!isLoading"
        title="casino"
        style="border-style: none; width: 100vw; height: calc(100vh - 122px); overflow: scroll"
        :src="gameURL"
      />
    </div>
  </CasinoLayout>
</template>

<script setup>
import { watch, ref } from 'vue'
import { getCasinoStartUrl } from '@/helpers'
import { useRoute } from 'vue-router'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { useUsersStore } from '@/stores'

const route = useRoute()
const gameURL = ref('')
const isLoading = ref(false)
const { currentUser } = useUsersStore()

watch(
  () => route.params.game_id,
  async (game_id) => {
    await getCasinoURL(game_id)
  },
  { immediate: true } // Trigger the watch callback immediately on component mount
)

async function getCasinoURL(game_id) {
  isLoading.value = true
  let payload = {
    gameId: parseInt(game_id),
    username: 'guest',
    userId: 0,
    demo: true,
    isMobile: true,
    homeUrl: import.meta.env.VITE_SITE_URL,
    authCode: 'demo'
  }
  if (currentUser) {
    payload.username = currentUser.username
    payload.userId = currentUser.id
    payload.demo = false
    payload.authCode = currentUser.authCode
  }
  const res = await getCasinoStartUrl(payload, game_id)
  isLoading.value = false
  gameURL.value = res.url
}
</script>

<style>
.game-play {
  background-color: black;
  min-height: 100vh;
}
</style>
