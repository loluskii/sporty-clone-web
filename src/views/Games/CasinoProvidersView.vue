<template>
  <CasinoLayout>
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="text-white mb-0">Game Providers</h1>
        <!-- <div class="d-flex gap-2">
          <select v-model="sortBy" class="form-select form-select-sm bg-dark text-white border-secondary">
            <option value="name">Name</option>
            <option value="popular">Popular</option>
          </select>
        </div> -->
      </div>

      <div class="row g-4">
        <template v-if="!isLoading">
          <div
            v-for="provider in sortedProviders"
            :key="provider.id"
            class="col-xl-3 col-lg-4 col-md-6 col-sm-6"
            @click="onProviderClick(provider)"
          >
            <div class="provider-card text-center">
              <div
                class="provider-image"
                :style="{ backgroundImage: 'url(' + getProviderImage(provider) + ')' }"
              ></div>
              <div class="provider-name text-white mt-2">{{ provider.name }}</div>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-for="i in 8" :key="i" class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <div class="provider-card text-center">
              <div class="provider-image placeholder-glow">
                <div class="placeholder"></div>
              </div>
              <div class="provider-name placeholder-glow mt-2">
                <div class="placeholder w-75"></div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </CasinoLayout>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import CasinoLayout from '@/components/Shared/CasinoLayout.vue'
import { getProviders, slugify } from '@/helpers'

const router = useRouter()
const providers = ref([])
const isLoading = ref(false)

const sortedProviders = computed(() => {
  const providersList = [...providers.value]
  return providersList.sort((a, b) => a.name.localeCompare(b.name))
  // switch (sortBy.value) {
  //   case 'popular':
  //   //   return providersList.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
  //   case 'name':
  //   default:
  // }
})

const getProviderImage = (provider) => {
  if (!provider) return '/default-provider.png'
  if (provider.imagePath) return provider.imagePath
  return '/default-provider.png'
}

function onProviderClick(provider) {
  router.push({
    name: 'casino-provider',
    params: {
      provider_id: provider.id,
      provider_name: slugify(provider.name)
    }
  })
}

async function loadProviders() {
  isLoading.value = true
  try {
    const response = await getProviders()
    providers.value = Object.values(response.data)
  } catch (error) {
    console.error('Error loading providers:', error)
    providers.value = []
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(async () => {
  await loadProviders()
})
</script>

<style>
@import url('@/assets/css/casino/bootstrap.css');
a {
  text-decoration: none !important;
}
.provider-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.provider-card:hover {
  transform: translateY(-5px);
}

.provider-image {
  width: 100%;
  height: 180px;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.05);
  position: relative;
}

.provider-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  pointer-events: none;
}

.provider-name {
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.form-select {
  min-width: 120px;
}

.form-select:focus {
  border-color: var(--casino-primary);
  box-shadow: none;
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
</style>
