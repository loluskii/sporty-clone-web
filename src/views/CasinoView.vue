<template>
    <CasinoLayout>
        <div v-if="isLoading" class="game-play">
            <template >
                <div>
                    <img src="/logo.png" alt="" style="height: 50px" />
                    <LoadingSpinner></LoadingSpinner>
                </div>
            </template>
        </div>
        <div v-if="!isLoading" class="game-container">
            <iframe title="casino" style="border-style: none; width: 100%; height: calc(100vh - 60px); overflow: scroll"
                :src="gameURL" />
        </div>
    </CasinoLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getGameLobbyUrl } from '@/helpers'
import CasinoLayout from '@/components/Shared/CasinoLayout.vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import { useUsersStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const gameURL = ref('')
const isLoading = ref(false)
const { currentUser } = useUsersStore()

async function getCasinoURL() {
    isLoading.value = true

    try {
        const { game_id } = route.params
        const { bonusId, balanceType, bonusType } = route.query
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
        gameURL.value = res.url
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
}

onMounted(async () => {
    await getCasinoURL()
    router.beforeEach((to, from, next) => {
        previousRoute.value = from.fullPath; // Store the previous route
        next();
    });
})
</script>

<style>
.game-play {
    background-color: black;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
