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
// import { getCasinoStartUrl } from '@/helpers'
import { useRoute } from 'vue-router'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import CasinoLayout from '@/components/Shared/CasinoLayout.vue'

const route = useRoute()
const gameURL = ref('')
const isLoading = ref(false)
watch(
  () => [route.params.provider, route.params.game_id],
  async ([provider, game_id]) => {
    await getCasinoURL(provider, game_id)
  },
  { immediate: true } // Trigger the watch callback immediately on component mount
)

async function getCasinoURL(provider, game_id) {
  isLoading.value = true
  // const res = await getCasinoStartUrl(provider, { game_id })
  isLoading.value = false
  // gameURL.value = getPlayURL(res, provider)
}

function getPlayURL(res, provider) {
  switch (provider) {
    case 'tada-games':
      return res.Data
    default:
      return res.data.link
  }
}
</script>

<style>
.game-play {
  background-color: black;
  min-height: 100vh;
}
</style>
