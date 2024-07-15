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
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  height: 100vh;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  position: relative;
}
</style>
