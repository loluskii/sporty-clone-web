<script setup>
import Header from '@/components/Shared/Header.vue'
import Footer from '@/components/Shared/Footer.vue'
import LiveHeaderItems from './LiveHeaderItems.vue'
</script>

<template>
  <div class="c-page">
    <Header>
      <LiveHeaderItems></LiveHeaderItems>
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

<style>
.c-page {
  background: #1b1e25;
}
.c-page .x-main {
  padding-top: 130px;
  background-image: url(//s.sporty.net/global/main/modules/main/desktop/liveBetting/image/Live-banner@1x.33cf106306.jpg);
  background-position: top center;
  background-repeat: no-repeat;
  position: relative;
  background-color: #1b1e25;
}
.c-page .x-main {
  background-color: #1b1e25 !important;
}
.c-page .x-main-top {
  height: 50px;
  min-height: 50px !important;
  width: 1000px;
  min-width: 1000px;
  margin: 0 auto;
  position: absolute;
  top: 18px;
  left: 50%;
  -webkit-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
}
.c-page .x-main-top > div {
  font-size: 36px;
  color: #fff;
  font-weight: bold;
}
.c-page .x-main-bottom {
  width: 1000px;
  min-width: 1000px;
  margin: 0 auto;
}
</style>
