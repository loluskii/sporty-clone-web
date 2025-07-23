<template>
  <div class="casino-game-card" :class="{ skeleton: loading }">
    <div class="game-image-wrapper">
      <div v-if="loading" class="skeleton-image"></div>
      <img v-else :src="image" :alt="title" class="game-image" />
    </div>
    <div class="game-info mt-2">
      <div v-if="loading" class="skeleton-title"></div>
      <div v-else class="game-title">{{ title }}</div>
      <div v-if="loading" class="skeleton-provider"></div>
      <div v-else class="game-provider">{{ provider.name }}</div>
      <div v-if="loading" class="skeleton-tags"></div>
      <div v-else-if="tags && tags.length" class="game-tags">
        <span v-for="(tag, i) in tags" :key="i" class="game-tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  image: String,
  title: String,
  provider: Object,
  tags: Array,
  loading: Boolean
})
</script>

<style scoped>
.casino-game-card {
  background: #181a20;
  border-radius: 16px;
  padding: 0.75rem 0.75rem 1rem 0.75rem;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* min-height: 270px; */
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.casino-game-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.18);
}
.game-image-wrapper {
  width: 100%;
  aspect-ratio: 16/10;
  border-radius: 12px;
  overflow: hidden;
  background: #23242a;
  display: flex;
  align-items: center;
  justify-content: center;
}
.game-image {
  height: 100%;
  /* width: 100%;
  object-fit: cover;
  border-radius: 12px;
  object-position: top; */
  display: block;
}
.game-title {
  color: #ffd600;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}
.game-provider {
  color: #b0b0b0;
  font-size: 0.95rem;
  margin-bottom: 0.15rem;
}
.game-tags {
  color: #b0b0b0;
  font-size: 0.85rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
.game-tag {
  background: #23242a;
  border-radius: 6px;
  padding: 0.1rem 0.5rem;
  font-size: 0.8em;
}
/* Skeleton styles */
.skeleton {
  pointer-events: none;
  animation: skeleton-bg 1.2s infinite linear alternate;
}
.skeleton-image,
.skeleton-title,
.skeleton-provider,
.skeleton-tags {
  background: #23242a;
  border-radius: 6px;
  margin-bottom: 0.3rem;
}
.skeleton-image {
  width: 100%;
  aspect-ratio: 16/9;
  height: 120px;
}
.skeleton-title {
  width: 70%;
  height: 18px;
}
.skeleton-provider {
  width: 50%;
  height: 14px;
}
.skeleton-tags {
  width: 60%;
  height: 12px;
}
@keyframes skeleton-bg {
  0% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}
</style>
