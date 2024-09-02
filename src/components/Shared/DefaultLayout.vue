<template>
  <div class="x-page">
    <Header></Header>
    <div class="x-page-wrapper">
      <slot></slot>
    </div>
    <Footer></Footer>
  </div>
</template>
<script setup>
import Header from './Header.vue'
import Footer from './Footer.vue'
</script>

<style>
.size-14 {
  font-size: 1.16666667rem;
}
.size-18 {
  font-size: 1.5rem;
}
.size-20 {
  font-size: 1.66666667rem;
}
.size-24 {
  font-size: 2rem;
}
.text-center {
  text-align: center;
}
.dark {
  color: #353a45;
}
.darkGray {
  color: #9ca0ab;
}
.green {
  color: #0d9737;
}
.bg-white {
  background-color: #fff;
}
.bold {
  font-weight: bold;
}
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.mg-r-12 {
  margin-right: 12px;
}
.mg-t-16 {
  margin-top: 16px;
}
.mg-b-16 {
  margin-bottom: 16px;
}
.mg-b-36 {
  margin-bottom: 36px;
}
.mg-b-40 {
  margin-bottom: 40px;
}
.mg-t-40 {
  margin-top: 40px;
}
.pd-t-40 {
  padding-top: 40px;
}
.pd-b-24 {
  padding-bottom: 24px;
}
.pd-hor-20 {
  padding-right: 20px;
  padding-left: 20px;
}
.pd-hor-100 {
  padding-left: 8.33333333rem;
  padding-right: 8.33333333rem;
}
.pd-ver-40 {
  padding-top: 40px;
  padding-bottom: 40px;
}
.flex-column {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
}
.justify-between {
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
.align-center {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}
.icon-sms::before {
  content: '\e6bd';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.icon-voice::before {
  content: '\e6be';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.icon-reverse_sms::before {
  content: '\e6d22';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.icon-arrow-right::before {
  content: '\e608';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.icon-back::before {
  content: '\e604';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.pointer {
  cursor: pointer;
}
</style>
