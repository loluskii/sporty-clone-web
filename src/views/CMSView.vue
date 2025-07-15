<template>
  <CMSLayout>
    <div style="">
      <div class="body">
        <LoadingSpinner v-if="isLoading"></LoadingSpinner>
        
        <div v-else v-html="html"></div>
      </div>
    </div>
  </CMSLayout>
</template>

<script setup>
// import HeaderOther from '@/components/HeaderOther.vue'
import { getCMSPage } from '@/helpers'
import { onMounted, ref } from 'vue'
import LoadingSpinner from '@/components/Loaders/LoadingSpinner.vue'
import CMSLayout from '@/components/Shared/CMSLayout.vue'
import { useRoute } from 'vue-router'
// import

const html = ref('')
const isLoading = ref(false)
const route = useRoute()

const getPageContent = async (slug) => {
    try {
      isLoading.value = true
      const res = await getCMSPage(slug)
      isLoading.value = false
      html.value = Object.values(res.data)[0].content
    } catch (error) {
        alert(error)
    }
}

onMounted(async () => {
    await getPageContent(route.params.page)
})
</script>
<style scoped>
.body {
  padding: 1.5rem;
  margin: 0rem 1.5rem;
  background-color: white;
}
h2 {
  font-size: 1.33333333rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1rem;
}
</style>

