<template>
  <div class="m-reset-succ">
    <div>Password has been reset. You can now use your new password to log in.</div>
    <button @click="$router.push({ name: 'home' })" class="af-button af-button--primary">
      <span><span>Back to Home</span></span>
    </button>
  </div>
</template>
<style>
.m-page .btn-wrapper,
.m-page .af-button {
  width: 100%;
  height: 38px;
}
.m-page .af-button {
  padding-left: 0;
  padding-right: 0;
  text-align: center;
  border: none !important;
  font-size: 16px;
  border-radius: 2px;
}
.m-page .af-button--primary {
  background: #0d9737 !important;
  color: #fff !important;
}

.m-page .is-disabled {
  background: #dcdee5 !important;
  color: #fff !important;
}
.m-page .is-disabled:hover,
.m-page .is-disabled:active {
  background: #dcdee5 !important;
  color: #fff !important;
}
.m-reset-succ {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  color: #353a45;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  font-size: 16px;
  margin-top: 20px;
  padding: 8px auto 27px auto;
  width: 100%;
}
.m-reset-succ .af-button {
  width: 300px !important;
  margin-top: 40px;
}
</style>
