<template>
  <div class="provider-card text-center">
    <div v-if="loading" class="placeholder-glow">
      <div class="provider-image placeholder"></div>
      <div class="placeholder w-75 mt-2"></div>
    </div>
    <div v-else>
      <div class="provider-image" :style="{ backgroundImage: 'url(' + image + ')' }"></div>
      <div class="provider-name text-white mt-2">{{ name }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  image: String,
  name: String,
  loading: Boolean
})
</script>

<style scoped>
.provider-card {
  cursor: pointer;
  transition: transform 0.3s ease;
  width: 180px; /* Make provider cards wider */
}

.provider-card:hover {
  transform: translateY(-5px);
}

.provider-image {
  width: 100%;
  height: 120px; /* Adjust height as needed */
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  background-color: #2a2d35; /* Placeholder background */
}

.provider-name {
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
