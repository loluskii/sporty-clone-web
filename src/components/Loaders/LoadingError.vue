<template>
  <div class="m-loading-wrap">
    <div class="m-loading light">
      <div class="loading-fail">
        <p class="fail-text">
          Data loading failed. Please reload.
        </p>
        <div class="fail-btn" @click="$emit('reload')">Reload</div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style type="text/css">
.m-loading-wrap {
}
.m-loading {
  min-height: 300px;
  background-color: #fafafa;
  /* height: 100%; */
  left: 0px;
  position: absolute;
  text-align: center;
  top: 0px;
  width: 100%;
}
.m-loading .loading {
  -webkit-animation: none;
          animation: none;
  left: 50%;
  position: absolute;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
}
/* .m-loading .loading::before {
  content: '\e610';
  font-family: "iconfont" !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
} */
.m-loading .loading:before {
  -webkit-animation: logoLoading-04c0bf50 1s infinite cubic-bezier(0.4, 0, 1, 1) alternate;
          animation: logoLoading-04c0bf50 1s infinite cubic-bezier(0.4, 0, 1, 1) alternate;
  border-radius: 60px;
  color: #fff;
  display: block;
  font-size: 33px;
  height: 60px;
  line-height: 60px;
  margin-bottom: 10px;
  width: 60px;
}
.m-loading .loading-fail {
  display: block;
  left: 50%;
  margin: 0 auto;
  position: absolute;
  text-align: left;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
  z-index: 111;
}
.m-loading .loading-fail .fail-text {
  display: inline-block;
  font-size: 14px;
}
.m-loading .loading-fail .fail-btn {
  background-color: #0D9737;
  border-radius: 2px;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  height: 32px;
  line-height: 32px;
  margin-top: 18px;
  text-align: center;
  width: 65px;
}
.m-loading .loading-fail .fail-btn:active {
  background-color: #33EA6A;
}
.m-loading .loading-fail .fail-btn:hover {
  background-color: #32CE62;
}
.m-loading.light {
  background: #fff;
}
.m-loading.light .loading {
  color: #9CA0AB;
}
.m-loading.light .loading:before {
  background-color: #EAECEF;
  color: #fff;
}
.m-loading.light .loading-fail .fail-text {
  color: #353A45;
}
.m-loading.dark {
  background: #353A45;
}
.m-loading.dark .loading {
  color: #9CA0AB;
}
.m-loading.dark .loading:before {
  background-color: rgba(234, 236, 239, 0.15);
  color: #353A45;
}
.m-loading.dark .loading-fail .fail-text {
  color: #DCDEE5;
}
</style>
