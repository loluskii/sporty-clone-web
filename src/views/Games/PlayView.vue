<template>
  <CasinoLayout>
    <div class="game-play">
      <LoadingSpinner v-if="isLoading"></LoadingSpinner>
      <div v-if="!isLoading" class="game-container">
        <div class="game-header">
          <button class="btn p-0 text-white" @click="router.back()">
            <i class="x-icon-back"></i>
            <span class="ms-2">Back to Games</span>
          </button>
        </div>
        <iframe
          title="casino"
          style="border-style: none; width: 100%; height: calc(100vh - 60px); overflow: scroll"
          :src="gameURL"
        />
      </div>
    </div>
  </CasinoLayout>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue'
import { getCasinoStartUrl } from '@/helpers'
import CasinoLayout from '@/components/Shared/CasinoLayout.vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { useUsersStore } from '@/stores'
import emitter from '@/plugins/emitter'

const route = useRoute()
const router = useRouter()
const gameURL = ref('')
const isLoading = ref(false)
const { currentUser } = useUsersStore()

async function getCasinoURL() {
  isLoading.value = true;

  try {
    const { game_id } = route.params;
    const { bonusId, balanceType, bonusType } = route.query;
    const { username, id, authCode } = currentUser || {};

    let payload = {
      gameId: parseInt(game_id),
      clientId: import.meta.env.VITE_CLIENT_ID,
      username,
      userId: id,
      demo: false,
      isMobile: false,
      homeUrl: import.meta.env.VITE_SITE_URL,
      authCode,
      balanceType: "real",
    };

    if (bonusId && balanceType === "bonus") {
      Object.assign(payload, {
        isBonus: true,
        bonusType,
        bonusId,
        balanceType: "bonus",
      });
    }

    const res =
      game_id === "smat_virtual"
        ? await getSmatVirtualStartUrl({
            clientId: payload.clientId,
            userId: id,
            token: authCode,
          })
        : await getCasinoStartUrl(payload, "real");

    gameURL.value = res.url;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await getCasinoURL();
  // router.beforeEach((to, from, next) => {
  //   previousRoute.value = from.fullPath; // Store the previous route
  //   next();
  // });
});
</script>

<style>
.game-play {
  background-color: black;
  min-height: 100vh;
}

.game-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.game-header {
  background-color: var(--casino-bg);
  padding: 1rem;
  display: flex;
  align-items: center;
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

.btn:hover .x-icon-back {
  color: var(--casino-primary);
}
</style>
