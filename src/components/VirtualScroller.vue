<template>
  <div 
    ref="container" 
    class="virtual-scroller"
    @scroll="handleScroll"
  >
    <div 
      class="virtual-scroller__content"
      :style="{ height: `${totalHeight}px` }"
    >
      <div
        v-for="item in visibleItems"
        :key="item.tournamentID"
        class="virtual-scroller__item"
        :style="{ transform: `translateY(${item.top}px)` }"
      >
        <slot :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  itemHeight: {
    type: Number,
    required: true
  },
  overscan: {
    type: Number,
    default: 3
  }
})

const container = ref(null)
const scrollTop = ref(0)
const viewportHeight = ref(0)

// Calculate total height of all items
const totalHeight = computed(() => props.items.length * props.itemHeight)

// Calculate visible items based on scroll position
const visibleItems = computed(() => {
  const startIndex = Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.overscan)
  const endIndex = Math.min(
    props.items.length,
    Math.ceil((scrollTop.value + viewportHeight.value) / props.itemHeight) + props.overscan
  )

  return props.items.slice(startIndex, endIndex).map((item, index) => ({
    ...item,
    top: (startIndex + index) * props.itemHeight
  }))
})

// Handle scroll events with throttling
let scrollTimeout
const handleScroll = () => {
  if (scrollTimeout) return
  
  scrollTimeout = setTimeout(() => {
    if (container.value) {
      scrollTop.value = container.value.scrollTop
    }
    scrollTimeout = null
  }, 16) // ~60fps
}

// Update viewport height on resize
const updateViewportHeight = () => {
  if (container.value) {
    viewportHeight.value = container.value.clientHeight
  }
}

onMounted(() => {
  updateViewportHeight()
  window.addEventListener('resize', updateViewportHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewportHeight)
})
</script>

<style scoped>
.virtual-scroller {
  height: 100%;
  overflow-y: auto;
  position: relative;
  will-change: transform;
}

.virtual-scroller__content {
  position: relative;
  width: 100%;
}

.virtual-scroller__item {
  position: absolute;
  width: 100%;
  will-change: transform;
}
</style> 