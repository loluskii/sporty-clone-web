<script setup>
import Header from '@/components/Shared/Header.vue'
import Footer from '@/components/Shared/Footer.vue'
</script>

<template>
  <div class="c-page">
    <Header></Header>
    <div id="games-lobby-wrapper" style="width: 100%; height: 100%">
      <slot></slot>
    </div>
    <Footer></Footer>
  </div>
</template>

<style>
.c-page {
  background: #1b1e25;
}
#games-lobby-wrapper {
  position: relative;
}
</style>
