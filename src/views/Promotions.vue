<script setup>
import BaseLayout from '@/components/Shared/BaseLayout.vue'
import { onMounted, ref } from 'vue'
import { getPromotions } from "@/helpers";
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue';

const promotions = ref([])
const pageTitle = ref("Promotions");
const pageMode = ref("general-mode");
const isLoading = ref(false);
const selectedPromotion = ref(null)

function goToPromotion(promo) {
  pageTitle.value = promo.title;
  selectedPromotion.value = promo
  pageMode.value = "single-mode";
}

function backToGrid() {
  selectedPromotion.value = null;
}

onMounted(async () => {
  isLoading.value = true;
  const res = await getPromotions();
  promotions.value = res?.data ?? [];
  isLoading.value = false;
});
</script>

<template>
    <BaseLayout>
        <div class="container py-5">
            <h2 class="text-center mb-5 fw-bold">Promotions</h2>
            <div v-if="isLoading" class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
                <LoadingSpinner />
            </div>
            <template v-else>
                <!-- Single Promotion View -->
                <div v-if="selectedPromotion" class="single-promo-view mb-5">
                    <button class="btn btn-link mb-3 px-0" @click="backToGrid">
                        <i class="fas fa-arrow-left me-2"></i> Back to all promotions
                    </button>
                    <div class="promo-card card h-100 shadow-sm w-100">
                        <img class="card-img-top promo-img" :src="selectedPromotion.imageUrl" alt="Promo Image" />
                        <div class="card-body d-flex flex-column align-items-center">
                            <h4 class="card-title promo-title fw-bold mb-2 text-center">{{ selectedPromotion.title }}</h4>
                            <!-- Use v-html to render the content as HTML in single view -->
                            <div class="card-text promo-body text-muted mb-2 text-center" v-if="selectedPromotion.content" v-html="selectedPromotion.content"></div>
                            <!-- Optional: Add a link button if promo.link exists -->
                            <!-- <button v-if="selectedPromotion.link" class="btn btn-primary mt-3" @click="goToLink(selectedPromotion.link)">Go to Link</button> -->
                        </div>
                    </div>
                </div>
                <!-- Promotions Grid -->
                <div v-else-if="promotions.length" class="row g-4 justify-content-center">
                    <div v-for="promo in promotions" :key="promo.id" class="col-xl-6 col-lg-5 col-md-6 col-sm-10">
                        <div class="promo-card card h-100 shadow-sm" @click="goToPromotion(promo)" style="cursor:pointer;">
                            <img class="card-img-top promo-img" :src="promo.imageUrl" alt="Promo Image" />
                            <div class="card-body d-flex flex-column justify-content-center align-items-center">
                                <h4 class="card-title promo-title fw-bold mb-0 text-center">{{ promo.title }}</h4>
                                <!-- Body is hidden by CSS but kept in template -->
                                <div class="card-text promo-body text-muted text-center" v-if="promo.content"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="d-flex flex-column align-items-center justify-content-center" style="padding: 110px 0 60px;">
                    <p class="h4">No Promotions Available.</p>
                    <p class="text-muted">Kindly check back soon</p>
                </div>
            </template>
        </div>
    </BaseLayout>
</template>

<style scoped>
@import url('@/assets/css/casino/bootstrap.css');
.x-main-mid {
    width: 100%; /* Ensure it takes full width within its flex container */
    min-width: auto; /* Remove fixed min-width */
    max-width: 1100px; /* Limit max width */
    margin: 0 auto; /* Center the content */
}
.container {
    padding: 0 15px; /* Add some padding on small screens */
}

.promotions-grid .row {
    /* Ensure proper spacing for the grid */
}

.promo-card {
  border-radius: 18px;
  overflow: hidden;
  background: #181a20;
  color: #fff;
  border: none;
  transition: box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.10);
}
.promo-card:hover {
  box-shadow: 0 6px 24px 0 rgba(0,0,0,0.18);
  transform: translateY(-4px) scale(1.01);
}
.promo-img {
  width: 100%;
  height: 220px; /* Fixed height for consistency */
  object-fit: cover;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  background: #23242a;
}
.promo-title {
  font-size: 1.3rem;
  color: #ffd600;
  padding: 1.2rem 0.5rem 1rem 0.5rem; /* Increased padding */
  text-align: center;
  width: 100%;
  line-height: 1.3;
}
/* Hide the body text visually */
.promo-body {
    display: none;
}

.single-promo-view {
  max-width: 800px; /* Slightly larger max width for single view */
  margin: 0 auto 2rem auto;
}

.single-promo-view .promo-img {
    height: 300px; /* Larger image in single view */
}

.single-promo-view .card-body {
    padding: 1.5rem;
}

.single-promo-view .promo-title {
     padding: 0 0 1rem 0; /* Adjusted padding in single view */
}

.single-promo-view .promo-body {
    display: block; /* Show body in single view */
    font-size: 1rem;
    color: #b0b0b0;
    padding: 0 1rem;
}

.btn-link {
  color: #ffd600;
  font-weight: 500;
  text-decoration: none;
}
.btn-link:hover {
  color: #fff;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .promo-img {
    height: 160px;
  }
  .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .promo-title {
    font-size: 1.1rem;
    padding: 1rem 0.5rem 0.8rem 0.5rem;
  }
  .single-promo-view {
    max-width: 100%;
  }
  .single-promo-view .promo-img {
    height: 200px; /* Adjusted height for single view on mobile */
  }
    .single-promo-view .card-body {
        padding: 1rem;
    }
     .single-promo-view .promo-body {
        padding: 0 0.5rem;
    }
}
</style>
