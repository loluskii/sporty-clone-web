<template>
  <div class="pagination">
    <span
      class="pageNum icon-prev"
      :class="{ 'icon-disabled': currentPage === 1 }"
      @click="handlePrevPage"
    ></span>
    <span
      v-for="pageNumber in pageRange"
      :key="pageNumber"
      @click="handlePageClick(pageNumber)"
      class="pageNum"
      :class="pageNumber === currentPage ? 'selected' : ''"
      >{{ pageNumber }}</span
    >
    <span
      class="pageNum icon-next"
      :class="{ 'icon-disabled': currentPage === totalPages }"
      @click="handleNextPage"
    ></span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:currentPage'])

// Calculate the range of page numbers to display
const pageRange = computed(() => {
  const maxButtons = 10 // Maximum number of buttons to display
  let startPage = Math.max(props.currentPage - Math.floor(maxButtons / 2), 1)
  let endPage = Math.min(startPage + maxButtons - 1, props.totalPages)

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(endPage - maxButtons + 1, 1)
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
})

const handlePrevPage = () => {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1)
  }
}

const handleNextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('update:currentPage', props.currentPage + 1)
  }
}

const handlePageClick = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}
</script>

<style scoped>
.pagination {
  margin: 10px auto;
  text-align: center;
}

.pagination .pageNum {
  display: inline-block;
  width: 18px;
  height: 18px;
  color: #353a45;
  margin: 0 5px;
  cursor: pointer;
}

.pagination .icon-next,
.pagination .icon-prev {
  margin: 0 !important;
  font-size: 0;
}

.pagination .icon-next::before,
.pagination .icon-prev::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}

.pagination .icon-next:before,
.pagination .icon-prev:before {
  font-size: 12px;
  color: #353a45;
  font-weight: bold;
}

.pagination .icon-prev {
  -webkit-transform-origin: 50% 50%;
  -ms-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
  -webkit-transform: rotate(-180deg);
  -ms-transform: rotate(-180deg);
  transform: rotate(-180deg);
}

.pagination .icon-disabled {
  cursor: default;
  opacity: 0.5;
}

.pagination .selected {
  background: #eaecef;
  border-radius: 2px;
  cursor: default;
}
</style>
