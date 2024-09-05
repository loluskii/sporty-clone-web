<template>
  <div data-v-022c2a4e="" class="m-steps is-horizontal is-center">
    <div
      v-for="step in steps"
      :key="step.id"
      class="m-step is-horizontal"
      :style="step.id !== 3 ? 'width: 30%' : ''"
    >
      <div
        class="m-step__head is-text"
        :class="
          activeStep === step.id ? 'is-process' : step.id < activeStep ? 'is-success' : 'is-wait'
        "
      >
        <div class="m-step__line is-horizontal" style="margin: 0px 56px">
          <i
            class="m-step__line-inner"
            style="transition-delay: 0ms; border-width: 0px; width: 0%"
          ></i>
        </div>
        <span class="m-step__icon"
          ><div>{{ step.id }}</div></span
        >
      </div>
      <div class="m-step__main" style="margin-left: 0px">
        <div
          class="m-step__title"
          :class="
            activeStep === step.id ? 'is-process' : step.id < activeStep ? 'is-success' : 'is-wait'
          "
        >
          {{ step.title }}
        </div>
        <div
          class="m-step__description"
          :class="
            activeStep === step.id ? 'is-process' : step.id < activeStep ? 'is-success' : 'is-wait'
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const steps = [
  {
    id: 1,
    title: 'Confirm Account'
  },
  {
    id: 2,
    title: 'Reset Password'
  },
  {
    id: 3,
    title: 'Success'
  }
]
defineProps({
  activeStep: Number
})
</script>

<style>
.m-page-wrapper .m-header-bar {
  background: #fff;
}
.m-step {
  position: relative;
  vertical-align: top;
}
.m-step:last-child .m-step__main {
  padding-right: 0;
}
.m-step.is-horizontal {
  display: inline-block;
}
.m-step .is-process {
  color: #353a45;
}
.m-step .is-finish {
  color: #0d9737;
}
.m-step .is-error {
  color: #e41827;
}
.m-step .is-success {
  color: #353a45;
}
.m-step .is-wait {
  color: #9ca0ab;
}
.m-step.is-vertical .m-step__head,
.m-step.is-vertical .m-step__main {
  display: inline-block;
}
.m-step.is-vertical .m-step__main {
  padding-left: 10px;
}
.m-step .m-step__line {
  display: inline-block;
  position: absolute;
  border-color: inherit;
  background-color: #9ca0ab;
}
.m-step .m-step__line.is-horizontal {
  top: 15px;
  height: 2px;
  left: 32px;
  right: 0;
}
.m-step .m-step__line.is-vertical {
  width: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  top: 32px;
  bottom: 0;
  left: 15px;
}
.m-step .m-step__line-inner {
  display: block;
  border-width: 1px;
  border-style: solid;
  border-color: inherit;
  -webkit-transition: all 150ms;
  transition: all 150ms;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 0;
  height: 0;
}
.m-step .m-step__icon {
  display: block;
  line-height: 39px;
}
.m-step .m-step__icon > div {
  font-size: 18px;
}
.m-step .m-step__icon > * {
  line-height: inherit;
  vertical-align: middle;
}
.m-step .m-step__icon .m-icon-success {
  color: #fff;
  -webkit-transform: scale(1.5);
  -ms-transform: scale(1.5);
  transform: scale(1.5);
  font-weight: bold;
  display: inline-block;
}
.m-step .m-step__icon .m-icon-success::before {
  content: '\e611';
  font-family: 'iconfont' !important;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
}
.m-step .m-step__head {
  width: 39px;
  height: 39px;
  border-radius: 50%;
  background-color: 'transparent';
  text-align: center;
  line-height: 39px;
  font-size: 39px;
  vertical-align: top;
  -webkit-transition: all 150ms;
  transition: all 150ms;
}
.m-step .m-step__head.is-text {
  font-size: 18px;
  color: #fff;
}
.m-step .m-step__head.is-text.is-process {
  background-color: #0d9737;
  border-color: #0d9737;
}
.m-step .m-step__head.is-text.is-wait {
  color: #fff;
  background-color: #9ca0ab;
  border-color: #9ca0ab;
}
.m-step .m-step__head.is-text.is-success {
  background-color: #0d9737;
  border-color: #0d9737;
}
.m-step .m-step__head.is-text.is-error {
  background-color: #e41827;
  border-color: #e41827;
}
.m-step .m-step__head.is-text.is-finish {
  background-color: #0d9737;
  border-color: #0d9737;
}
.m-step .m-step__head.is-process {
  border-color: #353a45;
}
.m-step .m-step__head.is-wait {
  border-color: #9ca0ab;
}
.m-step .m-step__head.is-success {
  border-color: #0d9737;
}
.m-step .m-step__head.is-error {
  border-color: #e41827;
}
.m-step .m-step__head.is-finish {
  border-color: #0d9737;
}
.m-step .m-step__main {
  white-space: normal;
  padding-right: 10px;
  text-align: left;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.m-step .m-step__title {
  margin-top: 5px;
  font-size: 20px;
  line-height: 33px;
  display: inline-block;
  font-weight: bold;
  -webkit-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
  position: relative;
  left: 20px;
}
.m-step .m-step__title.is-wait {
  font-weight: normal;
}
.m-step .m-step__description {
  font-size: 12px;
  font-weight: normal;
  line-height: 14px;
}
.x-page-wrapper .m-steps {
  background: #fff;
  border-bottom: 1px solid #eaecef;
  padding: 35px 0 32px;
}
.m-steps {
  font-size: 0;
}
.m-steps > :last-child .m-step__line {
  display: none;
}
.m-steps.is-horizontal {
  white-space: nowrap;
}
.m-steps.is-horizontal.is-center {
  text-align: center;
}
</style>
