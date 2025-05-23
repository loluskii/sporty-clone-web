<template>
  <div class="categories-scroll">
    <div class="d-flex justify-content-center overflow-auto hide-scrollbar">
      <div v-for="category in categories"
           :key="category.id"
           class="category-item text-center mx-3"
           :class="{ 'active': activeCategory == category.id }"
           @click="() => onCategoryClick(category)">
        <div class="category-icon">
          <img :src="getImageSrc(category.slug)" class="img-fluid" alt="" />
        </div>
        <div class="category-name mt-2">{{ category.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: Array,
  activeCategory: String,
  onCategoryClick: Function
})

function getImageSrc(prov) {
  if (prov === 'discover') {
    return new URL('../../assets/images/casino/all.png', import.meta.url)
  }
  try {
    let name = prov.split("-")
    let imageName = name[1] !== "games" ? prov : name[0]
    return new URL(`../../assets/images/casino/${imageName}.png`, import.meta.url)
  } catch (error) {
    return new URL(`../../assets/images/casino/virtuals.png`, import.meta.url)
  }
}
</script>

<style scoped>
.categories-scroll {
  padding: 1rem 0;
  background-color: var(--casino-bg, #1a1d24);
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
  width: 45px;
  height: 45px;
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
  font-size: 1.1rem;
  color: #fff;
  margin-top: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
}
</style> 