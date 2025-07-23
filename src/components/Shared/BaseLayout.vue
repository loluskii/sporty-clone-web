<script setup>
import Header from '@/components/Shared/Header.vue'
import Footer from '@/components/Shared/Footer.vue'
import DefaultHeaderItems from './DefaultHeaderItems.vue'
import { defineComponent } from 'vue'
import { useUtilsStore } from '@/stores'

const utilsStore = useUtilsStore()

defineComponent({
  name: 'base-layout'
})
</script>

<template>
  <div class="x-page">
    <Header>
      <DefaultHeaderItems v-if="utilsStore.showDefaultHeaderItems"></DefaultHeaderItems>
    </Header>
    <div class="x-main x-layout-main">
      <div class="x-main-top">
        <slot name="top"></slot>
      </div>
      <div class="x-table x-main-bottom">
        <slot></slot>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<style scoped></style>
